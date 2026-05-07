"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function StartCard({
  scenario,
  turnCount,
  choiceCount,
  level,
  onStart,
}: {
  scenario: string;
  turnCount: number;
  choiceCount: number;
  level: string;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="duo-card p-6 sm:p-8"
    >
      <div className="duo-eyebrow text-[#7C3AED]">Scenario</div>
      <p className="mt-3 text-xl font-black leading-8 text-[#3C3C3C]">{scenario}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="duo-chip">{turnCount} turns</span>
        <span className="duo-chip">{choiceCount} choices</span>
        <span className="duo-chip">{level}</span>
      </div>
      <button onClick={onStart} className="btn-duo btn-duo-primary mt-7 w-full gap-2 sm:w-auto">
        Start dialogue
        <ChevronRight size={20} />
      </button>
    </motion.div>
  );
}
