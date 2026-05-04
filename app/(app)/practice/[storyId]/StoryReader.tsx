"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle } from "lucide-react";

type Vocab = { word: string; gloss: string };

type StoryQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Props = {
  storyId: string;
  content: string;
  vocab: Vocab[];
  fromLang: string;
  toLang: string;
};

type Selection = { word: string; rect: DOMRect } | null;

const EASE = [0.16, 1, 0.3, 1] as const;

export function StoryReader({ storyId, content, vocab, fromLang, toLang }: Props) {
  const [selection, setSelection] = useState<Selection>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  // Quiz state
  const [quizLoading, setQuizLoading] = useState(false);
  const [questions, setQuestions] = useState<StoryQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const vocabMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const v of vocab) m.set(v.word.toLowerCase(), v.gloss);
    return m;
  }, [vocab]);

  useEffect(() => {
    fetch(`/api/stories/${storyId}/read`, { method: "POST" }).catch(() => {});
  }, [storyId]);

  async function handleWord(word: string, rect: DOMRect) {
    const clean = word.replace(/[^\p{L}\p{M}\p{N}\-'']+/gu, "");
    if (!clean) return;
    setSelection({ word: clean, rect });
    setTranslation(null);

    const pre = vocabMap.get(clean.toLowerCase());
    if (pre) {
      setTranslation(pre);
      return;
    }

    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: clean, from: fromLang, to: toLang }),
      });
      const j = await res.json();
      setTranslation(j.translation ?? j.error ?? "—");
    } catch {
      setTranslation("—");
    } finally {
      setTranslating(false);
    }
  }

  async function loadQuiz() {
    setQuizLoading(true);
    setQuizError(null);
    try {
      const res = await fetch(`/api/stories/${storyId}/questions`, { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch {
      setQuizError("Could not load questions. Try again.");
    } finally {
      setQuizLoading(false);
    }
  }

  function handleAnswer(qIdx: number, oIdx: number) {
    if (answers[qIdx] !== undefined) return;
    setAnswers((prev) => {
      const next = { ...prev, [qIdx]: oIdx };
      if (questions && Object.keys(next).length === questions.length) {
        const correct = questions.filter((q, i) => next[i] === q.correctIndex).length;
        setQuizScore(correct);
      }
      return next;
    });
  }

  function renderContent() {
    const paragraphs = content.split(/\n\n+/);
    return paragraphs.map((para, pi) => (
      <p key={pi} className="mb-5 text-lg leading-relaxed text-[#E1E0CC]">
        {tokenize(para).map((tok, ti) =>
          tok.word ? (
            <span
              key={ti}
              className="cursor-pointer rounded-sm px-0.5 transition hover:bg-primary/15"
              onClick={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                void handleWord(tok.text, rect);
              }}
            >
              {tok.text}
            </span>
          ) : (
            <span key={ti}>{tok.text}</span>
          ),
        )}
      </p>
    ));
  }

  return (
    <div className="relative" ref={containerRef}>
      {renderContent()}

      {/* Translation popup */}
      {selection ? (
        <div
          role="dialog"
          style={{
            position: "fixed",
            top: Math.min(window.innerHeight - 120, selection.rect.bottom + 8),
            left: Math.max(16, Math.min(window.innerWidth - 280, selection.rect.left)),
            borderColor: "rgba(225,224,204,0.16)",
            background: "#101010",
          }}
          className="z-50 w-64 rounded-xl border p-3 shadow-xl"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-medium text-[#E1E0CC]">{selection.word}</div>
            <button
              onClick={() => setSelection(null)}
              className="text-xs"
              style={{ color: "rgba(225,224,204,0.5)" }}
            >
              ✕
            </button>
          </div>
          <div className="mt-1 text-sm" style={{ color: "rgba(225,224,204,0.6)" }}>
            {translating ? "Translating…" : translation ?? "—"}
          </div>
        </div>
      ) : null}

      {/* Vocabulary */}
      {vocab.length > 0 ? (
        <section className="mt-10 border-t pt-6" style={{ borderColor: "rgba(225,224,204,0.1)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(225,224,204,0.5)" }}>
            Key vocabulary
          </h2>
          <dl className="mt-3 grid gap-y-2 gap-x-6 sm:grid-cols-2">
            {vocab.map((v) => (
              <div key={v.word} className="flex items-baseline gap-3">
                <dt className="font-medium text-[#E1E0CC]">{v.word}</dt>
                <dd className="text-sm" style={{ color: "rgba(225,224,204,0.55)" }}>{v.gloss}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* Quiz section */}
      <section className="mt-12 border-t pt-8" style={{ borderColor: "rgba(225,224,204,0.1)" }}>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={18} style={{ color: "rgba(225,224,204,0.5)" }} />
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(225,224,204,0.5)" }}>
            Test yourself
          </h2>
        </div>

        {!questions && !quizLoading && !quizError && (
          <button
            onClick={loadQuiz}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
          >
            Generate questions
          </button>
        )}

        {quizLoading && (
          <p className="text-sm" style={{ color: "rgba(225,224,204,0.5)" }}>
            Generating questions…
          </p>
        )}

        {quizError && (
          <div className="space-y-2">
            <p className="text-sm text-red-400">{quizError}</p>
            <button onClick={loadQuiz} className="text-xs text-primary hover:opacity-80">
              Retry
            </button>
          </div>
        )}

        {questions && questions.length > 0 && (
          <div className="space-y-8">
            {questions.map((q, qi) => (
              <motion.div
                key={qi}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: qi * 0.1, ease: EASE }}
                className="space-y-3"
              >
                <p className="text-[#E1E0CC] font-medium">
                  {qi + 1}. {q.question}
                </p>
                <div className="grid gap-2">
                  {q.options.map((opt, oi) => {
                    const made = answers[qi] !== undefined;
                    const isChosen = answers[qi] === oi;
                    const isCorrect = oi === q.correctIndex;

                    let borderColor = "rgba(225,224,204,0.12)";
                    let bg = "#101010";
                    let textColor = "#E1E0CC";

                    if (made) {
                      if (isCorrect) {
                        borderColor = "rgba(134,239,172,0.5)";
                        bg = "rgba(134,239,172,0.08)";
                        textColor = "#86efac";
                      } else if (isChosen) {
                        borderColor = "rgba(252,165,165,0.5)";
                        bg = "rgba(252,165,165,0.08)";
                        textColor = "#fca5a5";
                      } else {
                        textColor = "rgba(225,224,204,0.3)";
                      }
                    }

                    return (
                      <button
                        key={oi}
                        disabled={made}
                        onClick={() => handleAnswer(qi, oi)}
                        className="rounded-xl border p-3 text-left text-sm transition-all hover:border-primary/40 disabled:cursor-default"
                        style={{ borderColor, background: bg, color: textColor }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {answers[qi] !== undefined && (
                  <AnimatePresence>
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs pl-1"
                      style={{ color: "rgba(225,224,204,0.5)" }}
                    >
                      {q.explanation}
                    </motion.p>
                  </AnimatePresence>
                )}
              </motion.div>
            ))}

            {quizScore !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="rounded-2xl border p-6 text-center space-y-2"
                style={{ borderColor: "rgba(225,224,204,0.12)", background: "#101010" }}
              >
                <CheckCircle size={32} className="mx-auto text-primary" />
                <div className="text-xl font-bold text-[#E1E0CC]">
                  {quizScore} / {questions.length}
                </div>
                <p className="text-sm" style={{ color: "rgba(225,224,204,0.5)" }}>
                  {quizScore === questions.length ? "Perfect score!" : "Keep reading to improve!"}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function tokenize(text: string): Array<{ text: string; word: boolean }> {
  const out: Array<{ text: string; word: boolean }> = [];
  const re = /([\p{L}\p{M}][\p{L}\p{M}\p{N}\-'']*)|([^\p{L}\p{M}\p{N}]+)/gu;
  for (const m of text.matchAll(re)) {
    if (m[1]) out.push({ text: m[1], word: true });
    else if (m[2]) out.push({ text: m[2], word: false });
  }
  return out;
}
