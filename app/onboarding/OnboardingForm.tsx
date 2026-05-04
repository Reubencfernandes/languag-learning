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
    <form onSubmit={submit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <LangSelect label="I speak" value={nativeLang} onChange={setNativeLang} />
        <LangSelect label="I want to learn" value={targetLang} onChange={setTargetLang} exclude={nativeLang} />
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-[#E1E0CC]">My current level</div>
        <div className="grid gap-2 sm:grid-cols-5">
          {LEVELS.map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => setLevel(l)}
              className="rounded-xl border px-3 py-3 text-left transition"
              style={{
                borderColor: level === l ? "rgba(222,219,200,0.6)" : "rgba(225,224,204,0.1)",
                background: level === l ? "rgba(222,219,200,0.08)" : "#101010",
              }}
            >
              <div className="text-base font-semibold text-[#E1E0CC]">{l}</div>
              <div className="text-[11px] leading-snug" style={{ color: "rgba(225,224,204,0.45)" }}>
                {LEVEL_DESCRIPTIONS[l]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error ? <div className="text-sm text-red-400">{error}</div> : null}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Start learning"}
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
      <span className="text-sm font-medium text-[#E1E0CC]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border px-3 text-sm text-[#E1E0CC] bg-[#101010] focus:outline-none focus:border-primary/50"
        style={{ borderColor: "rgba(225,224,204,0.15)" }}
      >
        {LANGUAGES.filter((l) => l.code !== exclude).map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </label>
  );
}
