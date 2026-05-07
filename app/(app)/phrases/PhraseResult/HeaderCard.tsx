import type { FuriSegment } from "@/lib/types/dialogue";
import { Furi } from "@/components/Furi";

export function HeaderCard({
  input,
  inputSegments,
  partOfSpeech,
  translation,
}: {
  input: string;
  inputSegments?: FuriSegment[];
  partOfSpeech: string;
  translation: string;
}) {
  return (
    <div className="duo-card overflow-hidden">
      <div className="bg-[#7C3AED] p-5 text-white sm:p-6">
        <div className="text-xs font-black uppercase tracking-wider text-white/75">{partOfSpeech}</div>
        <h2 className={`mt-2 text-3xl font-black leading-tight sm:text-4xl ${inputSegments ? "has-furi" : ""}`}>
          <Furi text={input} segments={inputSegments} />
        </h2>
        <p className="mt-2 text-base font-bold text-white/90 sm:text-lg">{translation}</p>
      </div>
    </div>
  );
}
