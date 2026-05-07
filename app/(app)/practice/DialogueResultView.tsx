"use client";

import { ArrowLeft } from "lucide-react";
import type { Dialogue } from "@/lib/types/dialogue";
import { DialogueClient } from "./dialogues/[id]/DialogueClient";

export function DialogueResultView({
  dialogue,
  onBack,
}: {
  dialogue: Dialogue;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-black text-[#7C3AED] hover:text-[#5B21B6]"
      >
        <ArrowLeft size={17} />
        Back to scenarios
      </button>
      <div className="duo-card overflow-hidden">
        <div className="bg-[#7C3AED] p-5 text-white sm:p-6">
          <div className="text-xs font-black uppercase text-white/75">
            {dialogue.targetLang.toUpperCase()} / {dialogue.level}
          </div>
          <h1 className="mt-2 text-3xl font-black leading-tight">{dialogue.title}</h1>
        </div>
      </div>
      <DialogueClient dialogue={dialogue} />
    </section>
  );
}
