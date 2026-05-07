import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { generateDialogue } from "@/lib/hf/dialogue";
import { z } from "zod";
import { LEVELS, type Level } from "@/lib/languages";

const bodySchema = z.object({
  scenario: z.string().max(200).optional(),
  level: z.enum(LEVELS).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.targetLang || !session.level) return NextResponse.json({ error: "No profile" }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  const scenario = parsed.success ? parsed.data.scenario : undefined;
  const level = (parsed.success && parsed.data.level ? parsed.data.level : session.level) as Level;

  try {
    const generated = await generateDialogue({
      targetLang: session.targetLang,
      nativeLang: session.nativeLang ?? "en",
      level,
      scenario,
      accessToken: session.accessToken!,
    });

    return NextResponse.json(
      {
        id: crypto.randomUUID(),
        targetLang: session.targetLang,
        nativeLang: session.nativeLang ?? "en",
        level,
        ...generated,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("dialogue generation failed", err);
    const hfMessage =
      (err as { httpResponse?: { body?: { message?: string } } })?.httpResponse?.body?.message ??
      (err instanceof Error ? err.message : null);
    const status = (err as { httpResponse?: { status?: number } })?.httpResponse?.status ?? 502;
    return NextResponse.json(
      { error: "inference_failed", message: hfMessage ?? "Could not generate this dialogue." },
      { status: status === 429 ? 429 : 502 },
    );
  }
}

