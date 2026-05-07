import { getSession } from "@/lib/auth/session";
import { languageName, type Level } from "@/lib/languages";
import { PhrasesClient } from "./PhrasesClient";

export default async function PhrasesPage() {
  const session = (await getSession())!;

  return (
    <section className="space-y-10">
      <div className="border-b border-[#E5E5E5] pb-10">
        <div className="text-sm font-black text-[#777777]">DialogueDock</div>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.95] text-[#202124]">
          Break down <span className="text-[#155DD7]">phrases</span> and learn how to use them
        </h1>
        <p className="mt-5 max-w-2xl text-base font-bold leading-7 text-[#4B5563]">
          Learning {languageName(session.targetLang!)}. Enter a word or phrase to get example sentences, related words,
          and usage tips at the level you choose.
        </p>
      </div>
      <PhrasesClient defaultLevel={(session.level ?? "B1") as Level} />
    </section>
  );
}
