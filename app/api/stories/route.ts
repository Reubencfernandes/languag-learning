import { NextResponse } from "next/server";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles, stories } from "@/lib/db/schema";
import { generateStory } from "@/lib/hf/inference";
import type { Level } from "@/lib/languages";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);

  if (!profile) return NextResponse.json({ error: "no_profile" }, { status: 400 });

  const rows = await db
    .select({
      id: stories.id,
      title: stories.title,
      targetLang: stories.targetLang,
      level: stories.level,
      createdAt: stories.createdAt,
    })
    .from(stories)
    .where(and(eq(stories.targetLang, profile.targetLang), eq(stories.level, profile.level)))
    .orderBy(desc(stories.createdAt))
    .limit(50);

  return NextResponse.json({
    stories: rows,
    profile: {
      nativeLang: profile.nativeLang,
      targetLang: profile.targetLang,
      level: profile.level,
    },
  });
}

const Input = z.object({
  topic: z.string().min(1).max(200).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);
  if (!profile) return NextResponse.json({ error: "no_profile" }, { status: 400 });

  const parsed = Input.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  try {
    const gen = await generateStory({
      targetLang: profile.targetLang,
      level: profile.level as Level,
      topic: parsed.data.topic,
    });
    const [row] = await db
      .insert(stories)
      .values({
        targetLang: profile.targetLang,
        level: profile.level,
        title: gen.title,
        content: gen.content,
        vocab: gen.vocab,
        createdBy: session.userId,
      })
      .returning();
    return NextResponse.json({ story: row });
  } catch (err) {
    console.error("story generation failed", err);
    return NextResponse.json({ error: "inference_failed" }, { status: 502 });
  }
}
