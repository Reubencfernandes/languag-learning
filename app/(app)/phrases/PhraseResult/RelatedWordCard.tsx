import type { RelatedWord } from "@/lib/hf/phrases";
import { Furi } from "@/components/Furi";
import { TTSButton } from "@/components/TTSButton";

export function RelatedWordCard({ word, lang }: { word: RelatedWord; lang: string }) {
  return (
    <div className="rounded-xl bg-white p-5 border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between gap-2">
        <div className={`text-base font-black text-black ${word.wordSegments ? "has-furi" : ""}`}>
          <Furi text={word.word} segments={word.wordSegments} />
        </div>
        <div className="flex items-center gap-2">
          {word.partOfSpeech ? (
            <span className="text-[10px] font-black uppercase tracking-wider text-black bg-[#FFD21E] border border-black rounded px-1.5 py-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
              {word.partOfSpeech}
            </span>
          ) : null}
          <TTSButton text={word.word} lang={lang} />
        </div>
      </div>
      <div className="mt-2 text-sm font-bold text-gray-700">{word.translation}</div>
      {word.note ? <p className="mt-2 text-xs font-black text-gray-500">{word.note}</p> : null}
    </div>
  );
}
