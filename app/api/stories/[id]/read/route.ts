import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { storyReads } from "@/lib/db/schema";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  await db
    .insert(storyReads)
    .values({ userId: session.userId, storyId: id })
    .onConflictDoUpdate({
      target: [storyReads.userId, storyReads.storyId],
      set: { completedAt: sql`now()` },
    });

  return NextResponse.json({ ok: true });
}
