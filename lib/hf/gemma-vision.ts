import { InferenceClient } from "@huggingface/inference";
import { languageName, type Level } from "@/lib/languages";
import type { FuriSegment } from "@/lib/types/dialogue";

const GEMMA_MODEL = "google/gemma-4-26B-A4B-it";

export type VisionObject = {
  labelEn: string;
  labelTarget: string;
  labelTargetSegments?: FuriSegment[];
  romanized?: string;
  box: [number, number, number, number];
};

export type VisionSentence = {
  target: string;
  targetSegments?: FuriSegment[];
  gloss: string;
  romanized?: string;
};

export type GemmaVisionResult = {
  objects: VisionObject[];
  sentences: VisionSentence[];
  caption: string;
};

const LEVEL_SENTENCE_BRIEF: Record<Level, string> = {
  A1: "very short, present tense, using only basic vocabulary",
  A2: "simple past/present, basic connectives",
  B1: "mixed tenses with a short dependent clause",
  B2: "varied tenses, some idiom or descriptive language",
  C1: "rich vocabulary, complex structure, nuanced meaning",
};

function createClient(accessToken?: string) {
  const token = accessToken || process.env.HF_TOKEN;
  if (!token) throw new Error("No HuggingFace access token available");
  return new InferenceClient(token);
}

export async function analyzeWithGemma(opts: {
  imageBase64: string;
  mimeType: string;
  targetLang: string;
  nativeLang: string;
  level: Level;
  accessToken?: string;
}): Promise<GemmaVisionResult> {
  const lang = languageName(opts.targetLang);
  const brief = LEVEL_SENTENCE_BRIEF[opts.level];
  const isJapanese = opts.targetLang === "ja";
  const japaneseRule = isJapanese
    ? `\n\nJAPANESE-SPECIFIC: for EVERY Japanese string ("labelTarget" on each object, "target" on each sentence), ALSO emit a parallel "labelTargetSegments" / "targetSegments" array on the same item. Each segment is { "text": <substring>, "reading": <hiragana for kanji portions only> }. Concatenating each "text" reproduces the original Japanese string exactly. OMIT "reading" for pure-kana segments. Example: "自転車に乗る" → [{"text":"自転車","reading":"じてんしゃ"},{"text":"に"},{"text":"乗","reading":"の"},{"text":"る"}]. Do NOT add furigana parens inside the plain string fields. The "romanized" field stays as full romaji.`
    : "";

  const prompt = `You are a language-learning visual assistant. Analyze this image for a student learning ${lang} at CEFR ${opts.level}.

Tasks:
1. List all clearly visible objects (up to 10). For each provide:
   - English label
   - Label in ${lang}
   - Romanized pronunciation of the ${lang} label (if ${lang} uses a non-Latin script, e.g., Korean, Chinese, Hindi, etc.)
   - Bounding box as [x1, y1, x2, y2] with values 0–1 (normalized to image dimensions, origin top-left)

2. Write sentences in ${lang} using the detected objects. Sentences MUST be ${brief}. Vocabulary, grammar, and length must stay within CEFR ${opts.level} — never push above it. A real ${opts.level} learner should grasp each sentence on first read. Each sentence needs an English translation and a romanized pronunciation (if applicable).

3. Write a one-sentence English caption describing the overall scene.${japaneseRule}

Output STRICT JSON:
{
  "caption": "English scene description",
  "objects": [
    { "labelEn": "dog", "labelTarget": "${lang} word", "labelTargetSegments": [ /* JP only */ ], "romanized": "Roman version of the ${lang} word", "box": [0.1, 0.2, 0.4, 0.8] }
  ],
  "sentences": [
    { "target": "${lang} sentence", "targetSegments": [ /* JP only */ ], "romanized": "Roman version of the ${lang} sentence", "gloss": "English translation" }
  ]
}`;

  const hf = createClient(opts.accessToken);
  const res = await hf.chatCompletion({
    provider: "novita",
    model: GEMMA_MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: `data:${opts.mimeType};base64,${opts.imageBase64}` },
          },
        ],
      },
    ],
    max_tokens: 1200,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const raw = res.choices?.[0]?.message?.content;
  if (!raw) throw new Error("empty Gemma response");

  const parsed = extractJson(raw);

  const objects: VisionObject[] = Array.isArray(parsed.objects)
    ? parsed.objects
      .filter((o: unknown): o is Record<string, unknown> => typeof o === "object" && o !== null)
      .map((o) => ({
        labelEn: String(o.labelEn ?? ""),
        labelTarget: String(o.labelTarget ?? ""),
        labelTargetSegments: parseSegments(o.labelTargetSegments),
        romanized: o.romanized ? String(o.romanized) : undefined,
        box: (Array.isArray(o.box) && o.box.length === 4
          ? (o.box.map(Number) as [number, number, number, number])
          : [0, 0, 1, 1]) as [number, number, number, number],
      }))
      .filter((o) => o.labelEn && o.labelTarget)
    : [];

  const sentences: VisionSentence[] = Array.isArray(parsed.sentences)
    ? parsed.sentences
      .filter((s: unknown): s is Record<string, unknown> => typeof s === "object" && s !== null)
      .map((s) => ({
        target: String(s.target ?? ""),
        targetSegments: parseSegments(s.targetSegments),
        gloss: String(s.gloss ?? ""),
        romanized: s.romanized ? String(s.romanized) : undefined,
      }))
      .filter((s) => s.target && s.gloss)
    : [];

  return {
    objects,
    sentences,
    caption: String(parsed.caption ?? ""),
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

function extractJson(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("could not parse Gemma JSON");
  }
}

