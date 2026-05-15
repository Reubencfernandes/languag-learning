import type { KanjiInfo } from "@/lib/hf/phrases";
import { Furi } from "@/components/Furi";

export function KanjiCard({ kanji }: { kanji: KanjiInfo }) {
  return (
    <div className="rounded-xl bg-white p-5 border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]">
      <div className="flex items-baseline gap-3">
        <div className="text-4xl font-black leading-none text-black">{kanji.kanji}</div>
        <div className="text-sm font-bold text-gray-700">{kanji.meaning}</div>
      </div>
      <dl className="mt-4 space-y-3 text-base">
        <div className="flex items-center gap-2.5">
          <dt className="w-12 shrink-0 text-xs font-black uppercase tracking-wider text-black bg-[#FFD21E] border-2 border-black rounded py-1 text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">On</dt>
          <dd className="text-black font-black text-lg">
            {kanji.onyomi.length ? kanji.onyomi.join("、") : <span className="text-gray-300">—</span>}
          </dd>
        </div>
        <div className="flex items-center gap-2.5">
          <dt className="w-12 shrink-0 text-xs font-black uppercase tracking-wider text-white bg-[#0EA5A4] border-2 border-black rounded py-1 text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">Kun</dt>
          <dd className="text-black font-black text-lg">
            {kanji.kunyomi.length ? kanji.kunyomi.join("、") : <span className="text-gray-300">—</span>}
          </dd>
        </div>
      </dl>
      {kanji.exampleWord ? (
        <div className="mt-4 inline-flex rounded-lg bg-[#E6FBFA] border-2 border-black px-4 py-2 text-base font-black text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] has-furi">
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
  );
}
