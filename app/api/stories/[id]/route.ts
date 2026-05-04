import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { stories } from "@/lib/db/schema";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  const [story] = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
  if (!story) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ story });
}
