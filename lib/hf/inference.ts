import { InferenceClient } from "@huggingface/inference";
import { floresCode, languageName, type Level } from "@/lib/languages";

const STORY_MODEL = "google/gemma-4-26B-A4B-it";
const TRANSLATE_MODEL = "facebook/nllb-200-distilled-600M";

export type StoryVocab = { word: string; gloss: string };

const LEVEL_BRIEFS: Record<Level, string> = {
  A1: "very simple, present tense, short sentences, everyday vocabulary, 60-90 words.",
  A2: "simple past/present, basic connectives, short paragraphs, 90-140 words.",
  B1: "mixed tenses, modest idiom, a small plot or reflection, 140-220 words.",
  B2: "varied tenses, some idiom, nuanced description, 220-320 words.",
  C1: "rich vocabulary, complex tense sequencing, sophisticated prose, 280-400 words.",
};

function createClient(accessToken?: string) {
  const token = accessToken || process.env.HF_TOKEN;
  if (!token) throw new Error("No HuggingFace access token available");
  return new InferenceClient(token);
}

export async function generateStory(opts: {
  targetLang: string;
  nativeLang: string;
  level: Level;
  topic?: string;
  accessToken?: string;
}): Promise<{ title: string; content: string; vocab: StoryVocab[] }> {
  const lang = languageName(opts.targetLang);
  const native = languageName(opts.nativeLang);
  const brief = LEVEL_BRIEFS[opts.level];
  const topic = opts.topic?.trim() || "an everyday scene";
  const isJapanese = opts.targetLang === "ja";
  const japaneseRule = isJapanese
    ? ` JAPANESE-SPECIFIC: every kanji compound in "title", "content", and "word" must be followed immediately by its hiragana reading in full-width parentheses, e.g. 漢字（かんじ）, 食（た）べる. Apply this consistently throughout the prose.`
    : "";
  const system =
    `You are a language-learning story writer. Produce a short story in ${lang} at CEFR ${opts.level}. ` +
    `Constraints: ${brief} Keep it engaging and coherent. Avoid offensive content. ` +
    `LOCK every sentence to CEFR ${opts.level}: vocabulary, grammar tense complexity, and idiom load must all match. A real ${opts.level} learner should follow the story without reaching for a dictionary on every line. ` +
    `Output STRICT JSON with keys: title (string in ${lang}), content (string in ${lang} - paragraphs separated by \\n\\n), vocab (array of 6-10 objects each with "word" in ${lang} and "gloss" in ${native}).${japaneseRule}`;
  const user = `Write a story about: ${topic}.`;

  const hf = createClient(opts.accessToken);
  const res = await hf.chatCompletion({
    provider: "novita",
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
  accessToken?: string;
}): Promise<string> {
  if (!opts.text.trim()) return "";
  const hf = createClient(opts.accessToken);
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

