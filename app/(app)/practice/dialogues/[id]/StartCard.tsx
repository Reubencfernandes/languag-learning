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
      className="rounded-2xl bg-[#FFD21E] p-6 sm:p-8 border-3 border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] text-black"
    >
      <div className="inline-block bg-white border-2 border-black rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]">Scenario</div>
      <p className="mt-4 text-xl sm:text-2xl font-black leading-snug text-black tracking-tight">{scenario}</p>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <span className="rounded-xl bg-white border-2 border-black px-3 py-1.5 text-xs font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wider">{turnCount} turns</span>
        <span className="rounded-xl bg-white border-2 border-black px-3 py-1.5 text-xs font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wider">{choiceCount} choices</span>
        <span className="rounded-xl bg-[#0EA5A4] border-2 border-black px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wider">{level}</span>
      </div>
      <button onClick={onStart} className="flex items-center justify-center gap-2 rounded-xl bg-[#0EA5A4] text-white px-8 py-3.5 text-sm font-black border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all mt-7 w-full sm:w-auto uppercase tracking-wider">
        Start dialogue
        <ChevronRight size={18} strokeWidth={3} />
      </button>
    </motion.div>
  );
}
