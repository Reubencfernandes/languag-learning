import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { dialogues } from "@/lib/db/schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [dialogue] = await db
    .select()
    .from(dialogues)
    .where(eq(dialogues.id, id))
    .limit(1);

  if (!dialogue) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(dialogue);
}
