import type { PhraseSentence } from "@/lib/hf/phrases";
import { Furi } from "@/components/Furi";

export function SentenceCard({ sentence }: { sentence: PhraseSentence }) {
  return (
    <div className="duo-soft-panel p-4">
      <div className={`text-lg font-black text-[#3C3C3C] ${sentence.targetSegments ? "has-furi" : ""}`}>
        <Furi text={sentence.target} segments={sentence.targetSegments} />
      </div>
      <div className="mt-1 text-sm font-bold text-[#777777]">{sentence.translation}</div>
      {sentence.note ? (
        <div className="mt-2 text-xs font-black uppercase tracking-wider text-[#7C3AED]">{sentence.note}</div>
      ) : null}
    </div>
  );
}
