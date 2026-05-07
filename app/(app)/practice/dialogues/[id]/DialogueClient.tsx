"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Eye, EyeOff, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";
import type { DialogueTurn, DialogueOption, Dialogue } from "@/lib/types/dialogue";
import { Avatar } from "@/app/components/Avatar";
import { Furi } from "@/components/Furi";

type Props = { dialogue: Dialogue };

const EASE = [0.16, 1, 0.3, 1] as const;

export function DialogueClient({ dialogue }: Props) {
  const [started, setStarted] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choicesMade, setChoicesMade] = useState<Record<number, { chosen: number; correct: boolean }>>({});
  const [showTranslation, setShowTranslation] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState(false);

  const turns = dialogue.turns;
  const totalChoices = turns.filter((turn) => turn.type === "user_choice").length;

  function advance() {
    if (turnIndex + 1 >= turns.length) {
      setCompleted(true);
    } else {
      setTurnIndex((index) => index + 1);
    }
  }

  function handleChoice(turnIdx: number, displayIdx: number, option: DialogueOption) {
    if (choicesMade[turnIdx] !== undefined) return;
    const correct = option.isCorrect;
    setChoicesMade((prev) => ({ ...prev, [turnIdx]: { chosen: displayIdx, correct } }));
    if (correct) setScore((value) => value + 1);
    setTimeout(advance, 1200);
  }

  function toggleTranslation(idx: number) {
    setShowTranslation((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function restart() {
    setStarted(false);
    setTurnIndex(0);
    setScore(0);
    setChoicesMade({});
    setShowTranslation({});
    setCompleted(false);
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="duo-card p-6 sm:p-8"
      >
        <div className="duo-eyebrow text-[#7C3AED]">Scenario</div>
        <p className="mt-3 text-xl font-black leading-8 text-[#3C3C3C]">{dialogue.scenario}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="duo-chip">{turns.length} turns</span>
          <span className="duo-chip">{totalChoices} choices</span>
          <span className="duo-chip">{dialogue.level}</span>
        </div>
        <button onClick={() => setStarted(true)} className="btn-duo btn-duo-primary mt-7 w-full gap-2 sm:w-auto">
          Start dialogue
          <ChevronRight size={20} />
        </button>
      </motion.div>
    );
  }

  if (completed) {
    const pct = totalChoices > 0 ? Math.round((score / totalChoices) * 100) : 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="duo-card p-8 text-center sm:p-10"
      >
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[#FEF3C7] text-[#92400E] shadow-[0_4px_0_#FCD34D]">
          <Trophy size={44} />
        </div>
        <div className="mt-6 text-5xl font-black text-[#0EA5A4]">{pct}%</div>
        <div className="mt-2 text-base font-black text-[#777777]">
          {score} of {totalChoices} correct
        </div>
        <p className="mx-auto mt-5 max-w-sm text-lg font-black leading-7 text-[#3C3C3C]">
          {pct === 100 ? "Perfect! You nailed every response." : pct >= 70 ? "Great work. Keep practicing." : "Good effort. Try again to improve."}
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button onClick={restart} className="btn-duo btn-duo-white gap-2">
            <RotateCcw size={18} />
            Try again
          </button>
          <Link href="/practice" className="btn-duo btn-duo-primary">
            More dialogues
          </Link>
        </div>
      </motion.div>
    );
  }

  const visibleTurns = turns.slice(0, turnIndex + 1);

  return (
    <div className="space-y-6">
      <div className="duo-card p-4">
        <div className="duo-progress">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: `${((turnIndex + 1) / turns.length) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
        <div className="mt-2 text-xs font-black uppercase text-[#777777]">
          Step {turnIndex + 1} of {turns.length}
        </div>
      </div>

      <div className="space-y-5">
        {visibleTurns.map((turn: DialogueTurn, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {turn.type === "narration" ? (
              <NarrationTurn text={turn.text} current={idx === turnIndex} onContinue={advance} />
            ) : null}

            {turn.type === "character" ? (
              <CharacterTurn
                turn={turn}
                dialogueId={dialogue.id}
                current={idx === turnIndex}
                translationVisible={Boolean(showTranslation[idx])}
                onToggleTranslation={() => toggleTranslation(idx)}
                onContinue={advance}
              />
            ) : null}

            {turn.type === "user_choice" ? (
              <ChoiceTurn
                turn={turn}
                index={idx}
                made={choicesMade[idx]}
                onChoice={(optionIndex, option) => handleChoice(idx, optionIndex, option)}
              />
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NarrationTurn({ text, current, onContinue }: { text: string; current: boolean; onContinue: () => void }) {
  return (
    <div className="duo-card bg-[#F7F7F7] p-5 text-center">
      <p className="text-base font-black italic text-[#777777]">{text}</p>
      {current ? (
        <button onClick={onContinue} className="btn-duo btn-duo-secondary mt-4 text-sm">
          Continue
        </button>
      ) : null}
    </div>
  );
}

function CharacterTurn({
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

function ChoiceTurn({
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
  // randomized — even if the model always drafts it first. Memoized on the
  // option list so re-renders within the same turn keep the same order.
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

// Fisher–Yates shuffle. Returns a new array; doesn't mutate the input.
function shuffle<T>(input: readonly T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

