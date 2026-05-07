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
      className="duo-card p-8 text-center sm:p-10"
    >
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[#FEF3C7] text-[#92400E] shadow-[0_4px_0_#FCD34D]">
        <Trophy size={44} />
      </div>
      <div className="mt-6 text-5xl font-black text-[#0EA5A4]">{pct}%</div>
      <div className="mt-2 text-base font-black text-[#777777]">
        {score} of {total} correct
      </div>
      <p className="mx-auto mt-5 max-w-sm text-lg font-black leading-7 text-[#3C3C3C]">
        {pct === 100
          ? "Perfect! You nailed every response."
          : pct >= 70
            ? "Great work. Keep practicing."
            : "Good effort. Try again to improve."}
      </p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button onClick={onRestart} className="btn-duo btn-duo-white gap-2">
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
