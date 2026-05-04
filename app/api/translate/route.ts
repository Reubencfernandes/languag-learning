import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { translate } from "@/lib/hf/inference";
import { LANGUAGES } from "@/lib/languages";

const langCodes = LANGUAGES.map((l) => l.code) as [string, ...string[]];

const Input = z.object({
  text: z.string().min(1).max(400),
  from: z.enum(langCodes),
  to: z.enum(langCodes),
});

// In-memory cache for this serverless instance.
const cache = new Map<string, string>();
const MAX_CACHE = 500;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const parsed = Input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { text, from, to } = parsed.data;
  if (from === to) return NextResponse.json({ translation: text });

  const key = `${from}|${to}|${text.toLowerCase()}`;
  if (cache.has(key)) return NextResponse.json({ translation: cache.get(key), cached: true });

  try {
    const translation = await translate({ text, from, to });
    if (cache.size >= MAX_CACHE) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }
    cache.set(key, translation);
    return NextResponse.json({ translation });
  } catch (err) {
    console.error("translate error", err);
    return NextResponse.json({ error: "inference_failed" }, { status: 502 });
  }
}
