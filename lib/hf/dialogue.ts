import { InferenceClient } from "@huggingface/inference";
import { languageName, type Level } from "@/lib/languages";
import type { DialogueTurn, FuriSegment } from "@/lib/types/dialogue";
import { extractJson } from "@/lib/hf/json";

const MODEL = "google/gemma-4-26B-A4B-it";

const SCENARIO_HINTS: Record<Level, string> = {
  A1: "simple daily situations: buying food at a market, asking for directions, checking into a hostel, ordering a coffee",
  A2: "everyday transactions: taking a taxi, at the pharmacy, booking a train ticket, at a hotel reception",
  B1: "intermediate situations: a job interview, visiting a doctor, renting a flat, discussing travel plans",
  B2: "nuanced interactions: a business meeting, negotiating a contract, discussing news events, academic advising",
  C1: "complex scenarios: legal consultation, academic debate, diplomatic exchange, cultural discussion",
};

export async function generateDialogue(opts: {
  targetLang: string;
  nativeLang: string;
  level: Level;
  scenario?: string;
  accessToken: string;
}): Promise<{ title: string; scenario: string; turns: DialogueTurn[] }> {
  const hf = new InferenceClient(opts.accessToken);
  const lang = languageName(opts.targetLang);
  const native = languageName(opts.nativeLang);
  const hint = SCENARIO_HINTS[opts.level];
  const scenarioPrompt = opts.scenario?.trim() || `a random situation from: ${hint}`;

  const isJapanese = opts.targetLang === "ja";
  const japaneseRule = isJapanese
    ? `\n- TARGET LANGUAGE IS JAPANESE: for EVERY Japanese-text field (each "character" turn's "text", each option's "text"), ALSO emit a parallel "textSegments" array on the same object. Each segment is { "text": <substring>, "reading": <hiragana for kanji portions only> }. Concatenating all "text" values reproduces the original string exactly. OMIT "reading" for pure-kana segments. Example: "猫が好きです" → [{"text":"猫","reading":"ねこ"},{"text":"が"},{"text":"好","reading":"す"},{"text":"きです"}]. Do NOT add furigana parens inside the plain "text" field — keep that pure Japanese.`
    : "";

  const system = `You are a language-learning dialogue writer. Create an interactive dialogue in ${lang} at CEFR ${opts.level}.

Rules:
- 8-12 turns total
- TWO distinct named characters speak in this scene (give them culturally appropriate names and clearly different roles, e.g. clerk + traveler, doctor + patient, two friends with contrasting personalities). Alternate between them naturally so the user hears both voices.
- Mix of "narration" (${native} scene-setting), "character" (character speaks in ${lang}), and "user_choice" (player picks a response)
- Each "character" turn MUST set "speakerName" to ONE of the two names you chose, and MUST have a "translation" field with the meaning in ${native}
- Each "user_choice" turn MUST have exactly 3 "options": 1 correct, 2 plausible but wrong
- VARY the position of the correct option across turns — sometimes first, sometimes second, sometimes third. Never put the correct one in the same slot twice in a row. (The client also reshuffles, but YOUR draft should not always lead with the correct one.)
- Wrong options should be genuinely tempting (right register but wrong meaning, right meaning but rude tone, grammatically odd, etc.) — not obviously silly.
- Each option needs "feedback" (2-3 words in ${native} explaining why correct/wrong)
- LOCK the language difficulty to CEFR ${opts.level}. Vocabulary, grammar tenses, sentence length, and idiom load must all match this level. A real ${opts.level} learner should understand each character line on first read. If a phrase would push them above ${opts.level}, simplify it to stay in band.
- Make each generation FRESH — vary the setting details, character names, conflict, and resolution. Avoid generic templates. Pick concrete specifics (a particular dish, a real-sounding street name, an unusual request).
- End with a positive or interesting resolution${japaneseRule}

Output STRICT JSON:
{
  "title": "string (${native} title of the scenario)",
  "scenario": "string (1-2 sentence ${native} description of the scene and role for the player)",
  "turns": [
    { "type": "narration", "text": "${native} description" },
    { "type": "character", "speakerName": "Name", "text": "${lang} speech", "textSegments": [ /* JP only */ ], "translation": "${native} meaning" },
    { "type": "user_choice", "text": "What do you say?", "options": [
      { "text": "${lang} option", "textSegments": [ /* JP only */ ], "isCorrect": true, "feedback": "${native}: Perfect!" },
      { "text": "${lang} option", "textSegments": [ /* JP only */ ], "isCorrect": false, "feedback": "${native}: Too formal" },
      { "text": "${lang} option", "textSegments": [ /* JP only */ ], "isCorrect": false, "feedback": "${native}: Rude tone" }
    ]}
  ]
}`;

  const varietySeed = Math.random().toString(36).slice(2, 8);

  const res = await hf.chatCompletion({
    provider: "novita",
    model: MODEL,
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: `Create a fresh dialogue about: ${scenarioPrompt}.\n\nVariety seed (pick unrelated specifics for this run): ${varietySeed}.`,
      },
    ],
    max_tokens: 1600,
    temperature: 1.0,
    top_p: 0.95,
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
          textSegments: parseSegments(t.textSegments),
          translation: t.translation ? String(t.translation) : undefined,
          speakerName: t.speakerName ? String(t.speakerName) : undefined,
          options: Array.isArray(t.options)
            ? t.options
                .filter((o: unknown): o is Record<string, unknown> => typeof o === "object" && o !== null)
                .map((o) => ({
                  text: String(o.text ?? ""),
                  textSegments: parseSegments(o.textSegments),
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

function parseSegments(raw: unknown): FuriSegment[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const segments = raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      text: String(item.text ?? ""),
      reading: item.reading ? String(item.reading) : undefined,
    }))
    .filter((seg) => seg.text);
  return segments.length ? segments : undefined;
}

