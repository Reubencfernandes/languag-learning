import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { analyzePhrase } from "@/lib/hf/phrases";
import { LEVELS, type Level } from "@/lib/languages";

const bodySchema = z.object({
  text: z.string().trim().min(1).max(160),
  level: z.enum(LEVELS).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.targetLang || !session.level) return NextResponse.json({ error: "No profile" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid phrase" }, { status: 400 });
  }

  try {
    const result = await analyzePhrase({
      text: parsed.data.text,
      targetLang: session.targetLang,
      nativeLang: session.nativeLang ?? "en",
      level: (parsed.data.level ?? session.level) as Level,
      accessToken: session.accessToken,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("phrase analysis failed", err);
    const hfMessage =
      (err as { httpResponse?: { body?: { message?: string } } })?.httpResponse?.body?.message ??
      (err instanceof Error ? err.message : null);
    const status = (err as { httpResponse?: { status?: number } })?.httpResponse?.status ?? 502;
    return NextResponse.json(
      { error: "inference_failed", message: hfMessage ?? "Could not analyze this phrase." },
      { status: status === 429 ? 429 : 502 },
    );
  }
}
