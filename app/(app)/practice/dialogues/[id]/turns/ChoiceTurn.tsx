"use client";

import { useMemo } from "react";
import type { DialogueOption, DialogueTurn } from "@/lib/types/dialogue";
import { Furi } from "@/components/Furi";
import { shuffle } from "@/lib/utils/shuffle";

export function ChoiceTurn({
  turn,
  index,
  made,
  onChoice,
}: {
  turn: DialogueTurn;
  index: number;
  made?: { chosen: number; correct: boolean };
  onChoice: (displayIndex: number, option: DialogueOption) => void;
}) {
  // Shuffle once per turn so the correct option's display position is
  // randomized — even if the model always drafts it first.
  const displayOptions = useMemo(() => shuffle(turn.options ?? []), [turn.options]);

  return (
    <div className="duo-card p-5 sm:p-6">
      <p className="text-lg font-black text-[#3C3C3C]">{turn.text || "What do you say?"}</p>
      <div className="mt-4 grid gap-3">
        {displayOptions.map((option, displayIndex) => {
          const chosen = made?.chosen === displayIndex;
          const correct = option.isCorrect;
          let className = "duo-card duo-card-interactive p-4 text-left text-base font-black text-[#3C3C3C]";

          if (made !== undefined && correct) {
            className = "rounded-2xl border-2 border-[#0EA5A4] bg-[#CCFBF1] p-4 text-left text-base font-black text-[#0B7C7B]";
          } else if (made !== undefined && chosen) {
            className = "rounded-2xl border-2 border-[#F43F5E] bg-[#FFE4E6] p-4 text-left text-base font-black text-[#BE123C]";
          } else if (made !== undefined) {
            className = "duo-card p-4 text-left text-base font-black text-[#AFAFAF] opacity-70";
          }

          return (
            <button
              key={`${index}-${displayIndex}`}
              disabled={made !== undefined}
              onClick={() => onChoice(displayIndex, option)}
              className={className}
            >
              <span className={option.textSegments ? "has-furi" : undefined}>
                <Furi text={option.text} segments={option.textSegments} />
              </span>
              {made !== undefined && chosen ? (
                <div className="mt-2 text-sm font-black">{option.feedback}</div>
              ) : null}
              {made !== undefined && correct && !chosen ? (
                <div className="mt-2 text-sm font-black">Correct answer</div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
