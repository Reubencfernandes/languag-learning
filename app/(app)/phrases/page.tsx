import { MessageSquareText } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { languageName, type Level } from "@/lib/languages";
import { PhrasesClient } from "./PhrasesClient";

export default async function PhrasesPage() {
  const session = (await getSession())!;

  return (
    <section className="space-y-6">
      <div className="duo-card bg-white p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#EDE9FE] text-[#7C3AED] shadow-[0_4px_0_#DDD6FE]">
            <MessageSquareText size={28} />
          </div>
          <div className="min-w-0">
            <div className="duo-eyebrow">Phrase coach</div>
            <h1 className="duo-page-title">Break down phrases</h1>
            <p className="mt-1 text-sm font-bold text-[#777777]">
              Learning {languageName(session.targetLang!)} — get translations, breakdowns, related vocabulary, and usage tips.
            </p>
          </div>
        </div>
      </div>
      <PhrasesClient defaultLevel={(session.level ?? "B1") as Level} />
    </section>
  );
}
