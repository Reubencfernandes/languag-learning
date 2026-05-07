"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Car,
  Coffee,
  Dumbbell,
  GraduationCap,
  Heart,
  Key,
  Landmark,
  LibraryBig,
  Mail,
  MessagesSquare,
  Pill,
  Plane,
  Scissors,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Stethoscope,
  Train,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { DIALOGUE_SCENARIOS, type DialogueScenario } from "@/lib/dialogue-scenarios";
import type { Dialogue } from "@/lib/types/dialogue";
import type { Level } from "@/lib/languages";
import { DialogueClient } from "./dialogues/[id]/DialogueClient";

const SCENARIO_THEMES: { icon: typeof Plane; tile: string; tileText: string; ring: string; chip: string; chipText: string }[] = [
  { icon: Plane,             tile: "bg-[#DCE8FF]", tileText: "text-[#155DD7]", ring: "hover:ring-[#155DD7]/30", chip: "bg-[#E8F0FE]", chipText: "text-[#155DD7]" },
  { icon: Coffee,            tile: "bg-[#FFE9D6]", tileText: "text-[#B45309]", ring: "hover:ring-[#B45309]/30", chip: "bg-[#FFF1E0]", chipText: "text-[#B45309]" },
  { icon: Stethoscope,       tile: "bg-[#FFE4E6]", tileText: "text-[#BE123C]", ring: "hover:ring-[#BE123C]/30", chip: "bg-[#FFEFF1]", chipText: "text-[#BE123C]" },
  { icon: Building2,         tile: "bg-[#E5F4EA]", tileText: "text-[#0F8A4F]", ring: "hover:ring-[#0F8A4F]/30", chip: "bg-[#EDFAF1]", chipText: "text-[#0F8A4F]" },
  { icon: BriefcaseBusiness, tile: "bg-[#EDE9FE]", tileText: "text-[#6D28D9]", ring: "hover:ring-[#6D28D9]/30", chip: "bg-[#F5F1FF]", chipText: "text-[#6D28D9]" },
  { icon: Key,               tile: "bg-[#FEF3C7]", tileText: "text-[#A16207]", ring: "hover:ring-[#A16207]/30", chip: "bg-[#FEF7DA]", chipText: "text-[#A16207]" },
  { icon: Pill,              tile: "bg-[#FCE7F3]", tileText: "text-[#BE185D]", ring: "hover:ring-[#BE185D]/30", chip: "bg-[#FDEFF7]", chipText: "text-[#BE185D]" },
  { icon: Train,             tile: "bg-[#CFFAFE]", tileText: "text-[#0E7490]", ring: "hover:ring-[#0E7490]/30", chip: "bg-[#E0FAFD]", chipText: "text-[#0E7490]" },
  { icon: UtensilsCrossed,   tile: "bg-[#FEE2E2]", tileText: "text-[#B91C1C]", ring: "hover:ring-[#B91C1C]/30", chip: "bg-[#FEECEC]", chipText: "text-[#B91C1C]" },
  { icon: Landmark,          tile: "bg-[#E0E7FF]", tileText: "text-[#4338CA]", ring: "hover:ring-[#4338CA]/30", chip: "bg-[#EBF0FF]", chipText: "text-[#4338CA]" },
  { icon: Car,               tile: "bg-[#FFEDD5]", tileText: "text-[#C2410C]", ring: "hover:ring-[#C2410C]/30", chip: "bg-[#FFF3DF]", chipText: "text-[#C2410C]" },
  { icon: Mail,              tile: "bg-[#DBEAFE]", tileText: "text-[#1D4ED8]", ring: "hover:ring-[#1D4ED8]/30", chip: "bg-[#E5EEFE]", chipText: "text-[#1D4ED8]" },
  { icon: Smartphone,        tile: "bg-[#D1FAE5]", tileText: "text-[#047857]", ring: "hover:ring-[#047857]/30", chip: "bg-[#DBFBEC]", chipText: "text-[#047857]" },
  { icon: Wifi,              tile: "bg-[#E0F2FE]", tileText: "text-[#0369A1]", ring: "hover:ring-[#0369A1]/30", chip: "bg-[#EAF6FE]", chipText: "text-[#0369A1]" },
  { icon: Scissors,          tile: "bg-[#FAE8FF]", tileText: "text-[#A21CAF]", ring: "hover:ring-[#A21CAF]/30", chip: "bg-[#FBEDFF]", chipText: "text-[#A21CAF]" },
  { icon: Dumbbell,          tile: "bg-[#FEF9C3]", tileText: "text-[#854D0E]", ring: "hover:ring-[#854D0E]/30", chip: "bg-[#FEFAD3]", chipText: "text-[#854D0E]" },
  { icon: Search,            tile: "bg-[#F1F5F9]", tileText: "text-[#334155]", ring: "hover:ring-[#334155]/30", chip: "bg-[#F4F8FB]", chipText: "text-[#334155]" },
  { icon: Shield,            tile: "bg-[#E2E8F0]", tileText: "text-[#1E293B]", ring: "hover:ring-[#1E293B]/30", chip: "bg-[#EAEFF6]", chipText: "text-[#1E293B]" },
  { icon: Heart,             tile: "bg-[#FFE4E6]", tileText: "text-[#E11D48]", ring: "hover:ring-[#E11D48]/30", chip: "bg-[#FEEAEC]", chipText: "text-[#E11D48]" },
  { icon: GraduationCap,     tile: "bg-[#EDE9FE]", tileText: "text-[#5B21B6]", ring: "hover:ring-[#5B21B6]/30", chip: "bg-[#F2EEFE]", chipText: "text-[#5B21B6]" },
];

