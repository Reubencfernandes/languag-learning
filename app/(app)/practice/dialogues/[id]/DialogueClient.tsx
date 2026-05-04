"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Eye, EyeOff, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";
import type { DialogueTurn, DialogueOption } from "@/lib/db/schema";

type Dialogue = {
  id: string;
  title: string;
  scenario: string;
  level: string;
  turns: DialogueTurn[];
};

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
  const totalChoices = turns.filter((t) => t.type === "user_choice").length;

  function advance() {
    if (turnIndex + 1 >= turns.length) {
      setCompleted(true);
    } else {
      setTurnIndex((i) => i + 1);
    }
  }

  function handleChoice(turnIdx: number, optionIdx: number, option: DialogueOption) {
    if (choicesMade[turnIdx] !== undefined) return;
    const correct = option.isCorrect;
    setChoicesMade((prev) => ({ ...prev, [turnIdx]: { chosen: optionIdx, correct } }));
    if (correct) setScore((s) => s + 1);
    setTimeout(advance, 1500);
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
        transition={{ duration: 0.6, ease: EASE }}
        className="rounded-2xl border p-8 space-y-6 max-w-2xl"
        style={{ borderColor: "rgba(225,224,204,0.12)", background: "#101010" }}
      >
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest" style={{ color: "rgba(225,224,204,0.4)" }}>
            Scenario
          </div>
          <p className="text-[#E1E0CC] leading-relaxed">{dialogue.scenario}</p>
        </div>
        <div className="flex items-center gap-3 text-sm" style={{ color: "rgba(225,224,204,0.5)" }}>
          <span>{turns.length} turns</span>
          <span>·</span>
          <span>{totalChoices} choices</span>
          <span>·</span>
          <span>{dialogue.level}</span>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
        >
          Start dialogue
          <ChevronRight size={16} />
        </button>
      </motion.div>
    );
  }

  if (completed) {
    const pct = totalChoices > 0 ? Math.round((score / totalChoices) * 100) : 100;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="rounded-2xl border p-8 space-y-6 max-w-2xl text-center"
        style={{ borderColor: "rgba(225,224,204,0.12)", background: "#101010" }}
      >
        <Trophy size={40} className="mx-auto text-primary" />
        <div>
          <div className="text-3xl font-bold text-[#E1E0CC]">{pct}%</div>
          <div className="text-sm mt-1" style={{ color: "rgba(225,224,204,0.5)" }}>
            {score} of {totalChoices} correct
          </div>
        </div>
        <p className="text-sm text-[#E1E0CC]">
          {pct === 100 ? "Perfect! You nailed every response." : pct >= 70 ? "Great work! Keep practising." : "Good effort — try again to improve."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition-colors hover:border-primary/50"
            style={{ borderColor: "rgba(225,224,204,0.2)", color: "rgba(225,224,204,0.8)" }}
          >
            <RotateCcw size={14} />
            Try again
          </button>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-black transition hover:opacity-90"
          >
            More dialogues
          </Link>
        </div>
      </motion.div>
    );
  }

  const visibleTurns = turns.slice(0, turnIndex + 1);

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Progress bar */}
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((turnIndex + 1) / turns.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence initial={false}>
        {visibleTurns.map((turn, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {turn.type === "narration" && (
              <p className="text-sm italic px-1" style={{ color: "rgba(225,224,204,0.45)" }}>
                {turn.text}
              </p>
            )}

            {turn.type === "character" && (
              <div
                className="rounded-2xl rounded-tl-sm border p-4 space-y-2"
                style={{ borderColor: "rgba(225,224,204,0.12)", background: "#101010" }}
              >
                {turn.speakerName && (
                  <div className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(225,224,204,0.4)" }}>
                    {turn.speakerName}
                  </div>
                )}
                <p className="text-[#E1E0CC]">{turn.text}</p>
                {turn.translation && (
                  <div>
                    <button
                      onClick={() => toggleTranslation(idx)}
                      className="inline-flex items-center gap-1 text-xs transition-colors"
                      style={{ color: "rgba(225,224,204,0.4)" }}
                    >
                      {showTranslation[idx] ? <EyeOff size={12} /> : <Eye size={12} />}
                      {showTranslation[idx] ? "Hide" : "Show"} translation
                    </button>
                    {showTranslation[idx] && (
                      <p className="mt-1 text-sm" style={{ color: "rgba(225,224,204,0.55)" }}>
                        {turn.translation}
                      </p>
                    )}
                  </div>
                )}
                {/* Auto-advance for character turns at end */}
                {idx === turnIndex && turn.type === "character" && (
                  <button
                    onClick={advance}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
                  >
                    Continue <ChevronRight size={12} />
                  </button>
                )}
              </div>
            )}

            {turn.type === "user_choice" && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest px-1" style={{ color: "rgba(225,224,204,0.4)" }}>
                  {turn.text || "What do you say?"}
                </p>
                <div className="grid gap-2">
                  {turn.options?.map((opt, oi) => {
                    const made = choicesMade[idx];
                    const isChosen = made?.chosen === oi;
                    const isCorrect = opt.isCorrect;
                    let borderColor = "rgba(225,224,204,0.12)";
                    let bg = "#101010";
                    let textColor = "#E1E0CC";

                    if (made !== undefined) {
                      if (isCorrect) {
                        borderColor = "rgba(134,239,172,0.5)";
                        bg = "rgba(134,239,172,0.08)";
                        textColor = "#86efac";
                      } else if (isChosen) {
                        borderColor = "rgba(252,165,165,0.5)";
                        bg = "rgba(252,165,165,0.08)";
                        textColor = "#fca5a5";
                      } else {
                        textColor = "rgba(225,224,204,0.3)";
                      }
                    }

                    return (
                      <button
                        key={oi}
                        disabled={made !== undefined}
                        onClick={() => handleChoice(idx, oi, opt)}
                        className="rounded-xl border p-3 text-left text-sm transition-all hover:border-primary/40 disabled:cursor-default"
                        style={{ borderColor, background: bg, color: textColor }}
                      >
                        {opt.text}
                        {made !== undefined && isChosen && (
                          <span className="ml-2 text-xs opacity-70">— {opt.feedback}</span>
                        )}
                        {made !== undefined && isCorrect && !isChosen && (
                          <span className="ml-2 text-xs opacity-70">← Correct</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
