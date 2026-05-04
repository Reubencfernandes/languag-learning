import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles, visionJobs } from "@/lib/db/schema";
import { analyzeWithGemma } from "@/lib/hf/gemma-vision";
import type { Level } from "@/lib/languages";

export const maxDuration = 90;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);
  if (!profile) return NextResponse.json({ error: "no_profile" }, { status: 400 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File)) return NextResponse.json({ error: "missing_image" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "image_too_large" }, { status: 413 });

  const buf = Buffer.from(await file.arrayBuffer());
  const imageBase64 = buf.toString("base64");
  const mimeType = file.type || "image/jpeg";

  try {
    const result = await analyzeWithGemma({
      imageBase64,
      mimeType,
      targetLang: profile.targetLang,
      nativeLang: profile.nativeLang,
      level: profile.level as Level,
    });

    // Map Gemma objects to the existing visionJobs schema shape
    const mappedObjects = result.objects.map((o) => ({
      label: o.labelEn,
      translation: o.labelTarget,
      // Gemma returns normalized 0-1 coords; visionJobs stores pixel-space ints.
      // We store as-is since the camera client now reads them as 0-1 fractions.
      box: o.box,
      score: 1,
    }));

    // Store blob if configured
    let imageUrl = "";
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = new Blob([buf], { type: mimeType });
        const upload = await put(
          `vision/${session.userId}/${Date.now()}-${file.name || "photo.jpg"}`,
          blob,
          { access: "public", contentType: mimeType },
        );
        imageUrl = upload.url;
      } catch (err) {
        console.warn("blob upload failed", err);
      }
    }

    const [job] = await db
      .insert(visionJobs)
      .values({
        userId: session.userId,
        imageUrl,
        caption: result.caption,
        objects: mappedObjects,
        sentences: result.sentences,
      })
      .returning();

    return NextResponse.json({
      id: job.id,
      caption: result.caption,
      objects: mappedObjects,
      sentences: result.sentences,
      imageUrl,
    });
  } catch (err) {
    console.error("Gemma vision failed", err);
    return NextResponse.json({ error: "inference_failed" }, { status: 502 });
  }
}
