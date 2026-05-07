"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import type { DialogueScenario } from "@/lib/dialogue-scenarios";
import { SCENARIO_THEMES } from "@/lib/dialogue-themes";

export function ScenarioCard({
  scenario,
  index,
  pending,
  disabled,
  onGenerate,
}: {
  scenario: DialogueScenario;
  index: number;
  pending: boolean;
  disabled: boolean;
  onGenerate: () => void;
}) {
  const theme = SCENARIO_THEMES[index % SCENARIO_THEMES.length];
  const Icon = theme.icon;

  return (
    <button
      onClick={onGenerate}
      disabled={disabled}
      className="duo-card duo-card-interactive group flex min-h-[200px] flex-col p-5 text-left disabled:cursor-wait disabled:opacity-70"
    >
      <div className="flex items-start justify-between">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${theme.tile} ${theme.tileText}`}>
          <Icon size={22} />
        </div>
        <ArrowRight size={18} className="mt-3 text-[#AFAFAF] transition group-hover:translate-x-1 group-hover:text-[#3C3C3C]" />
      </div>

      <div className="mt-5 text-lg font-black leading-tight text-[#3C3C3C]">{scenario.title}</div>
      <p className="mt-2 line-clamp-2 text-[13px] font-bold leading-5 text-[#777777]">{scenario.description}</p>

      <div className="mt-auto pt-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#7C3AED]">
          {pending ? (
            <>
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles size={11} />
              Generate fresh
            </>
          )}
        </span>
      </div>
    </button>
  );
}
