"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DialogueOption, DialogueTurn, Dialogue } from "@/lib/types/dialogue";
import { StartCard } from "./StartCard";
import { CompletionCard } from "./CompletionCard";
import { NarrationTurn } from "./turns/NarrationTurn";
import { CharacterTurn } from "./turns/CharacterTurn";
import { ChoiceTurn } from "./turns/ChoiceTurn";

const EASE = [0.16, 1, 0.3, 1] as const;

export function DialogueClient({ dialogue }: { dialogue: Dialogue }) {
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
      <StartCard
        scenario={dialogue.scenario}
        turnCount={turns.length}
        choiceCount={totalChoices}
        level={dialogue.level}
        onStart={() => setStarted(true)}
      />
    );
  }

  if (completed) {
    return <CompletionCard score={score} total={totalChoices} onRestart={restart} />;
  }

  const visibleTurns = turns.slice(0, turnIndex + 1);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden relative border-2 border-black">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-[#0EA5A4] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((turnIndex + 1) / turns.length) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
        <div className="mt-3 text-xs font-black uppercase tracking-wider text-black">
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
                lang={dialogue.targetLang}
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
