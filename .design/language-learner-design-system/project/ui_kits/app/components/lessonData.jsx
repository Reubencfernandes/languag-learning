// Shared lesson data model (one lesson, matches the spec's lesson_data fields)
const LESSON_SOUND_GREET = {
  lesson_id: 'jp-u1-l3-greetings',
  language: 'Japanese',
  stage: 'A1', unit: 1, topic: 'Sounds & Greetings',
  objective: 'Greet someone and ask how they are doing.',
  key_vocabulary: [
    { jp: 'こんにちは', romaji: 'konnichiwa', en: 'hello / good afternoon' },
    { jp: 'おはよう',   romaji: 'ohayō',      en: 'good morning (casual)' },
    { jp: 'こんばんは', romaji: 'konbanwa',   en: 'good evening' },
    { jp: 'お元気',     romaji: 'o-genki',    en: 'well / in good spirits' },
    { jp: 'はい',       romaji: 'hai',        en: 'yes' },
    { jp: 'いいえ',     romaji: 'iie',        en: 'no' },
  ],
  main_grammar_pattern: {
    name: '〜ですか？  (The polite question)',
    skeleton: 'X + です + か？',
    meaning: 'Turns a polite statement into a yes/no question. です is the polite copula; か marks a question.',
  },
  support_grammar_patterns: [
    { name: 'お + noun (respectful prefix)', meaning: 'お before a noun softens and honors it (お元気 = your well-being).' },
  ],
  example_sentences: [
    { jp: 'お元気ですか？', romaji: 'O-genki desu ka?', en: 'How are you?' },
    { jp: 'はい、元気です。', romaji: 'Hai, genki desu.', en: 'Yes, I am well.' },
    { jp: 'こんばんは。',     romaji: 'Konbanwa.',       en: 'Good evening.' },
  ],
  short_dialogue: [
    { speaker: 'A', jp: 'こんにちは！', romaji: 'Konnichiwa!',        en: 'Hello!' },
    { speaker: 'B', jp: 'こんにちは。お元気ですか？', romaji: 'Konnichiwa. O-genki desu ka?', en: 'Hello. How are you?' },
    { speaker: 'A', jp: 'はい、元気です。',           romaji: 'Hai, genki desu.',            en: 'Yes, I am well.' },
  ],
  study_explanation: 'か acts like a question mark you can hear. Say a normal polite sentence with です, then add か at the end to turn it into a question. No rising tone required — the か does the work.',
  comprehension_questions: [
    { prompt: 'Which line in the dialogue is a question?', options: ['こんにちは！','お元気ですか？','はい、元気です。'], correct: 1 },
  ],
  gap_fill_items: [
    { before: 'お元気 ', blank: 'です', after: ' か？', prompt: 'Fill the blank — polite form', choices: ['です','だ','でした'], correct: 0 },
    { before: 'はい、', blank: '元気', after: ' です。', prompt: 'Fill the blank — well / good', choices: ['元気','先生','学校'], correct: 0 },
  ],
  reply_selection_items: [
    { heard: 'こんにちは！お元気ですか？', replies: ['はい、元気です。', 'さようなら。', 'いただきます。'], correct: 0 },
  ],
  interaction_prompt: 'Type a short reply to greet a neighbor in the evening.',
  listening_task: { audio: 'konnichiwa.mp3', transcript: 'こんにちは', hint: 'Common daytime greeting' },
  solo_challenge_items: 6,
  review_targets: ['particle か', 'vocab: お元気', 'vocab: はい'],
};

window.LESSON_SOUND_GREET = LESSON_SOUND_GREET;