export function DialoguePracticeClient({ defaultLevel }: { defaultLevel: Level }) {
  const [customTopic, setCustomTopic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [generatedDialogue, setGeneratedDialogue] = useState<Dialogue | null>(null);
  const [level, setLevel] = useState<Level>(defaultLevel);

  async function generate(scenario: string, label: string) {
    if (activeScenario) return;
    setError(null);
    setActiveScenario(label);

    try {
      const res = await fetch("/api/dialogues", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario, level }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || data.error || "Could not generate this dialogue.");
        setActiveScenario(null);
        return;
      }

      setGeneratedDialogue((await res.json()) as Dialogue);
    } catch {
      setError("Could not generate this dialogue.");
      setActiveScenario(null);
    }
  }

  function generateCustom() {
    const topic = customTopic.trim();
    if (!topic) {
      setError("Enter a situation first.");
      return;
    }
    generate(topic, "Custom topic");
  }

  if (generatedDialogue) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <button
          onClick={() => {
            setGeneratedDialogue(null);
            setActiveScenario(null);
          }}
          className="inline-flex items-center gap-2 text-sm font-black text-[#155DD7]"
        >
          <ArrowLeft size={17} />
          Back to scenarios
        </button>
        <div className="duo-card overflow-hidden">
          <div className="bg-[#155DD7] p-5 text-white sm:p-6">
            <div className="text-xs font-black uppercase text-white/75">
              {generatedDialogue.targetLang.toUpperCase()} / {generatedDialogue.level}
            </div>
            <h1 className="mt-2 text-3xl font-black leading-tight">{generatedDialogue.title}</h1>
          </div>
        </div>
        <DialogueClient dialogue={generatedDialogue} />
      </section>
    );
  }

  return (
    <section className="space-y-10">
      {/* Hero: compact, gradient command bar with prompt built in */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#155DD7] via-[#1E6FE8] to-[#3B82F6] p-7 text-white shadow-[0_10px_30px_-12px_rgba(21,93,215,0.55)] sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur">
            <Sparkles size={13} />
            DialogueDock
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] sm:text-[44px]">
            Practice <span className="text-[#FFE17A]">real dialogue</span> for everyday situations.
          </h1>
          <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-white/85">
            Pick a scenario below, or describe any situation and get a fresh dialogue tailored to it.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {(["A1", "A2", "B1", "B2", "C1"] as Level[]).map((lvl) => {
              const active = lvl === level;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  aria-pressed={active}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-black transition ${
                    active
                      ? "bg-white text-[#155DD7] shadow-[0_2px_0_rgba(0,0,0,0.12)]"
                      : "bg-white/10 text-white/90 ring-1 ring-inset ring-white/25 hover:bg-white/15"
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
            <span className="ml-1 text-[11px] font-black uppercase tracking-wider text-white/70">CEFR level</span>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-2 shadow-xl shadow-black/10 ring-1 ring-black/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <div className="flex flex-1 items-start gap-3 px-3 pt-3 sm:py-3">
                <MessagesSquare size={20} className="mt-0.5 shrink-0 text-[#155DD7]" />
                <textarea
                  value={customTopic}
                  onChange={(event) => setCustomTopic(event.target.value)}
                  placeholder="e.g. returning a damaged phone at a shop"
                  rows={2}
                  className="min-h-[48px] w-full resize-none border-0 bg-transparent text-sm font-bold leading-6 text-[#202124] outline-none placeholder:text-[#8A94A6]"
                />
              </div>
              <button
                onClick={generateCustom}
                disabled={activeScenario !== null}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#155DD7] px-5 text-sm font-black text-white shadow-[0_4px_0_#0F45A0] transition active:translate-y-1 active:shadow-none disabled:opacity-60 sm:min-h-full sm:px-7"
              >
                {activeScenario === "Custom topic" ? "Generating…" : "Generate"}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario library */}
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#E8F0FE] text-[#155DD7]">
              <LibraryBig size={22} />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#777777]">Starter packs</div>
              <h2 className="text-2xl font-black leading-tight text-[#202124] sm:text-3xl">Scenario Library</h2>
            </div>
          </div>
          <div className="hidden text-xs font-black text-[#777777] sm:block">
            {DIALOGUE_SCENARIOS.length} ready-to-go scenarios
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl bg-[#FFE4E6] px-5 py-4 text-sm font-black text-[#BE123C]">{error}</div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DIALOGUE_SCENARIOS.map((scenario, index) => (
            <ScenarioCard
              key={scenario.title}
              scenario={scenario}
              index={index}
              pending={activeScenario === scenario.title}
              disabled={activeScenario !== null}
              onGenerate={() => generate(scenario.scenario, scenario.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScenarioCard({
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
      className={`group relative flex min-h-[210px] flex-col rounded-3xl border border-[#ECEFF4] bg-white p-5 text-left shadow-[0_1px_0_#EDEFF3] ring-2 ring-transparent transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(15,23,42,0.18)] ${theme.ring} disabled:cursor-wait disabled:opacity-70`}
    >
      <div className="flex items-start justify-between">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${theme.tile} ${theme.tileText}`}>
          <Icon size={22} />
        </div>
        <ArrowRight size={18} className="mt-3 text-[#9AA3B2] transition group-hover:translate-x-1 group-hover:text-[#202124]" />
      </div>

      <div className="mt-5 text-lg font-black leading-tight text-[#202124] sm:text-xl">{scenario.title}</div>
      <p className="mt-2 line-clamp-2 text-[13px] font-bold leading-5 text-[#6B7280]">{scenario.description}</p>

      <div className="mt-auto pt-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black ${theme.chip} ${theme.chipText}`}>
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
