import { InferenceClient } from "@huggingface/inference";
import { languageName, type Level } from "@/lib/languages";
import { extractJson } from "@/lib/hf/json";

const MODEL = "google/gemma-4-26B-A4B-it";

export type PhraseSentence = {
  target: string;
  targetSegments?: FuriSegment[];
  translation: string;
  note: string;
};

export type PhraseBreakdown = {
  part: string;
  explanation: string;
};

import type { FuriSegment } from "@/lib/types/dialogue";

export type RelatedWord = {
  word: string;
  wordSegments?: FuriSegment[];
  translation: string;
  partOfSpeech: string;
  note?: string;
};

export type KanjiInfo = {
  kanji: string;
  onyomi: string[];
  kunyomi: string[];
  meaning: string;
  exampleWord?: string;
  exampleWordReading?: string;
};

export type PhraseAnalysis = {
  input: string;
  inputSegments?: FuriSegment[];
  translation: string;
  partOfSpeech: string;
  verbInfo?: string;
  breakdown: PhraseBreakdown[];
  sentences: PhraseSentence[];
  tips: string[];
  relatedWords: RelatedWord[];
  kanjiInfo: KanjiInfo[];
};

function createClient(accessToken?: string) {
  const token = accessToken || process.env.HF_TOKEN;
  if (!token) throw new Error("No HuggingFace access token available");
  return new InferenceClient(token);
}

