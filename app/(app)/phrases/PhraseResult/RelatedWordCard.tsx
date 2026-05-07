import type { RelatedWord } from "@/lib/hf/phrases";
import { Furi } from "@/components/Furi";

export function RelatedWordCard({ word }: { word: RelatedWord }) {
  return (
    <div className="duo-soft-panel p-4">
      <div className="flex items-baseline justify-between gap-2">
        <div className={`text-base font-black text-[#3C3C3C] ${word.wordSegments ? "has-furi" : ""}`}>
          <Furi text={word.word} segments={word.wordSegments} />
        </div>
        {word.partOfSpeech ? (
          <span className="text-[10px] font-black uppercase tracking-wider text-[#777777]">
            {word.partOfSpeech}
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-sm font-bold text-[#777777]">{word.translation}</div>
      {word.note ? <p className="mt-2 text-xs font-bold leading-5 text-[#777777]">{word.note}</p> : null}
    </div>
  );
}
