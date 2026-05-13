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
    <div className="rounded-2xl bg-[#FFD21E] p-5 sm:p-6 border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <p className="text-lg font-black text-black tracking-tight">{turn.text || "What do you say?"}</p>
      <div className="mt-4 grid gap-3">
        {displayOptions.map((option, displayIndex) => {
          const chosen = made?.chosen === displayIndex;
          const correct = option.isCorrect;
          let className = "w-full rounded-xl border-3 border-black bg-white p-4 text-left text-base font-black text-black transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_rgba(0,0,0,1)]";

          if (made !== undefined && correct) {
            className = "w-full rounded-xl border-3 border-black bg-[#0EA5A4] p-4 text-left text-base font-black text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]";
          } else if (made !== undefined && chosen) {
            className = "w-full rounded-xl border-3 border-black bg-[#FF8080] p-4 text-left text-base font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]";
          } else if (made !== undefined) {
            className = "w-full rounded-xl border-3 border-black bg-gray-100 p-4 text-left text-base font-black text-gray-400 opacity-60 shadow-[1px_1px_0px_rgba(0,0,0,1)]";
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
                <div className="mt-2 text-xs font-black uppercase tracking-wider opacity-90">{option.feedback}</div>
              ) : null}
              {made !== undefined && correct && !chosen ? (
                <div className="mt-2 text-xs font-black uppercase tracking-wider opacity-90">Correct answer</div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
