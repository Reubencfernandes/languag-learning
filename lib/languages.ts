export const LANGUAGES = [
  { code: "en", name: "English", flores: "eng_Latn", flag: "US" },
  { code: "es", name: "Spanish", flores: "spa_Latn", flag: "ES" },
  { code: "fr", name: "French", flores: "fra_Latn", flag: "FR" },
  { code: "de", name: "German", flores: "deu_Latn", flag: "DE" },
  { code: "it", name: "Italian", flores: "ita_Latn", flag: "IT" },
  { code: "pt", name: "Portuguese", flores: "por_Latn", flag: "BR" },
  { code: "ja", name: "Japanese", flores: "jpn_Jpan", flag: "JP" },
  { code: "ko", name: "Korean", flores: "kor_Hang", flag: "KR" },
  { code: "zh", name: "Mandarin", flores: "zho_Hans", flag: "CN" },
  { code: "yue", name: "Cantonese", flores: "yue_Hant", flag: "HK" },
  { code: "ar", name: "Arabic", flores: "arb_Arab", flag: "SA" },
  { code: "hi", name: "Hindi", flores: "hin_Deva", flag: "IN" },
  { code: "kn", name: "Kannada", flores: "kan_Knda", flag: "IN" },
  { code: "ml", name: "Malayalam", flores: "mal_Mlym", flag: "IN" },
  { code: "vi", name: "Vietnamese", flores: "vie_Latn", flag: "VN" },
  { code: "ru", name: "Russian", flores: "rus_Cyrl", flag: "RU" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
export type Level = (typeof LEVELS)[number];

export function floresCode(code: string): string {
  return LANGUAGES.find((language) => language.code === code)?.flores ?? "eng_Latn";
}

export function languageName(code: string): string {
  return LANGUAGES.find((language) => language.code === code)?.name ?? code;
}

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  A1: "Just starting with survival phrases.",
  A2: "Basic everyday topics.",
  B1: "Intermediate conversations.",
  B2: "Fluent on most topics.",
  C1: "Advanced, nuanced use.",
};

