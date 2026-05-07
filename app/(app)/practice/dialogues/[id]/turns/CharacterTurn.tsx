"use client";

import { Eye, EyeOff } from "lucide-react";
import type { DialogueTurn } from "@/lib/types/dialogue";
import { Avatar } from "@/app/components/Avatar";
import { Furi } from "@/components/Furi";

export function CharacterTurn({
  turn,
  dialogueId,
  current,
  translationVisible,
  onToggleTranslation,
  onContinue,
}: {
  turn: DialogueTurn;
  dialogueId: string;
  current: boolean;
  translationVisible: boolean;
  onToggleTranslation: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex items-end gap-3 sm:gap-4">
      <Avatar seed={turn.speakerName || "Character"} salt={dialogueId} />
      <div className="duo-card relative flex-1 p-5">
        <div className="absolute bottom-5 -left-[9px] h-4 w-4 rotate-45 border-b-2 border-l-2 border-[#E5E5E5] bg-white" />
        <div className="relative z-10">
          {turn.speakerName ? (
            <div className="duo-eyebrow text-[#7C3AED]">{turn.speakerName}</div>
          ) : null}
          <p className={`mt-2 text-lg font-black leading-7 text-[#3C3C3C] ${turn.textSegments ? "has-furi" : ""}`}>
            <Furi text={turn.text} segments={turn.textSegments} />
          </p>

          {turn.translation ? (
            <div className="mt-4">
              <button
                onClick={onToggleTranslation}
                className="inline-flex items-center gap-2 text-sm font-black text-[#777777] transition hover:text-[#7C3AED]"
              >
                {translationVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                {translationVisible ? "Hide" : "Show"} translation
              </button>
              {translationVisible ? (
                <p className="mt-2 text-base font-black text-[#7C3AED]">{turn.translation}</p>
              ) : null}
            </div>
          ) : null}

          {current ? (
            <button onClick={onContinue} className="btn-duo btn-duo-primary mt-5 w-full text-sm">
              Continue
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
