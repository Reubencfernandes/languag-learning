import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles, stories } from "@/lib/db/schema";
import { languageName } from "@/lib/languages";
import { StoryReader } from "./StoryReader";

export default async function StoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params;
  const session = (await getSession())!;

  const [story] = await db.select().from(stories).where(eq(stories.id, storyId)).limit(1);
  if (!story) notFound();

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);

  return (
    <article className="space-y-6">
      <div className="space-y-1">
        <Link href="/practice" className="text-xs text-[--color-muted] hover:text-[--color-foreground]">
          ← Back
        </Link>
        <div className="text-xs uppercase tracking-[0.2em] text-[--color-muted]">
          {languageName(story.targetLang)} · {story.level}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{story.title}</h1>
      </div>
      <StoryReader
        storyId={story.id}
        content={story.content}
        vocab={story.vocab ?? []}
        fromLang={story.targetLang}
        toLang={profile.nativeLang}
      />
    </article>
  );
}
