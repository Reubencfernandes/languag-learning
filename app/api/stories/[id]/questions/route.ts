import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { InferenceClient } from "@huggingface/inference";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { stories } from "@/lib/db/schema";

const hf = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

export type StoryQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  const [story] = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
  if (!story) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const system = `You are a reading comprehension quiz creator. Given a story, create 3 multiple-choice questions in English that test understanding of the story content.

Output STRICT JSON: an array of 3 objects:
[{ "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }]

Rules:
- correctIndex is 0-3 (index of the correct option in the options array)
- Shuffle so the correct answer is not always first
- explanation is 1 sentence explaining why the answer is correct`;

  const res = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `Story:\n${story.content}\n\nGenerate 3 comprehension questions.` },
    ],
    max_tokens: 700,
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const raw = res.choices?.[0]?.message?.content ?? "";

  try {
    const trimmed = raw.trim();
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      const match = trimmed.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("no JSON array found");
      parsed = JSON.parse(match[0]);
    }

    // Handle both array directly or wrapped in an object
    const arr: unknown[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as Record<string, unknown>).questions)
        ? ((parsed as Record<string, unknown>).questions as unknown[])
        : [];

    const questions: StoryQuestion[] = arr
      .filter((q): q is Record<string, unknown> => typeof q === "object" && q !== null)
      .map((q) => ({
        question: String(q.question ?? ""),
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        correctIndex: Number(q.correctIndex ?? 0),
        explanation: String(q.explanation ?? ""),
      }))
      .filter((q) => q.question && q.options.length >= 2);

    return NextResponse.json(questions);
  } catch (err) {
    console.error("questions parse failed", err);
    return NextResponse.json({ error: "parse_failed" }, { status: 502 });
  }
}
