import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { LANGUAGES, LEVELS } from "@/lib/languages";

const languageCodes = LANGUAGES.map((l) => l.code) as [string, ...string[]];
const levelCodes = LEVELS as readonly string[] as [string, ...string[]];

const ProfileInput = z.object({
  nativeLang: z.enum(languageCodes),
  targetLang: z.enum(languageCodes),
  level: z.enum(levelCodes),
});

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = ProfileInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.issues }, { status: 400 });
  }

  if (parsed.data.nativeLang === parsed.data.targetLang) {
    return NextResponse.json(
      { error: "same_language", message: "Native and target languages must differ." },
      { status: 400 },
    );
  }

  const [row] = await db
    .insert(profiles)
    .values({
      userId: session.userId,
      nativeLang: parsed.data.nativeLang,
      targetLang: parsed.data.targetLang,
      level: parsed.data.level,
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        nativeLang: parsed.data.nativeLang,
        targetLang: parsed.data.targetLang,
        level: parsed.data.level,
        updatedAt: new Date(),
      },
    })
    .returning();

  return NextResponse.json({
    profile: {
      nativeLang: row.nativeLang,
      targetLang: row.targetLang,
      level: row.level,
    },
  });
}
