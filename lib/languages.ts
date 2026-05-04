export const LANGUAGES = [
  { code: "en", name: "English", flores: "eng_Latn" },
  { code: "es", name: "Spanish", flores: "spa_Latn" },
  { code: "fr", name: "French", flores: "fra_Latn" },
  { code: "de", name: "German", flores: "deu_Latn" },
  { code: "it", name: "Italian", flores: "ita_Latn" },
  { code: "pt", name: "Portuguese", flores: "por_Latn" },
  { code: "ja", name: "Japanese", flores: "jpn_Jpan" },
  { code: "ko", name: "Korean", flores: "kor_Hang" },
  { code: "zh", name: "Chinese (Simplified)", flores: "zho_Hans" },
  { code: "ar", name: "Arabic", flores: "arb_Arab" },
  { code: "hi", name: "Hindi", flores: "hin_Deva" },
  { code: "ru", name: "Russian", flores: "rus_Cyrl" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
export type Level = (typeof LEVELS)[number];

export function floresCode(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.flores ?? "eng_Latn";
}

export function languageName(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  A1: "Just starting — survival phrases.",
  A2: "Basic — familiar everyday topics.",
  B1: "Intermediate — can hold a conversation.",
  B2: "Upper-intermediate — fluent on most topics.",
  C1: "Advanced — nuanced, spontaneous use.",
};
