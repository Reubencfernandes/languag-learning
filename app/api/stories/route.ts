import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { generateStory } from "@/lib/hf/inference";
import type { Level } from "@/lib/languages";

const Input = z.object({
  topic: z.string().min(1).max(200).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (!session.targetLang || !session.level) return NextResponse.json({ error: "no_profile" }, { status: 400 });
  const parsed = Input.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  try {
    const gen = await generateStory({
      targetLang: session.targetLang,
      nativeLang: session.nativeLang ?? "en",
      level: session.level as Level,
      topic: parsed.data.topic,
      accessToken: session.accessToken,
    });

    return NextResponse.json({
      story: {
        id: crypto.randomUUID(),
        targetLang: session.targetLang,
        nativeLang: session.nativeLang ?? "en",
        level: session.level,
        ...gen,
      },
    });
  } catch (err) {
    console.error("story generation failed", err);
    return NextResponse.json({ error: "inference_failed" }, { status: 502 });
  }
}

