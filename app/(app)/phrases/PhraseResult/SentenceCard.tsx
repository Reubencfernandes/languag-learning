import type { PhraseSentence } from "@/lib/hf/phrases";
import { Furi } from "@/components/Furi";
import { TTSButton } from "@/components/TTSButton";

export function SentenceCard({ sentence, lang }: { sentence: PhraseSentence; lang: string }) {
  return (
    <div className="rounded-xl bg-white p-5 border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]">
      <div className="flex items-start justify-between gap-3">
        <div className={`text-lg font-black text-black ${sentence.targetSegments ? "has-furi" : ""}`}>
          <Furi text={sentence.target} segments={sentence.targetSegments} />
        </div>
        <TTSButton text={sentence.target} lang={lang} />
      </div>
      <div className="mt-2 text-sm font-bold text-gray-700">{sentence.translation}</div>
      {sentence.note ? (
        <div className="mt-3 inline-block rounded-md bg-[#FFF7D6] border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]">{sentence.note}</div>
      ) : null}
    </div>
  );
}
