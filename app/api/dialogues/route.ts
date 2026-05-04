import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { dialogues, profiles } from "@/lib/db/schema";
import { generateDialogue } from "@/lib/hf/dialogue";
import { z } from "zod";
import type { Level } from "@/lib/languages";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);

  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const rows = await db
    .select({
      id: dialogues.id,
      title: dialogues.title,
      scenario: dialogues.scenario,
      level: dialogues.level,
      createdAt: dialogues.createdAt,
    })
    .from(dialogues)
    .where(
      and(
        eq(dialogues.targetLang, profile.targetLang),
        eq(dialogues.level, profile.level),
      ),
    )
    .orderBy(desc(dialogues.createdAt))
    .limit(50);

  return NextResponse.json(rows);
}

const bodySchema = z.object({
  scenario: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);

  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  const scenario = parsed.success ? parsed.data.scenario : undefined;

  const generated = await generateDialogue({
    targetLang: profile.targetLang,
    level: profile.level as Level,
    scenario,
  });

  const [row] = await db
    .insert(dialogues)
    .values({
      targetLang: profile.targetLang,
      level: profile.level,
      title: generated.title,
      scenario: generated.scenario,
      turns: generated.turns,
      createdBy: session.userId,
    })
    .returning({ id: dialogues.id, title: dialogues.title, scenario: dialogues.scenario });

  return NextResponse.json(row, { status: 201 });
}
