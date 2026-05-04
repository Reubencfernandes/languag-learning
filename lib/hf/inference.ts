import { InferenceClient } from "@huggingface/inference";
import { floresCode, languageName, type Level } from "@/lib/languages";

const hf = new InferenceClient(process.env.HF_TOKEN);

const STORY_MODEL = "mistralai/Mistral-7B-Instruct-v0.3";
const CAPTION_MODEL = "Salesforce/blip-image-captioning-large";
const DETECT_MODEL = "facebook/detr-resnet-50";
const TRANSLATE_MODEL = "facebook/nllb-200-distilled-600M";

export type DetectedObject = {
  label: string;
  translation: string;
  box: [number, number, number, number];
  score: number;
};

export type StoryVocab = { word: string; gloss: string };

const LEVEL_BRIEFS: Record<Level, string> = {
  A1: "very simple, present tense, short sentences, everyday vocabulary, 60-90 words.",
  A2: "simple past/present, basic connectives, short paragraphs, 90-140 words.",
  B1: "mixed tenses, modest idiom, a small plot or reflection, 140-220 words.",
  B2: "varied tenses, some idiom, nuanced description, 220-320 words.",
  C1: "rich vocabulary, complex tense sequencing, sophisticated prose, 280-400 words.",
};

export async function generateStory(opts: {
  targetLang: string;
  level: Level;
  topic?: string;
}): Promise<{ title: string; content: string; vocab: StoryVocab[] }> {
  const lang = languageName(opts.targetLang);
  const brief = LEVEL_BRIEFS[opts.level];
  const topic = opts.topic?.trim() || "an everyday scene";
  const system =
    `You are a language-learning story writer. Produce a short story in ${lang} at CEFR ${opts.level}. ` +
    `Constraints: ${brief} Keep it engaging and coherent. Avoid offensive content. ` +
    `Output STRICT JSON with keys: title (string in ${lang}), content (string in ${lang} - paragraphs separated by \\n\\n), vocab (array of 6-10 objects each with "word" in ${lang} and "gloss" in English).`;
  const user = `Write a story about: ${topic}.`;

  const res = await hf.chatCompletion({
    model: STORY_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 900,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const raw = res.choices?.[0]?.message?.content;
  if (!raw) throw new Error("empty story response");
  const parsed = extractJson(raw);
  return {
    title: String(parsed.title ?? "Untitled"),
    content: String(parsed.content ?? ""),
    vocab: Array.isArray(parsed.vocab)
      ? parsed.vocab
          .filter((v: unknown): v is { word: unknown; gloss: unknown } => typeof v === "object" && v !== null)
          .map((v) => ({ word: String(v.word ?? ""), gloss: String(v.gloss ?? "") }))
          .filter((v) => v.word && v.gloss)
      : [],
  };
}

export async function translate(opts: {
  text: string;
  from: string;
  to: string;
}): Promise<string> {
  if (!opts.text.trim()) return "";
  const res = await hf.translation({
    model: TRANSLATE_MODEL,
    inputs: opts.text,
    parameters: {
      src_lang: floresCode(opts.from),
      tgt_lang: floresCode(opts.to),
    } as Record<string, string>,
  });
  if (Array.isArray(res)) return (res[0] as { translation_text?: string })?.translation_text ?? "";
  return (res as { translation_text?: string }).translation_text ?? "";
}

export async function captionImage(opts: { image: Blob }): Promise<string> {
  const res = await hf.imageToText({
    model: CAPTION_MODEL,
    data: opts.image,
  });
  return (res as { generated_text?: string }).generated_text ?? "";
}

export async function detectObjects(opts: { image: Blob; min_score?: number }): Promise<
  Array<{ label: string; box: [number, number, number, number]; score: number }>
> {
  const res = (await hf.objectDetection({ model: DETECT_MODEL, data: opts.image })) as Array<{
    label: string;
    score: number;
    box: { xmin: number; ymin: number; xmax: number; ymax: number };
  }>;
  const min = opts.min_score ?? 0.6;
  return res
    .filter((r) => r.score >= min)
    .map((r) => ({
      label: r.label,
      score: r.score,
      box: [r.box.xmin, r.box.ymin, r.box.xmax, r.box.ymax],
    }));
}

function extractJson(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Sometimes models wrap JSON in ```json fences — try to peel.
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("could not parse model JSON");
  }
}
