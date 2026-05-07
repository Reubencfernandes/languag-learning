import { Languages, Lightbulb, ListChecks, MessageSquareText, Sparkles } from "lucide-react";
import type { PhraseAnalysis } from "@/lib/hf/phrases";
import { Section } from "./Section";
import { HeaderCard } from "./HeaderCard";
import { SentenceCard } from "./SentenceCard";
import { KanjiCard } from "./KanjiCard";
import { RelatedWordCard } from "./RelatedWordCard";

export function PhraseResult({ result }: { result: PhraseAnalysis }) {
  return (
    <div className="space-y-6">
      <HeaderCard
        input={result.input}
        inputSegments={result.inputSegments}
        partOfSpeech={result.partOfSpeech}
        translation={result.translation}
      />

      <Section title="Example sentences" icon={<MessageSquareText size={22} />}>
        <div className="grid gap-3">
          {result.sentences.map((sentence, index) => (
            <SentenceCard key={`${sentence.target}-${index}`} sentence={sentence} />
          ))}
        </div>
      </Section>

      {result.kanjiInfo.length > 0 ? (
        <Section title="Kanji breakdown" icon={<Languages size={22} />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.kanjiInfo.map((kanji, index) => (
              <KanjiCard key={`${kanji.kanji}-${index}`} kanji={kanji} />
            ))}
          </div>
        </Section>
      ) : null}

      {result.relatedWords.length > 0 ? (
        <Section title="Related words" icon={<Sparkles size={22} />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.relatedWords.map((word, index) => (
              <RelatedWordCard key={`${word.word}-${index}`} word={word} />
            ))}
          </div>
        </Section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Breakdown" icon={<ListChecks size={22} />}>
          <div className="space-y-3">
            {result.breakdown.map((item, index) => (
              <div key={`${item.part}-${index}`} className="duo-soft-panel p-4">
                <div className="text-base font-black text-[#3C3C3C]">{item.part}</div>
                <p className="mt-1 text-sm font-bold leading-6 text-[#777777]">{item.explanation}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tips and verb notes" icon={<Lightbulb size={22} />}>
          {result.verbInfo ? (
            <div className="mb-3 rounded-2xl border-2 border-[#FDE68A] bg-[#FEF3C7] p-4">
              <div className="text-xs font-black uppercase tracking-wider text-[#92400E]">Verb info</div>
              <p className="mt-1 text-sm font-bold leading-6 text-[#3C3C3C]">{result.verbInfo}</p>
            </div>
          ) : null}
          <ul className="space-y-3">
            {result.tips.map((tip, index) => (
              <li key={`${tip}-${index}`} className="duo-soft-panel p-4 text-sm font-bold leading-6 text-[#3C3C3C]">
                {tip}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
