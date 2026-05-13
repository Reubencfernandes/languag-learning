"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, X } from "lucide-react";

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
  const [quizLoading, setQuizLoading] = useState(false);
  const [questions, setQuestions] = useState<StoryQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const vocabMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of vocab) map.set(v.word.toLowerCase(), v.gloss);
    return map;
  }, [vocab]);

  useEffect(() => {
    fetch(`/api/stories/${storyId}/read`, { method: "POST" }).catch(() => {});
  }, [storyId]);

  async function handleWord(word: string, rect: DOMRect) {
    const clean = word.replace(/[^\p{L}\p{M}\p{N}\-']+/gu, "");
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
      const data = await res.json();
      setTranslation(data.translation ?? data.error ?? "-");
    } catch {
      setTranslation("-");
    } finally {
      setTranslating(false);
    }
  }

  async function loadQuiz() {
    setQuizLoading(true);
    setQuizError(null);
    try {
      const res = await fetch(`/api/stories/${storyId}/questions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content }),
      });
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
    return content.split(/\n\n+/).map((paragraph, paragraphIndex) => (
      <p key={paragraphIndex} className="mb-5 text-lg font-bold leading-8 text-[#3C3C3C]">
        {tokenize(paragraph).map((token, tokenIndex) =>
          token.word ? (
            <span
              key={tokenIndex}
              className="cursor-pointer rounded-md px-0.5 underline decoration-[#0EA5A4] decoration-2 underline-offset-4 transition hover:bg-[#CCFBF1]"
              onClick={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                void handleWord(token.text, rect);
              }}
            >
              {token.text}
            </span>
          ) : (
            <span key={tokenIndex}>{token.text}</span>
          ),
        )}
      </p>
    ));
  }

  const popupStyle = selection
    ? {
        top: Math.min(window.innerHeight - 132, selection.rect.bottom + 8),
        left: Math.max(16, Math.min(window.innerWidth - 288, selection.rect.left)),
      }
    : undefined;

  return (
    <div ref={containerRef} className="relative space-y-6">
      <section className="duo-card p-5 sm:p-7">{renderContent()}</section>

      {selection ? (
        <div role="dialog" style={popupStyle} className="fixed z-50 w-72 rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 shadow-[0_6px_0_rgba(0,0,0,0.12)]">
          <div className="flex items-start justify-between gap-2">
            <div className="text-base font-black text-[#3C3C3C]">{selection.word}</div>
            <button onClick={() => setSelection(null)} className="grid h-7 w-7 place-items-center rounded-full text-[#AFAFAF] hover:bg-[#F7F7F7]">
              <X size={16} />
            </button>
          </div>
          <div className="mt-2 text-sm font-bold text-[#3B82F6]">
            {translating ? "Translating..." : translation ?? "-"}
          </div>
        </div>
      ) : null}

      {vocab.length > 0 ? (
        <section className="duo-card p-5">
          <h2 className="duo-eyebrow">Key vocabulary</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {vocab.map((v) => (
              <div key={v.word} className="duo-soft-panel p-4">
                <dt className="text-base font-black text-[#3C3C3C]">{v.word}</dt>
                <dd className="mt-1 text-sm font-bold text-[#777777]">{v.gloss}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="duo-card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EFF6FF] text-[#3B82F6]">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#3C3C3C]">Test yourself</h2>
            <div className="text-xs font-bold text-[#777777]">Answer every question to finish the lesson.</div>
          </div>
        </div>

        {!questions && !quizLoading && !quizError ? (
          <button onClick={loadQuiz} className="btn-duo btn-duo-primary w-full sm:w-auto">
            Generate questions
          </button>
        ) : null}

        {quizLoading ? <p className="text-sm font-bold text-[#777777]">Generating questions...</p> : null}

        {quizError ? (
          <div className="space-y-3">
            <p className="text-sm font-bold text-[#BE123C]">{quizError}</p>
            <button onClick={loadQuiz} className="btn-duo btn-duo-white text-sm">
              Retry
            </button>
          </div>
        ) : null}

        {questions && questions.length === 0 ? (
          <p className="text-sm font-bold text-[#777777]">No questions were generated for this story.</p>
        ) : null}

        {questions && questions.length > 0 ? (
          <div className="space-y-7">
            {questions.map((q, questionIndex) => (
              <motion.div
                key={questionIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: questionIndex * 0.05, ease: EASE }}
                className="space-y-3"
              >
                <p className="text-base font-black text-[#3C3C3C]">
                  {questionIndex + 1}. {q.question}
                </p>
                <div className="grid gap-3">
                  {q.options.map((option, optionIndex) => {
                    const made = answers[questionIndex] !== undefined;
                    const chosen = answers[questionIndex] === optionIndex;
                    const correct = optionIndex === q.correctIndex;
                    let className = "duo-card duo-card-interactive p-4 text-left text-sm font-black text-[#3C3C3C]";

                    if (made && correct) className = "rounded-2xl border-2 border-[#0EA5A4] bg-[#CCFBF1] p-4 text-left text-sm font-black text-[#0B7C7B]";
                    if (made && chosen && !correct) className = "rounded-2xl border-2 border-[#F43F5E] bg-[#FFE4E6] p-4 text-left text-sm font-black text-[#BE123C]";
                    if (made && !chosen && !correct) className = "duo-card p-4 text-left text-sm font-black text-[#AFAFAF] opacity-70";

                    return (
                      <button
                        key={optionIndex}
                        disabled={made}
                        onClick={() => handleAnswer(questionIndex, optionIndex)}
                        className={className}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {answers[questionIndex] !== undefined ? (
                  <p className="text-xs font-bold leading-5 text-[#777777]">{q.explanation}</p>
                ) : null}
              </motion.div>
            ))}

            {quizScore !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="rounded-2xl border-2 border-[#0EA5A4] bg-[#CCFBF1] p-6 text-center"
              >
                <CheckCircle size={36} className="mx-auto text-[#0B7C7B]" />
                <div className="mt-2 text-3xl font-black text-[#0B7C7B]">
                  {quizScore} / {questions.length}
                </div>
                <p className="mt-1 text-sm font-black text-[#0B7C7B]">
                  {quizScore === questions.length ? "Perfect score!" : "Keep reading to improve!"}
                </p>
              </motion.div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function tokenize(text: string): Array<{ text: string; word: boolean }> {
  const out: Array<{ text: string; word: boolean }> = [];
  const re = /([\p{L}\p{M}][\p{L}\p{M}\p{N}\-']*)|([^\p{L}\p{M}\p{N}]+)/gu;
  for (const match of text.matchAll(re)) {
    if (match[1]) out.push({ text: match[1], word: true });
    else if (match[2]) out.push({ text: match[2], word: false });
  }
  return out;
}

