import type { DialogueScenario } from "@/lib/dialogue-scenarios";
import { SCENARIO_THEMES } from "@/lib/dialogue-themes";
import { ArrowRight } from "lucide-react";

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
      className="group relative flex min-h-[180px] w-full flex-col text-left rounded-2xl bg-white p-6 border-3 border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none justify-between overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black ${theme.tile} ${theme.tileText} shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#FFD21E] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
            <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
        <h3 className="text-lg font-black text-black tracking-tight leading-snug mb-2 line-clamp-1 uppercase">{scenario.title}</h3>
        <p className="line-clamp-2 text-xs font-bold leading-relaxed text-gray-700">{scenario.description}</p>
      </div>

      <div className="pt-4 mt-4 border-t-2 border-black w-full flex items-center justify-between">
        <span className="text-xs font-black tracking-wider text-black uppercase">
          Generate fresh
        </span>
        {pending ? (
          <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
        ) : null}
      </div>
    </button>
  );
}
