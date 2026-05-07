"use client";

import { useState } from "react";
import { Languages, Lightbulb, ListChecks, MessageSquareText, PenLine, Sparkles } from "lucide-react";
import type { PhraseAnalysis } from "@/lib/hf/phrases";
import type { Level } from "@/lib/languages";
import { LevelPicker } from "@/components/LevelPicker";
import { Furi } from "@/components/Furi";

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
    <div className="space-y-10">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[28px] bg-[#E8F0FE] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-black text-[#155DD7]" htmlFor="phrase-input">
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
              className="min-h-14 flex-1 rounded-full border-0 bg-white px-5 text-base font-bold text-[#202124] outline-none ring-2 ring-transparent transition placeholder:text-[#8A94A6] focus:ring-[#155DD7]"
            />
            <button
              onClick={() => analyze()}
              disabled={isPending}
              className="min-h-14 rounded-full bg-[#155DD7] px-8 text-sm font-black text-white shadow-[0_4px_0_#0F45A0] transition active:translate-y-1 active:shadow-none disabled:opacity-60"
            >
              {isPending ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {error ? <p className="mt-3 text-sm font-black text-[#BE123C]">{error}</p> : null}
        </div>

        <aside className="rounded-[28px] bg-white p-5 shadow-[inset_0_0_0_1px_#E5E5E5]">
          <div className="text-sm font-black text-[#777777]">Try one</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                onClick={() => {
                  setText(example);
                  analyze(example);
                }}
                className="rounded-full bg-[#F4F7FF] px-4 py-2 text-xs font-black text-[#155DD7] hover:bg-[#E8F0FE]"
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

function EmptyState() {
  return (
    <div className="rounded-[28px] bg-white p-10 text-center shadow-[inset_0_0_0_1px_#E5E5E5]">
      <PenLine size={34} className="mx-auto text-[#155DD7]" />
      <h2 className="mt-4 text-2xl font-black text-[#202124]">Enter a phrase to build a mini lesson</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-6 text-[#4B5563]">
        You will get a translation, grammar breakdown, example sentences, tips, and verb information when relevant.
      </p>
    </div>
  );
}

function PhraseResult({ result }: { result: PhraseAnalysis }) {
  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-[#E8F0FE] p-7">
        <div className="text-sm font-black text-[#155DD7]">{result.partOfSpeech}</div>
        <h2 className={`mt-2 text-4xl font-black leading-tight text-[#202124] ${result.inputSegments ? "has-furi" : ""}`}>
          <Furi text={result.input} segments={result.inputSegments} />
        </h2>
        <p className="mt-3 text-xl font-bold text-[#4B5563]">{result.translation}</p>
      </div>

      <Section title="Example sentences" icon={<MessageSquareText size={24} />}>
        <div className="grid gap-4">
          {result.sentences.map((sentence, index) => (
            <div key={`${sentence.target}-${index}`} className="rounded-[24px] bg-[#E8F0FE] p-5">
              <div className={`text-xl font-black text-[#202124] ${sentence.targetSegments ? "has-furi" : ""}`}>
                <Furi text={sentence.target} segments={sentence.targetSegments} />
              </div>
              <div className="mt-2 text-sm font-bold text-[#4B5563]">{sentence.translation}</div>
              <div className="mt-3 text-sm font-bold text-[#155DD7]">{sentence.note}</div>
            </div>
          ))}
        </div>
      </Section>

      {result.kanjiInfo.length > 0 ? (
        <Section title="Kanji breakdown" icon={<Languages size={24} />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.kanjiInfo.map((kanji, index) => (
              <div
                key={`${kanji.kanji}-${index}`}
                className="rounded-[24px] bg-white p-5 shadow-[inset_0_0_0_1px_#E5E5E5]"
              >
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-black leading-none text-[#202124]">{kanji.kanji}</div>
                  <div className="text-sm font-bold text-[#4B5563]">{kanji.meaning}</div>
                </div>
                <dl className="mt-4 space-y-2 text-xs font-bold">
                  <div className="flex items-baseline gap-2">
                    <dt className="w-12 shrink-0 text-[10px] font-black uppercase tracking-wider text-[#155DD7]">On</dt>
                    <dd className="text-[#202124]">
                      {kanji.onyomi.length ? kanji.onyomi.join("、") : <span className="text-[#9AA3B2]">—</span>}
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="w-12 shrink-0 text-[10px] font-black uppercase tracking-wider text-[#BE185D]">Kun</dt>
                    <dd className="text-[#202124]">
                      {kanji.kunyomi.length ? kanji.kunyomi.join("、") : <span className="text-[#9AA3B2]">—</span>}
                    </dd>
                  </div>
                </dl>
                {kanji.exampleWord ? (
                  <div className="mt-4 rounded-2xl bg-[#F4F7FF] px-3 py-2 text-xs font-bold text-[#155DD7] has-furi">
                    <Furi
                      text={kanji.exampleWord}
                      segments={
                        kanji.exampleWordReading
                          ? [{ text: kanji.exampleWord, reading: kanji.exampleWordReading }]
                          : undefined
                      }
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {result.relatedWords.length > 0 ? (
        <Section title="Related words" icon={<Sparkles size={24} />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.relatedWords.map((word, index) => (
              <div
                key={`${word.word}-${index}`}
                className="rounded-[24px] bg-white p-5 shadow-[inset_0_0_0_1px_#E5E5E5]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className={`text-lg font-black text-[#202124] ${word.wordSegments ? "has-furi" : ""}`}>
                    <Furi text={word.word} segments={word.wordSegments} />
                  </div>
                  {word.partOfSpeech ? (
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#777777]">
                      {word.partOfSpeech}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 text-sm font-bold text-[#4B5563]">{word.translation}</div>
                {word.note ? <p className="mt-2 text-xs font-bold leading-5 text-[#777777]">{word.note}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Breakdown" icon={<ListChecks size={24} />}>
          <div className="space-y-3">
            {result.breakdown.map((item, index) => (
              <div key={`${item.part}-${index}`} className="rounded-[24px] bg-white p-5 shadow-[inset_0_0_0_1px_#E5E5E5]">
                <div className="text-lg font-black text-[#202124]">{item.part}</div>
                <p className="mt-2 text-sm font-bold leading-6 text-[#4B5563]">{item.explanation}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tips and verb notes" icon={<Lightbulb size={24} />}>
          {result.verbInfo ? (
            <div className="mb-4 rounded-[24px] bg-[#FEF3C7] p-5">
              <div className="text-sm font-black text-[#92400E]">Verb info</div>
              <p className="mt-2 text-sm font-bold leading-6 text-[#202124]">{result.verbInfo}</p>
            </div>
          ) : null}
          <ul className="space-y-3">
            {result.tips.map((tip, index) => (
              <li key={`${tip}-${index}`} className="rounded-[24px] bg-white p-5 text-sm font-bold leading-6 text-[#4B5563] shadow-[inset_0_0_0_1px_#E5E5E5]">
                {tip}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[#155DD7]">{icon}</span>
        <h2 className="text-3xl font-black text-[#202124]">{title}</h2>
      </div>
      {children}
    </section>
  );
}
