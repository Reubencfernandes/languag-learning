"use client";

import { motion } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CompletionCard({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="rounded-2xl bg-white p-8 text-center sm:p-12 border-3 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFD21E] text-black border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <Trophy size={40} strokeWidth={2.5} />
      </div>
      <div className="mt-6 text-5xl font-black tracking-tight text-black">{pct}%</div>
      <div className="mt-2 text-xs font-black text-gray-600 uppercase tracking-wider">
        {score} of {total} correct
      </div>
      <p className="mx-auto mt-4 max-w-sm text-lg font-black leading-relaxed text-black tracking-tight">
        {pct === 100
          ? "Perfect! You nailed every response."
          : pct >= 70
            ? "Great work. Keep practicing."
            : "Good effort. Try again to improve."}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
        <button onClick={onRestart} className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD21E] text-black px-6 py-3.5 text-sm font-black border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wider">
          <RotateCcw size={18} strokeWidth={3} />
          Try again
        </button>
        <Link href="/practice" className="flex items-center justify-center gap-2 rounded-xl bg-[#0EA5A4] text-white px-6 py-3.5 text-sm font-black border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wider">
          More dialogues
        </Link>
      </div>
    </motion.div>
  );
}
