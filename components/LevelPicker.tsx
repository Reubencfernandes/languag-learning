"use client";

import { LEVELS, LEVEL_DESCRIPTIONS, type Level } from "@/lib/languages";

export function LevelPicker({
  value,
  onChange,
  size = "md",
  label,
}: {
  value: Level;
  onChange: (level: Level) => void;
  size?: "sm" | "md";
  label?: string;
}) {
  const isSm = size === "sm";
  return (
    <div className="flex flex-wrap items-center gap-3">
      {label ? (
        <span className="mr-1 text-[11px] font-black text-black uppercase tracking-widest">
          {label}
        </span>
      ) : null}
      {LEVELS.map((level) => {
        const active = level === value;
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            title={LEVEL_DESCRIPTIONS[level]}
            aria-pressed={active}
            className={`rounded-xl font-black border-2 border-black transition-all block ${
              isSm ? "px-4 py-1.5 text-xs" : "px-5 py-2 text-sm"
            } ${
              active
                ? "bg-[#FFD21E] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {level}
          </button>
        );
      })}
    </div>
  );
}
