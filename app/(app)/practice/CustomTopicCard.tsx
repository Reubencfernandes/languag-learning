"use client";

import { LevelPicker } from "@/components/LevelPicker";
import type { Level } from "@/lib/languages";
import { Wand2, ArrowRight } from "lucide-react";

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
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="text-sm font-black text-black tracking-wide uppercase flex items-center gap-2">
          <Wand2 size={20} strokeWidth={2.5} />
          Build your own
        </div>
        <LevelPicker value={level} onChange={onLevelChange} size="sm" label="CEFR" />
      </div>

      <div className="relative w-full">
        <textarea
          value={customTopic}
          onChange={(event) => onCustomTopicChange(event.target.value)}
          placeholder="Describe a situation, e.g. returning a damaged phone at a shop..."
          rows={2}
          disabled={disabled && !pending}
          className="w-full resize-none rounded-2xl border-3 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] pl-4 pr-16 py-4 text-base font-bold leading-relaxed text-black outline-none transition-all focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[5px_5px_0px_rgba(0,0,0,1)] placeholder:text-gray-500"
          style={{ minHeight: '70px' }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          <button
            onClick={onGenerate}
            disabled={disabled || !customTopic.trim()}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black font-black transition-all ${
              !customTopic.trim() || disabled
                ? "bg-gray-100 text-gray-400 shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                : "bg-[#0EA5A4] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {pending ? (
               <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <ArrowRight size={20} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border-2 border-black bg-[#FF8080] px-3 py-2 text-xs font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          {error}
        </div>
      ) : null}
    </div>
  );
}
