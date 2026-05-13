import type { FuriSegment } from "@/lib/types/dialogue";
import { Furi } from "@/components/Furi";
import { TTSButton } from "@/components/TTSButton";

export function HeaderCard({
  input,
  inputSegments,
  partOfSpeech,
  translation,
  lang,
}: {
  input: string;
  inputSegments?: FuriSegment[];
  partOfSpeech: string;
  translation: string;
  lang: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#FFD21E] border-3 border-black p-6 sm:p-8 text-black shadow-[5px_5px_0px_rgba(0,0,0,1)]">
      <div className="inline-block rounded-md bg-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_rgba(0,0,0,1)] mb-3">{partOfSpeech}</div>
      <div className="flex items-center gap-3">
        <h2 className={`text-3xl font-black tracking-tight sm:text-4xl text-black ${inputSegments ? "has-furi" : ""}`}>
          <Furi text={input} segments={inputSegments} />
        </h2>
        <TTSButton
          text={input}
          lang={lang}
        />
      </div>
      <p className="mt-3 text-base font-black text-gray-800 sm:text-lg">{translation}</p>
    </div>
  );
}
