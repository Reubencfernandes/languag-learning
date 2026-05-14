"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { LANGUAGES, LEVELS, LEVEL_DESCRIPTIONS, type Level } from "@/lib/languages";

export function OnboardingForm() {
  const router = useRouter();
  const [nativeLang, setNativeLang] = useState("en");
  const [targetLangs, setTargetLangs] = useState<string[]>(["es"]);
  const [level, setLevel] = useState<Level>("A1");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleNativeLangChange(code: string) {
    setNativeLang(code);
    setTargetLangs((prev) => prev.filter((l) => l !== code));
  }

  function toggleTargetLang(code: string) {
    setTargetLangs((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (targetLangs.length === 0) {
      setError("Select at least one language to learn.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/me/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nativeLang, targetLang: targetLangs[0], targetLangs, level }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || j.error || "Failed to save.");
        return;
      }
      router.push("/phrases");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-3">
        <span className="text-base font-black text-black tracking-wide block uppercase">I speak</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = nativeLang === lang.code;
            return (
              <button
                type="button"
                key={lang.code}
                onClick={() => handleNativeLangChange(lang.code)}
                className={`p-3 rounded-xl border-3 border-black transition-all duration-200 flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? "bg-[#FFD21E] shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                    : "bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <ReactCountryFlag 
                  countryCode={lang.flag} 
                  svg 
                  style={{ width: "1.5rem", height: "1.5rem" }} 
                  className="transition-transform group-hover:scale-110"
                />
                <span className="font-black text-sm text-black leading-tight">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-base font-black text-black tracking-wide block uppercase">
          I want to learn
          <span className="ml-2 text-xs font-bold text-gray-500 normal-case tracking-normal">(pick one or more)</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {LANGUAGES.filter((l) => l.code !== nativeLang).map((lang) => {
            const isSelected = targetLangs.includes(lang.code);
            return (
              <button
                type="button"
                key={lang.code}
                onClick={() => toggleTargetLang(lang.code)}
                className={`p-3 rounded-xl border-3 border-black transition-all duration-200 flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? "bg-[#FFD21E] shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                    : "bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <ReactCountryFlag 
                  countryCode={lang.flag} 
                  svg 
                  style={{ width: "1.5rem", height: "1.5rem" }} 
                  className="transition-transform group-hover:scale-110"
                />
                <span className="font-black text-sm text-black leading-tight">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-lg font-black text-black tracking-wide uppercase">My current level</div>
        <div className="grid gap-4 sm:grid-cols-5">
          {LEVELS.map((candidate) => {
            const isActive = level === candidate;
            return (
              <button
                type="button"
                key={candidate}
                onClick={() => setLevel(candidate)}
                className={`p-4 text-left rounded-2xl border-3 border-black transition-all block w-full ${
                  isActive
                    ? "bg-[#FFD21E] shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                    : "bg-white shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <div className="text-xl font-black text-black">{candidate}</div>
                <div className="mt-1 text-xs font-bold leading-relaxed text-gray-700">
                  {LEVEL_DESCRIPTIONS[candidate]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border-3 border-black bg-[#FF8080] p-4 text-base font-black text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending || targetLangs.length === 0}
        className="w-full py-4 px-6 rounded-2xl border-3 border-black bg-[#0EA5A4] hover:bg-[#0c8b8a] text-white font-black text-lg tracking-wider uppercase shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {isPending ? "Saving..." : "Start learning"}
      </button>
    </form>
  );
}

