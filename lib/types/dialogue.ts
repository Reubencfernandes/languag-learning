// One segment of a Japanese string. `reading` is the hiragana for any kanji
// portion; omit it (or leave empty) for kana-only segments. Concatenating each
// `text` reproduces the original string exactly.
export type FuriSegment = { text: string; reading?: string };

export type DialogueOption = {
  text: string;
  textSegments?: FuriSegment[];
  isCorrect: boolean;
  feedback: string;
};

export type DialogueTurn = {
  type: "narration" | "character" | "user_choice";
  text: string;
  textSegments?: FuriSegment[];
  translation?: string;
  speakerName?: string;
  options?: DialogueOption[];
};

export type Dialogue = {
  id: string;
  title: string;
  scenario: string;
  level: string;
  targetLang: string;
  nativeLang: string;
  turns: DialogueTurn[];
};

export type Story = {
  id: string;
  title: string;
  content: string;
  vocab: Array<{ word: string; gloss: string }>;
  targetLang: string;
  nativeLang: string;
  level: string;
};

