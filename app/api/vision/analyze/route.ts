import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth/session";
import { analyzeWithGemma } from "@/lib/hf/gemma-vision";
import { LEVELS, type Level } from "@/lib/languages";

export const maxDuration = 90;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (!session.targetLang || !session.nativeLang || !session.level) {
    return NextResponse.json({ error: "no_profile" }, { status: 400 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File)) return NextResponse.json({ error: "missing_image" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "image_too_large" }, { status: 413 });

  const buf = Buffer.from(await file.arrayBuffer());
  const imageBase64 = buf.toString("base64");
  const mimeType = file.type || "image/jpeg";

  const requestedLevel = String(form?.get("level") ?? "");
  const level = (LEVELS as readonly string[]).includes(requestedLevel)
    ? (requestedLevel as Level)
    : (session.level as Level);

  try {
    const result = await analyzeWithGemma({
      imageBase64,
      mimeType,
      targetLang: session.targetLang,
      nativeLang: session.nativeLang,
      level,
      accessToken: session.accessToken,
    });

    const mappedObjects = result.objects.map((o) => ({
      label: o.labelEn,
      translation: o.labelTarget,
      translationSegments: o.labelTargetSegments,
      romanized: o.romanized,
      box: o.box,
      score: 1,
    }));

    let imageUrl = "";
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = new Blob([buf], { type: mimeType });
        const upload = await put(
          `vision/${session.hfId}/${Date.now()}-${file.name || "photo.jpg"}`,
          blob,
          { access: "public", contentType: mimeType },
        );
        imageUrl = upload.url;
      } catch (err) {
        console.warn("blob upload failed", err);
      }
    }

    return NextResponse.json({
      id: crypto.randomUUID(),
      caption: result.caption,
      objects: mappedObjects,
      sentences: result.sentences,
      imageUrl,
    });
  } catch (err) {
    console.error("Gemma vision failed", err);
    // Extract human-readable message from HuggingFace ProviderApiError
    const hfMessage =
      (err as { httpResponse?: { body?: { message?: string } } })?.httpResponse?.body?.message ??
      (err instanceof Error ? err.message : null);
    const status = (err as { httpResponse?: { status?: number } })?.httpResponse?.status ?? 502;
    return NextResponse.json(
      { error: "inference_failed", message: hfMessage ?? "Gemma analysis failed. Please try again." },
      { status: status === 429 ? 429 : 502 },
    );
  }
}

