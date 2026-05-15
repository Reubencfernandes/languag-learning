import { NextResponse } from "next/server";
import { getSession, signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const today = todayUTC();
  const last = session.lastActiveDate;

  let streakCount: number;
  if (!last) {
    streakCount = 1;
  } else if (last === today) {
    streakCount = session.streakCount ?? 1;
  } else {
    const diff = daysBetween(last, today);
    streakCount = diff === 1 ? (session.streakCount ?? 0) + 1 : 1;
  }

  const newJwt = await signSession({ ...session, streakCount, lastActiveDate: today });
  const isProd = process.env.NODE_ENV === "production";
  const res = NextResponse.json({ streakCount });
  res.cookies.set(SESSION_COOKIE, newJwt, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
