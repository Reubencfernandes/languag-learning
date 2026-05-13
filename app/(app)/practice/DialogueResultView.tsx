import type { Dialogue } from "@/lib/types/dialogue";
import { DialogueClient } from "./dialogues/[id]/DialogueClient";
import { ArrowLeft } from "lucide-react";

export function DialogueResultView({
  dialogue,
  onBack,
}: {
  dialogue: Dialogue;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 border-black bg-white text-black font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all"
      >
        <ArrowLeft size={18} strokeWidth={3} />
        Back to scenarios
      </button>
      <div className="rounded-2xl overflow-hidden bg-[#FFD21E] border-3 border-black p-6 sm:p-8 text-black shadow-[5px_5px_0px_rgba(0,0,0,1)]">
        <div className="inline-block rounded-md bg-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_rgba(0,0,0,1)] mb-3">
          {dialogue.targetLang.toUpperCase()} / {dialogue.level}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black leading-snug uppercase">{dialogue.title}</h1>
      </div>
      <DialogueClient dialogue={dialogue} />
    </section>
  );
}
