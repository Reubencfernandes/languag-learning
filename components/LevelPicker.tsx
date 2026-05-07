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
    <div className="flex flex-wrap items-center gap-2">
      {label ? (
        <span className="mr-1 text-[11px] font-black uppercase tracking-wider text-[#777777]">
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
            className={`rounded-full font-black transition ${
              isSm ? "px-3 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs"
            } ${
              active
                ? "bg-[#155DD7] text-white shadow-[0_2px_0_#0F45A0]"
                : "bg-white text-[#3C3C3C] ring-1 ring-inset ring-[#E5E5E5] hover:bg-[#F4F7FF]"
            }`}
          >
            {level}
          </button>
        );
      })}
    </div>
  );
}
