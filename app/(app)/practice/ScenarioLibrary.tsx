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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-black bg-[#E6FBFA] border-2 border-black px-2.5 py-1 rounded-md shadow-[1px_1px_0px_rgba(0,0,0,1)] inline-block w-fit">
          Starter packs
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase">Scenario Library</h2>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {DIALOGUE_SCENARIOS.length} scenarios available
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
