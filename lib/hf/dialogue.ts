import { InferenceClient } from "@huggingface/inference";
import { languageName, type Level } from "@/lib/languages";
import type { DialogueTurn } from "@/lib/db/schema";

const hf = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

const SCENARIO_HINTS: Record<Level, string> = {
  A1: "simple daily situations: buying food at a market, asking for directions, checking into a hostel, ordering a coffee",
  A2: "everyday transactions: taking a taxi, at the pharmacy, booking a train ticket, at a hotel reception",
  B1: "intermediate situations: a job interview, visiting a doctor, renting a flat, discussing travel plans",
  B2: "nuanced interactions: a business meeting, negotiating a contract, discussing news events, academic advising",
  C1: "complex scenarios: legal consultation, academic debate, diplomatic exchange, cultural discussion",
};

export async function generateDialogue(opts: {
  targetLang: string;
  level: Level;
  scenario?: string;
}): Promise<{ title: string; scenario: string; turns: DialogueTurn[] }> {
  const lang = languageName(opts.targetLang);
  const hint = SCENARIO_HINTS[opts.level];
  const scenarioPrompt = opts.scenario?.trim() || `a random situation from: ${hint}`;

  const system = `You are a language-learning dialogue writer. Create an interactive dialogue in ${lang} at CEFR ${opts.level}.

Rules:
- 8-12 turns total
- Mix of "narration" (English scene-setting), "character" (character speaks in ${lang}), and "user_choice" (player picks a response)
- Each "character" turn MUST have a "translation" field with the English meaning
- Each "user_choice" turn MUST have exactly 3 "options": 1 correct, 2 plausible but wrong
- Each option needs "feedback" (2-3 words explaining why correct/wrong)
- Language difficulty must match CEFR ${opts.level}
- End with a positive resolution

Output STRICT JSON:
{
  "title": "string (English title of the scenario)",
  "scenario": "string (1-2 sentence English description of the scene and role for the player)",
  "turns": [
    { "type": "narration", "text": "English description" },
    { "type": "character", "speakerName": "Name", "text": "${lang} speech", "translation": "English" },
    { "type": "user_choice", "text": "What do you say?", "options": [
      { "text": "${lang} option", "isCorrect": true, "feedback": "Perfect!" },
      { "text": "${lang} option", "isCorrect": false, "feedback": "Too formal" },
      { "text": "${lang} option", "isCorrect": false, "feedback": "Rude tone" }
    ]}
  ]
}`;

  const res = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `Create a dialogue about: ${scenarioPrompt}` },
    ],
    max_tokens: 1400,
    temperature: 0.8,
    response_format: { type: "json_object" },
  });

  const raw = res.choices?.[0]?.message?.content;
  if (!raw) throw new Error("empty dialogue response");

  const parsed = extractJson(raw);

  const turns: DialogueTurn[] = Array.isArray(parsed.turns)
    ? parsed.turns
        .filter((t: unknown): t is Record<string, unknown> => typeof t === "object" && t !== null)
        .map((t) => ({
          type: (t.type as DialogueTurn["type"]) ?? "narration",
          text: String(t.text ?? ""),
          translation: t.translation ? String(t.translation) : undefined,
          speakerName: t.speakerName ? String(t.speakerName) : undefined,
          options: Array.isArray(t.options)
            ? t.options
                .filter((o: unknown): o is Record<string, unknown> => typeof o === "object" && o !== null)
                .map((o) => ({
                  text: String(o.text ?? ""),
                  isCorrect: Boolean(o.isCorrect),
                  feedback: String(o.feedback ?? ""),
                }))
            : undefined,
        }))
    : [];

  return {
    title: String(parsed.title ?? "Dialogue"),
    scenario: String(parsed.scenario ?? ""),
    turns,
  };
}

function extractJson(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("could not parse dialogue JSON");
  }
}
