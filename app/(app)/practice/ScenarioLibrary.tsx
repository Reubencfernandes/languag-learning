"use client";

import { LibraryBig } from "lucide-react";
import { DIALOGUE_SCENARIOS } from "@/lib/dialogue-scenarios";
import { ScenarioCard } from "./ScenarioCard";

export function ScenarioLibrary({
  activeScenario,
  onGenerate,
}: {
  activeScenario: string | null;
  onGenerate: (scenario: string, label: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#CCFBF1] text-[#0B7C7B] shadow-[0_4px_0_#A7F3D0]">
            <LibraryBig size={22} />
          </div>
          <div>
            <div className="duo-eyebrow">Starter packs</div>
            <h2 className="text-2xl font-black leading-tight text-[#3C3C3C]">Scenario Library</h2>
          </div>
        </div>
        <div className="hidden text-xs font-black text-[#777777] sm:block">
          {DIALOGUE_SCENARIOS.length} ready-to-go
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DIALOGUE_SCENARIOS.map((scenario, index) => (
          <ScenarioCard
            key={scenario.title}
            scenario={scenario}
            index={index}
            pending={activeScenario === scenario.title}
            disabled={activeScenario !== null}
            onGenerate={() => onGenerate(scenario.scenario, scenario.title)}
          />
        ))}
      </div>
    </div>
  );
}
