import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";
import { LANGUAGES, LEVELS } from "@/lib/languages";

const languageCodes = LANGUAGES.map((l) => l.code) as [string, ...string[]];
const levelCodes = LEVELS as readonly string[] as [string, ...string[]];

const ProfileInput = z.object({
  nativeLang: z.enum(languageCodes),
  targetLang: z.enum(languageCodes),
  level: z.enum(levelCodes),
  targetLangs: z.array(z.enum(languageCodes)).min(1).optional(),
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

  const targetLangs = parsed.data.targetLangs ?? session.targetLangs;

  const newJwt = await signSession({
    ...session,
    nativeLang: parsed.data.nativeLang,
    targetLang: parsed.data.targetLang,
    targetLangs,
    level: parsed.data.level,
  });

  const res = NextResponse.json({
    profile: {
      nativeLang: parsed.data.nativeLang,
      targetLang: parsed.data.targetLang,
      targetLangs,
      level: parsed.data.level,
    },
  });

  res.cookies.set(SESSION_COOKIE, newJwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return res;
}

