"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, LEVELS, LEVEL_DESCRIPTIONS, type Level } from "@/lib/languages";

export function OnboardingForm() {
  const router = useRouter();
  const [nativeLang, setNativeLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [level, setLevel] = useState<Level>("A1");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (nativeLang === targetLang) {
      setError("Native and target languages must differ.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/me/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nativeLang, targetLang, level }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || j.error || "Failed to save.");
        return;
      }
      router.push("/practice");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <LangSelect label="I speak" value={nativeLang} onChange={setNativeLang} />
        <LangSelect label="I want to learn" value={targetLang} onChange={setTargetLang} exclude={nativeLang} />
      </div>

      <div className="space-y-3">
        <div className="text-base font-black text-[#3C3C3C]">My current level</div>
        <div className="grid gap-3 sm:grid-cols-5">
          {LEVELS.map((candidate) => (
            <button
              type="button"
              key={candidate}
              onClick={() => setLevel(candidate)}
              className={`card-duo px-4 py-4 text-left ${level === candidate ? "card-duo-active" : ""}`}
            >
              <div className="text-lg font-black text-[#3C3C3C]">{candidate}</div>
              <div className="mt-1 text-xs font-bold leading-snug text-[#777777]">
                {LEVEL_DESCRIPTIONS[candidate]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error ? <div className="rounded-2xl border-2 border-[#FECDD3] bg-[#FFE4E6] p-3 text-sm font-black text-[#BE123C]">{error}</div> : null}

      <button type="submit" disabled={isPending} className="btn-duo btn-duo-primary w-full">
        {isPending ? "Saving..." : "Start learning"}
      </button>
    </form>
  );
}

function LangSelect({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  exclude?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-base font-black text-[#3C3C3C]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="duo-input h-14 cursor-pointer appearance-none pr-10 text-base"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Cpath%20fill%3D%22%23777777%22%20d%3D%22M4%206l4%204%204-4z%22%2F%3E%3C%2Fsvg%3E")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          backgroundSize: "1rem auto",
        }}
      >
        {LANGUAGES.filter((language) => language.code !== exclude).map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </label>
  );
}