export async function analyzePhrase(opts: {
  text: string;
  targetLang: string;
  nativeLang: string;
  level: Level;
  accessToken?: string;
}): Promise<PhraseAnalysis> {
  const hf = createClient(opts.accessToken);
  const lang = languageName(opts.targetLang);
  const native = languageName(opts.nativeLang);
  const phrase = opts.text.trim();

  const isJapanese = opts.targetLang === "ja";

  const japaneseRules = isJapanese
    ? `

JAPANESE-SPECIFIC RULES (target language is Japanese):
- For EACH Japanese string field listed below, ALSO emit a *Segments array beside it. Each segment is { "text": <one-or-more characters from the original string>, "reading": <hiragana reading, ONLY if "text" contains kanji> }. Concatenating every "text" in order MUST exactly reproduce the original string. For pure-kana segments, OMIT the "reading" field. Examples:
  • "私は猫が好きです" → segments: [{"text":"私","reading":"わたし"},{"text":"は"},{"text":"猫","reading":"ねこ"},{"text":"が"},{"text":"好","reading":"す"},{"text":"きです"}]
  • "東京駅" → [{"text":"東京駅","reading":"とうきょうえき"}]
  • "ありがとう" → [{"text":"ありがとう"}]
  Emit *Segments for: inputSegments, every sentences[i].targetSegments, every relatedWords[i].wordSegments. Do NOT add furigana parens inside the plain "input" / "target" / "word" fields — keep those as the original Japanese string only. Furigana lives ONLY inside the segment objects.
- Populate "kanjiInfo" with ONE entry per UNIQUE kanji character that appears in the input. For each kanji include:
    - "kanji": the single kanji character
    - "onyomi": array of common on'yomi readings written in KATAKANA (e.g. ["カン"])
    - "kunyomi": array of common kun'yomi readings written in HIRAGANA, with okurigana shown after a dot if relevant (e.g. ["やま", "た.べる"])
    - "meaning": short ${native} meaning of the kanji on its own
    - "exampleWord": one short common Japanese word that uses this kanji, KANJI ONLY (no parens)
    - "exampleWordReading": the hiragana reading of exampleWord
- If the input has NO kanji (pure kana or romaji), return "kanjiInfo": [].`
    : `\n- Return "kanjiInfo": [] and do not emit any *Segments fields.`;

  const system = `You are a careful language tutor for ${lang}. Explain one learner phrase or word at CEFR ${opts.level}.

Output STRICT JSON:
{
  "input": "the original phrase",
  "inputSegments": [ /* see Japanese-specific rules; omit if not Japanese */ ],
  "translation": "meaning in ${native}",
  "partOfSpeech": "noun / verb / adjective / phrase / expression / mixed",
  "verbInfo": "if there is a verb, explain infinitive, tense, subject agreement, and common forms in ${native}; otherwise empty string",
  "breakdown": [
    { "part": "word or morpheme", "explanation": "plain ${native} explanation" }
  ],
  "sentences": [
    { "target": "${lang} sentence using the phrase", "targetSegments": [ /* JP only */ ], "translation": "${native} meaning", "note": "why this usage works" }
  ],
  "tips": ["short practical usage tip"],
  "relatedWords": [
    { "word": "${lang} word from the same topic or word family", "wordSegments": [ /* JP only */ ], "translation": "${native} meaning", "partOfSpeech": "noun/verb/adjective/...", "note": "short ${native} note about how it relates" }
  ],
  "kanjiInfo": [
    { "kanji": "単", "onyomi": ["タン"], "kunyomi": ["ひと"], "meaning": "${native} meaning", "exampleWord": "簡単", "exampleWordReading": "かんたん" }
  ]
}

Rules:
- Create 5 example sentences.
- LOCK every example sentence, related word, and explanation to CEFR ${opts.level}. Vocabulary, grammar, sentence length, and idiomaticity must all match this level — not above, not below. If a related word would force a learner above ${opts.level}, swap it for one at-level. Picture a real ${opts.level} learner reading this and ask: would they understand each line on first read?
- If the input is already in ${native}, provide natural ${lang} equivalents.
- If the input is in ${lang}, explain it in ${native}.
- Include gender, register, collocations, and verb behavior when relevant.
- "relatedWords": list 6–8 ${lang} words from the SAME topic or semantic field as the input — synonyms, antonyms, common collocations, or other vocabulary a learner would naturally meet alongside the input. Each word must be a single word or tight collocation, not a sentence.
- Do not include markdown.${japaneseRules}`;

  const res = await hf.chatCompletion({
    provider: "novita",
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `Analyze this phrase or word: ${phrase}` },
    ],
    max_tokens: 2400,
    temperature: 0.35,
    response_format: { type: "json_object" },
  });

  const raw = res.choices?.[0]?.message?.content;
  if (!raw) throw new Error("empty phrase response");
  const parsed = extractJson(raw);

  return {
    input: String(parsed.input ?? phrase),
    inputSegments: parseSegments(parsed.inputSegments),
    translation: String(parsed.translation ?? ""),
    partOfSpeech: String(parsed.partOfSpeech ?? "phrase"),
    verbInfo: parsed.verbInfo ? String(parsed.verbInfo) : undefined,
    breakdown: Array.isArray(parsed.breakdown)
      ? parsed.breakdown
          .filter((item: unknown): item is Record<string, unknown> => typeof item === "object" && item !== null)
          .map((item) => ({
            part: String(item.part ?? ""),
            explanation: String(item.explanation ?? ""),
          }))
          .filter((item) => item.part || item.explanation)
      : [],
    sentences: Array.isArray(parsed.sentences)
      ? parsed.sentences
          .filter((item: unknown): item is Record<string, unknown> => typeof item === "object" && item !== null)
          .map((item) => ({
            target: String(item.target ?? ""),
            targetSegments: parseSegments(item.targetSegments),
            translation: String(item.translation ?? ""),
            note: String(item.note ?? ""),
          }))
          .filter((item) => item.target && item.translation)
      : [],
    tips: Array.isArray(parsed.tips) ? parsed.tips.map(String).filter(Boolean) : [],
    relatedWords: Array.isArray(parsed.relatedWords)
      ? parsed.relatedWords
          .filter((item: unknown): item is Record<string, unknown> => typeof item === "object" && item !== null)
          .map((item) => ({
            word: String(item.word ?? ""),
            wordSegments: parseSegments(item.wordSegments),
            translation: String(item.translation ?? ""),
            partOfSpeech: String(item.partOfSpeech ?? ""),
            note: item.note ? String(item.note) : undefined,
          }))
          .filter((item) => item.word && item.translation)
      : [],
    kanjiInfo: Array.isArray(parsed.kanjiInfo)
      ? parsed.kanjiInfo
          .filter((item: unknown): item is Record<string, unknown> => typeof item === "object" && item !== null)
          .map((item) => ({
            kanji: String(item.kanji ?? ""),
            onyomi: Array.isArray(item.onyomi) ? item.onyomi.map(String).filter(Boolean) : [],
            kunyomi: Array.isArray(item.kunyomi) ? item.kunyomi.map(String).filter(Boolean) : [],
            meaning: String(item.meaning ?? ""),
            exampleWord: item.exampleWord ? String(item.exampleWord) : undefined,
            exampleWordReading: item.exampleWordReading ? String(item.exampleWordReading) : undefined,
          }))
          .filter((item) => item.kanji && (item.onyomi.length || item.kunyomi.length))
      : [],
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

