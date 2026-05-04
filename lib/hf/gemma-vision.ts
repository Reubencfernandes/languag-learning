import { InferenceClient } from "@huggingface/inference";
import { languageName, type Level } from "@/lib/languages";

const hf = new InferenceClient(process.env.HF_TOKEN);
const GEMMA_MODEL = "google/gemma-4-31b-it";

export type VisionObject = {
  labelEn: string;
  labelTarget: string;
  box: [number, number, number, number];
};

export type VisionSentence = {
  target: string;
  gloss: string;
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

export async function analyzeWithGemma(opts: {
  imageBase64: string;
  mimeType: string;
  targetLang: string;
  nativeLang: string;
  level: Level;
}): Promise<GemmaVisionResult> {
  const lang = languageName(opts.targetLang);
  const brief = LEVEL_SENTENCE_BRIEF[opts.level];

  const prompt = `You are a language-learning visual assistant. Analyze this image for a student learning ${lang} at CEFR ${opts.level}.

Tasks:
1. List all clearly visible objects (up to 10). For each provide:
   - English label
   - Label in ${lang}
   - Bounding box as [x1, y1, x2, y2] with values 0–1 (normalized to image dimensions, origin top-left)

2. Write 3–5 example sentences in ${lang} using the detected objects. Sentences must be ${brief}. Each sentence needs an English translation.

3. Write a one-sentence English caption describing the overall scene.

Output STRICT JSON:
{
  "caption": "English scene description",
  "objects": [
    { "labelEn": "dog", "labelTarget": "${lang} word", "box": [0.1, 0.2, 0.4, 0.8] }
  ],
  "sentences": [
    { "target": "${lang} sentence", "gloss": "English translation" }
  ]
}`;

  const res = await hf.chatCompletion({
    model: GEMMA_MODEL,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${opts.mimeType};base64,${opts.imageBase64}` },
          },
          { type: "text", text: prompt },
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
          box: (Array.isArray(o.box) && o.box.length === 4
            ? (o.box.map(Number) as [number, number, number, number])
            : [0, 0, 1, 1]) as [number, number, number, number],
        }))
        .filter((o) => o.labelEn && o.labelTarget)
    : [];

  const sentences: VisionSentence[] = Array.isArray(parsed.sentences)
    ? parsed.sentences
        .filter((s: unknown): s is Record<string, unknown> => typeof s === "object" && s !== null)
        .map((s) => ({ target: String(s.target ?? ""), gloss: String(s.gloss ?? "") }))
        .filter((s) => s.target && s.gloss)
    : [];

  return {
    objects,
    sentences,
    caption: String(parsed.caption ?? ""),
  };
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
