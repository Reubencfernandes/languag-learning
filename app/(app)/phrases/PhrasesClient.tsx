"use client";

import { useState } from "react";
import type { PhraseAnalysis } from "@/lib/hf/phrases";
import type { Level } from "@/lib/languages";
import { LevelPicker } from "@/components/LevelPicker";
import { PhraseResult } from "./PhraseResult";
import { EmptyState } from "./PhraseResult/EmptyState";

const examples = ["to find", "I would like...", "appointment", "Can you help me?", "because"];

export function PhrasesClient({ defaultLevel }: { defaultLevel: Level }) {
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
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="duo-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="duo-eyebrow text-[#7C3AED]" htmlFor="phrase-input">
              Phrase or word
            </label>
            <LevelPicker value={level} onChange={setLevel} size="sm" label="Level" />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="phrase-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && analyze()}
              placeholder="Type a phrase, word, or verb..."
              className="duo-input flex-1"
            />
            <button
              onClick={() => analyze()}
              disabled={isPending}
              className="btn-duo btn-duo-secondary text-sm"
            >
              {isPending ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {error ? <p className="mt-3 text-sm font-black text-[#BE123C]">{error}</p> : null}
        </div>

        <aside className="duo-card p-5">
          <div className="duo-eyebrow">Try one</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                onClick={() => {
                  setText(example);
                  analyze(example);
                }}
                className="rounded-full border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-black text-[#7C3AED] transition hover:bg-[#F5F3FF]"
              >
                {example}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {result ? <PhraseResult result={result} /> : <EmptyState />}
    </div>
  );
}
