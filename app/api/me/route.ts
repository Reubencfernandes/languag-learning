import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  return NextResponse.json({
    user: {
      hfId: session.hfId,
      hfUsername: session.hfUsername,
      email: session.email,
      avatarUrl: session.avatarUrl,
    },
    profile: session.targetLang
      ? {
          nativeLang: session.nativeLang,
          targetLang: session.targetLang,
          targetLangs: session.targetLangs ?? [session.targetLang],
          level: session.level,
        }
      : null,
    streakCount: session.streakCount ?? 0,
  });
}

