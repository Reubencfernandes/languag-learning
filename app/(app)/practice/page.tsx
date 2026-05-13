import { getSession } from "@/lib/auth/session";
import type { Level } from "@/lib/languages";
import { DialoguePracticeClient } from "./DialoguePracticeClient";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function PracticePage() {
  const session = (await getSession())!;
  const targetLangs = session.targetLangs ?? (session.targetLang ? [session.targetLang] : []);
  return (
    <section className="space-y-8 max-w-6xl mx-auto">
      <div className="relative w-full rounded-2xl bg-[#0EA5A4] text-white border-3 border-black p-6 sm:p-8 shadow-[5px_5px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-2">
          <div className="min-w-0">
            <span className="text-xs font-black uppercase tracking-wider text-black bg-white px-2.5 py-1 rounded-md border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] inline-block">
              Dialogue practice
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3 leading-snug">
              Practice real conversations
            </h1>
            <p className="mt-2 text-base font-bold text-white/95 leading-relaxed max-w-2xl">
              Select a scenario or describe your own — get a fresh, interactive dialogue perfectly tuned to your level.
            </p>
          </div>
          <LanguageSwitcher
            targetLangs={targetLangs}
            currentLang={session.targetLang!}
            nativeLang={session.nativeLang ?? "en"}
            level={session.level ?? "B1"}
          />
        </div>
      </div>
      <DialoguePracticeClient defaultLevel={(session.level ?? "B1") as Level} />
    </section>
  );
}
