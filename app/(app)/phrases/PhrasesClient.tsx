"use client";

import { useState } from "react";
import type { PhraseAnalysis } from "@/lib/hf/phrases";
import type { Level } from "@/lib/languages";
import { LevelPicker } from "@/components/LevelPicker";
import { PhraseResult } from "./PhraseResult";
import { EmptyState } from "./PhraseResult/EmptyState";

const examples = ["Car", "Dog", "Teacher", "finding lost documents"];

export function PhrasesClient({ defaultLevel, lang }: { defaultLevel: Level; lang: string }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PhraseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [level, setLevel] = useState<Level>(defaultLevel);

  async function analyze(value = text) {
    if (isPending) return;
    const phrase = value.trim();
    if (!phrase) {
      setError("Enter a phrase first.");
      return;
    }
    setError(null);

    setIsPending(true);
    try {
      const res = await fetch("/api/phrases", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: phrase, level }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || data.error || "Could not analyze this phrase.");
        return;
      }
      setResult((await res.json()) as PhraseAnalysis);
    } catch {
      setError("Could not analyze this phrase.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 sm:p-10 border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label className="text-base font-black uppercase tracking-widest text-black" htmlFor="phrase-input">
              Phrase or word
            </label>
            <LevelPicker value={level} onChange={setLevel} size="sm" label="Level" />
          </div>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-stretch">
            <input
              id="phrase-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && analyze()}
              placeholder="Type a phrase, word, or verb..."
              className="h-20 w-full sm:flex-1 rounded-2xl border-4 border-black bg-white px-8 text-2xl font-black text-black outline-none transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_rgba(0,0,0,1)] placeholder:text-xl placeholder:font-bold placeholder:text-gray-400 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            />
            <button
              onClick={() => analyze()}
              disabled={isPending}
              className="flex h-20 w-full sm:w-auto sm:px-12 items-center justify-center rounded-2xl bg-[#0EA5A4] border-4 border-black text-xl font-black text-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 uppercase tracking-widest shrink-0"
            >
              {isPending ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {!text && (
            <div className="mt-6 flex flex-wrap gap-3">
              {examples.map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setText(example);
                    analyze(example);
                  }}
                  className="rounded-xl bg-[#FFD21E] border-2 border-black px-5 py-2.5 text-sm font-black text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-tight"
                >
                  {example}
                </button>
              ))}
            </div>
          )}
          {error ? (
            <div className="mt-6 rounded-2xl border-4 border-black bg-[#FF8080] p-6 text-base font-black text-black shadow-[5px_5px_0px_rgba(0,0,0,1)]">
              {error}
            </div>
          ) : null}
        </div>

      {isPending ? <EmptyState isPending /> : result ? <PhraseResult result={result} lang={lang} /> : <EmptyState />}
    </div>
  );
}
