"use client";

import { useState } from "react";
import type { Dialogue } from "@/lib/types/dialogue";
import type { Level } from "@/lib/languages";
import { CustomTopicCard } from "./CustomTopicCard";
import { ScenarioLibrary } from "./ScenarioLibrary";
import { DialogueResultView } from "./DialogueResultView";
import { GeneratingDialogueProgress } from "./GeneratingDialogueProgress";

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
      <DialogueResultView
        dialogue={generatedDialogue}
        onBack={() => {
          setGeneratedDialogue(null);
          setActiveScenario(null);
        }}
      />
    );
  }

  if (activeScenario) {
    return <GeneratingDialogueProgress scenario={activeScenario} />;
  }

  return (
    <section className="space-y-6">
      <CustomTopicCard
        level={level}
        onLevelChange={setLevel}
        customTopic={customTopic}
        onCustomTopicChange={setCustomTopic}
        onGenerate={generateCustom}
        pending={activeScenario === "Custom topic"}
        disabled={activeScenario !== null}
        error={error}
      />
      <ScenarioLibrary activeScenario={activeScenario} onGenerate={generate} />
    </section>
  );
}
