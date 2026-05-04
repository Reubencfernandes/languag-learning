import { InferenceClient } from "@huggingface/inference";
import { languageName, type Level } from "@/lib/languages";

const hf = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

export type ExampleSentence = { target: string; gloss: string };

export async function generateSentencesForImage(opts: {
  captionEn: string;
  objectsEn: string[];
  targetLang: string;
  nativeLang: string;
  level: Level;
}): Promise<ExampleSentence[]> {
  const target = languageName(opts.targetLang);
  const native = languageName(opts.nativeLang);
  const system =
    `You are a language tutor. Given a photo caption and list of visible objects, produce 3 short example sentences in ${target} ` +
    `at CEFR ${opts.level} level describing what's in the image. Each sentence must come with a natural ${native} gloss. ` +
    `Output STRICT JSON: {"sentences": [{"target": string, "gloss": string}, ...]}.`;
  const user = `Caption: ${opts.captionEn}\nObjects: ${opts.objectsEn.join(", ") || "(none)"}\n`;

  const res = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 400,
    temperature: 0.6,
    response_format: { type: "json_object" },
  });
  const raw = res.choices?.[0]?.message?.content;
  if (!raw) return [];
  const parsed = safeParse(raw);
  const arr = Array.isArray(parsed.sentences) ? parsed.sentences : [];
  return arr
    .filter((v: unknown): v is { target: unknown; gloss: unknown } => typeof v === "object" && v !== null)
    .map((v) => ({ target: String(v.target ?? ""), gloss: String(v.gloss ?? "") }))
    .filter((v) => v.target);
}

function safeParse(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    return m ? (JSON.parse(m[0]) as Record<string, unknown>) : {};
  }
}
