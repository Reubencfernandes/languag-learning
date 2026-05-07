import type { KanjiInfo } from "@/lib/hf/phrases";
import { Furi } from "@/components/Furi";

export function KanjiCard({ kanji }: { kanji: KanjiInfo }) {
  return (
    <div className="duo-card p-5">
      <div className="flex items-baseline gap-3">
        <div className="text-4xl font-black leading-none text-[#3C3C3C]">{kanji.kanji}</div>
        <div className="text-sm font-bold text-[#777777]">{kanji.meaning}</div>
      </div>
      <dl className="mt-4 space-y-2 text-xs font-bold">
        <div className="flex items-baseline gap-2">
          <dt className="w-12 shrink-0 text-[10px] font-black uppercase tracking-wider text-[#7C3AED]">On</dt>
          <dd className="text-[#3C3C3C]">
            {kanji.onyomi.length ? kanji.onyomi.join("、") : <span className="text-[#AFAFAF]">—</span>}
          </dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="w-12 shrink-0 text-[10px] font-black uppercase tracking-wider text-[#0B7C7B]">Kun</dt>
          <dd className="text-[#3C3C3C]">
            {kanji.kunyomi.length ? kanji.kunyomi.join("、") : <span className="text-[#AFAFAF]">—</span>}
          </dd>
        </div>
      </dl>
      {kanji.exampleWord ? (
        <div className="mt-4 inline-flex rounded-xl bg-[#F5F3FF] px-3 py-2 text-xs font-bold text-[#7C3AED] has-furi">
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
