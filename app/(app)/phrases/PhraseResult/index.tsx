import { Languages, Lightbulb, ListChecks, MessageSquareText, Sparkles } from "lucide-react";
import type { PhraseAnalysis } from "@/lib/hf/phrases";
import { Section } from "./Section";
import { HeaderCard } from "./HeaderCard";
import { SentenceCard } from "./SentenceCard";
import { KanjiCard } from "./KanjiCard";
import { RelatedWordCard } from "./RelatedWordCard";

export function PhraseResult({ result, lang }: { result: PhraseAnalysis; lang: string }) {
  return (
    <div className="space-y-6">
      <HeaderCard
        input={result.input}
        inputSegments={result.inputSegments}
        partOfSpeech={result.partOfSpeech}
        translation={result.translation}
        lang={lang}
      />

      <Section title="Example sentences" icon={<MessageSquareText size={22} />}>
        <div className="grid gap-3">
          {result.sentences.map((sentence, index) => (
            <SentenceCard key={`${sentence.target}-${index}`} sentence={sentence} lang={lang} />
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
              <RelatedWordCard key={`${word.word}-${index}`} word={word} lang={lang} />
            ))}
          </div>
        </Section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Breakdown" icon={<ListChecks size={22} strokeWidth={2.5} />}>
          <div className="space-y-3">
            {result.breakdown.map((item, index) => (
              <div key={`${item.part}-${index}`} className="rounded-xl bg-white border-2 border-black p-4 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <div className="text-base font-black text-black">{item.part}</div>
                <p className="mt-1 text-sm font-bold leading-relaxed text-gray-700">{item.explanation}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tips and verb notes" icon={<Lightbulb size={22} strokeWidth={2.5} />}>
          {result.verbInfo ? (
            <div className="mb-4 rounded-xl border-3 border-black bg-[#FFD21E] p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black">
              <div className="text-xs font-black uppercase tracking-wider text-black">Verb info</div>
              <p className="mt-1 text-sm font-black leading-relaxed text-black">{result.verbInfo}</p>
            </div>
          ) : null}
          <ul className="space-y-3">
            {result.tips.map((tip, index) => (
              <li key={`${tip}-${index}`} className="rounded-xl bg-white border-2 border-black p-4 text-sm font-bold leading-relaxed text-black transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                {tip}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
