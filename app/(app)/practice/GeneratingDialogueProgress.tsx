import { useEffect, useState } from "react";
import { Wand2, PenLine, Globe, Settings2, BrainCircuit, Check } from "lucide-react";

type Stage = {
  icon: any;
  label: string;
  description: string;
};

const STAGES: Stage[] = [
  {
    icon: Wand2,
    label: "Setting the scene",
    description: "Crafting a believable situation around your topic.",
  },
  {
    icon: PenLine,
    label: "Writing the dialogue",
    description: "Generating natural turn-by-turn conversation.",
  },
  {
    icon: Globe,
    label: "Adding translations",
    description: "Aligning each line with your native language.",
  },
  {
    icon: Settings2,
    label: "Polishing details",
    description: "Tuning vocabulary to your level and style.",
  },
];

const STAGE_DURATIONS_MS = [2800, 4200, 5500, 7000];

export function GeneratingDialogueProgress({ scenario }: { scenario: string }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    STAGE_DURATIONS_MS.forEach((duration, i) => {
      elapsed += duration;
      if (i < STAGES.length - 1) {
        timers.push(setTimeout(() => setStageIndex(i + 1), elapsed));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const delta = prev < 60 ? 1.5 : prev < 80 ? 0.7 : 0.25;
        return Math.min(92, prev + delta);
      });
    }, 250);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto mt-4 max-w-2xl rounded-2xl border-3 border-black bg-white p-6 sm:p-8 shadow-[5px_5px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#FFD21E] shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black">
          <BrainCircuit size={32} strokeWidth={2.5} />
          <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-[#0EA5A4]">
            <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-black uppercase tracking-wider text-gray-500">
            Generating dialogue
          </div>
          <h2 className="mt-1 truncate text-xl font-black text-black sm:text-2xl uppercase tracking-tight">{scenario}</h2>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-600">
          <span>{STAGES[stageIndex].label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-4 w-full overflow-hidden rounded-full border-2 border-black bg-gray-100">
          <div
            className="h-full rounded-full bg-[#0EA5A4] transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {STAGES.map((stage, index) => {
          const isDone = index < stageIndex;
          const isActive = index === stageIndex;
          const Icon = stage.icon;
          return (
            <li
              key={stage.label}
              className={`flex items-start gap-3 rounded-xl border-2 px-3.5 py-3 transition-all duration-200 ${
                isActive
                  ? "border-black bg-[#FFF7D6] shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                  : isDone
                  ? "border-[#0EA5A4] bg-[#E6FBFA] opacity-80"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                  isActive
                    ? "border-black bg-white text-black"
                    : isDone
                    ? "border-[#0EA5A4] bg-[#0EA5A4] text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {isDone ? <Check size={20} strokeWidth={3} /> : <Icon size={20} strokeWidth={2.5} />}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`text-base font-black ${
                    isActive ? "text-black" : isDone ? "text-[#0a6e6d]" : "text-gray-500"
                  }`}
                >
                  {stage.label}
                  {isActive && (
                    <span className="ml-2 inline-flex gap-1 align-middle">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black" />
                    </span>
                  )}
                </div>
                <div
                  className={`mt-1 text-xs font-bold leading-relaxed ${
                    isActive ? "text-gray-700" : isDone ? "text-[#0a6e6d]/80" : "text-gray-400"
                  }`}
                >
                  {stage.description}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-xs font-black uppercase tracking-wider text-gray-400">
        Hang tight — generating a custom dialogue can take up to 30 seconds.
      </p>
    </div>
  );
}
