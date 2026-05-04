import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users, profiles } from "@/lib/db/schema";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);

  return NextResponse.json({
    user: {
      id: user.id,
      hfUsername: user.hfUsername,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    profile: profile
      ? {
          nativeLang: profile.nativeLang,
          targetLang: profile.targetLang,
          level: profile.level,
        }
      : null,
  });
}
