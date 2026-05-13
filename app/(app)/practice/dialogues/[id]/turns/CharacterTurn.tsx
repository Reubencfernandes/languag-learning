"use client";

import { Eye, EyeOff } from "lucide-react";
import type { DialogueTurn } from "@/lib/types/dialogue";
import { Avatar } from "@/app/components/Avatar";
import { Furi } from "@/components/Furi";
import { TTSButton } from "@/components/TTSButton";

export function CharacterTurn({
  turn,
  dialogueId,
  lang,
  current,
  translationVisible,
  onToggleTranslation,
  onContinue,
}: {
  turn: DialogueTurn;
  dialogueId: string;
  lang: string;
  current: boolean;
  translationVisible: boolean;
  onToggleTranslation: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex items-end gap-3 sm:gap-4">
      <Avatar seed={turn.speakerName || "Character"} salt={dialogueId} />
      <div className="relative flex-1 rounded-2xl rounded-bl-none bg-white p-5 border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="relative z-10">
          {turn.speakerName ? (
            <div className="inline-block bg-[#FFD21E] border-2 border-black rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_rgba(0,0,0,1)] mb-2">{turn.speakerName}</div>
          ) : null}
          <div className="flex items-start justify-between gap-3">
            <p className={`text-lg font-black leading-relaxed text-black ${turn.textSegments ? "has-furi" : ""}`}>
              <Furi text={turn.text} segments={turn.textSegments} />
            </p>
            <TTSButton text={turn.text} lang={lang} />
          </div>

          {turn.translation ? (
            <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-200">
              <button
                onClick={onToggleTranslation}
                className="inline-flex items-center gap-2 text-xs font-black text-gray-500 transition hover:text-black uppercase tracking-wider"
              >
                {translationVisible ? <EyeOff size={15} strokeWidth={2.5} /> : <Eye size={15} strokeWidth={2.5} />}
                {translationVisible ? "Hide" : "Show"} translation
              </button>
              {translationVisible ? (
                <p className="mt-3 text-sm font-black italic text-black bg-[#E6FBFA] border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">{turn.translation}</p>
              ) : null}
            </div>
          ) : null}

          {current ? (
            <button onClick={onContinue} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#0EA5A4] text-white px-6 py-3 text-xs font-black border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wider">
              Continue
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
