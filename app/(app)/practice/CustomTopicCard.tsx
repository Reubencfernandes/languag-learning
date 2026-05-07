"use client";

import { ArrowRight, MessagesSquare } from "lucide-react";
import { LevelPicker } from "@/components/LevelPicker";
import type { Level } from "@/lib/languages";

export function CustomTopicCard({
  level,
  onLevelChange,
  customTopic,
  onCustomTopicChange,
  onGenerate,
  pending,
  disabled,
  error,
}: {
  level: Level;
  onLevelChange: (level: Level) => void;
  customTopic: string;
  onCustomTopicChange: (value: string) => void;
  onGenerate: () => void;
  pending: boolean;
  disabled: boolean;
  error: string | null;
}) {
  return (
    <div className="duo-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="duo-eyebrow text-[#7C3AED]">Build your own</div>
        <LevelPicker value={level} onChange={onLevelChange} size="sm" label="CEFR" />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-start gap-3 rounded-2xl border-2 border-[#E5E5E5] bg-white px-4 py-3">
          <MessagesSquare size={20} className="mt-0.5 shrink-0 text-[#7C3AED]" />
          <textarea
            value={customTopic}
            onChange={(event) => onCustomTopicChange(event.target.value)}
            placeholder="Describe a situation, e.g. returning a damaged phone at a shop"
            rows={2}
            className="min-h-[44px] w-full resize-none border-0 bg-transparent text-sm font-bold leading-6 text-[#3C3C3C] outline-none placeholder:text-[#AFAFAF]"
          />
        </div>
        <button
          onClick={onGenerate}
          disabled={disabled}
          className="btn-duo btn-duo-secondary gap-2 self-stretch text-sm sm:self-auto"
        >
          {pending ? "Generating…" : "Generate"}
          <ArrowRight size={17} />
        </button>
      </div>

      {error ? <p className="mt-3 text-sm font-black text-[#BE123C]">{error}</p> : null}
    </div>
  );
}
