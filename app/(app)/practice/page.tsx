import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { dialogues, profiles, stories, storyReads } from "@/lib/db/schema";
import { languageName } from "@/lib/languages";
import { GenerateStoryButton } from "./GenerateStoryButton";
import { GenerateDialogueButton } from "./GenerateDialogueButton";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = (await getSession())!;
  const { tab } = await searchParams;
  const activeTab = tab === "stories" ? "stories" : "dialogues";

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);

  const [dialogueRows, storyRows] = await Promise.all([
    db
      .select({ id: dialogues.id, title: dialogues.title, scenario: dialogues.scenario, createdAt: dialogues.createdAt })
      .from(dialogues)
      .where(and(eq(dialogues.targetLang, profile.targetLang), eq(dialogues.level, profile.level)))
      .orderBy(desc(dialogues.createdAt))
      .limit(50),
    db
      .select({ id: stories.id, title: stories.title, createdAt: stories.createdAt })
      .from(stories)
      .where(and(eq(stories.targetLang, profile.targetLang), eq(stories.level, profile.level)))
      .orderBy(desc(stories.createdAt))
      .limit(50),
  ]);

  const reads =
    storyRows.length > 0
      ? await db
          .select({ storyId: storyReads.storyId })
          .from(storyReads)
          .where(eq(storyReads.userId, session.userId))
      : [];
  const readSet = new Set(reads.map((r) => r.storyId));

  return (
    <section className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(225,224,204,0.5)" }}>
          {languageName(profile.targetLang)} · {profile.level}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#E1E0CC]">Practice</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-full border border-white/10 bg-card p-1 w-fit">
        <Link
          href="/practice"
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            activeTab === "dialogues"
              ? "bg-primary text-black"
              : "text-[rgba(225,224,204,0.6)] hover:text-[#E1E0CC]"
          }`}
        >
          Dialogues
        </Link>
        <Link
          href="/practice?tab=stories"
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            activeTab === "stories"
              ? "bg-primary text-black"
              : "text-[rgba(225,224,204,0.6)] hover:text-[#E1E0CC]"
          }`}
        >
          Stories
        </Link>
      </div>

      {activeTab === "dialogues" && (
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <p className="text-sm" style={{ color: "rgba(225,224,204,0.6)" }}>
              Real-world interactive scenarios — pick your responses and learn naturally.
            </p>
            <GenerateDialogueButton />
          </div>
          {dialogueRows.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed p-10 text-center text-sm"
              style={{ borderColor: "rgba(225,224,204,0.12)", color: "rgba(225,224,204,0.5)" }}
            >
              No dialogues yet. Generate one to get started.
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {dialogueRows.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/practice/dialogues/${d.id}`}
                    className="group flex h-full flex-col justify-between rounded-2xl border p-5 transition-colors hover:border-primary/40"
                    style={{ borderColor: "rgba(225,224,204,0.12)", background: "#101010" }}
                  >
                    <div className="space-y-1">
                      <div className="text-base font-semibold leading-snug text-[#E1E0CC]">{d.title}</div>
                      <div className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(225,224,204,0.5)" }}>
                        {d.scenario}
                      </div>
                    </div>
                    <div className="mt-6 text-xs transition-colors group-hover:text-primary" style={{ color: "rgba(225,224,204,0.4)" }}>
                      Start →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "stories" && (
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <p className="text-sm" style={{ color: "rgba(225,224,204,0.6)" }}>
              Tap any word in a story to see its translation. Quiz yourself at the end.
            </p>
            <GenerateStoryButton />
          </div>
          {storyRows.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed p-10 text-center text-sm"
              style={{ borderColor: "rgba(225,224,204,0.12)", color: "rgba(225,224,204,0.5)" }}
            >
              No stories yet at this level. Generate one to get started.
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {storyRows.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/practice/${s.id}`}
                    className="group flex h-full flex-col justify-between rounded-2xl border p-5 transition-colors hover:border-primary/40"
                    style={{ borderColor: "rgba(225,224,204,0.12)", background: "#101010" }}
                  >
                    <div className="space-y-1">
                      <div className="text-base font-semibold leading-snug text-[#E1E0CC]">{s.title}</div>
                      <div className="text-xs" style={{ color: "rgba(225,224,204,0.4)" }}>
                        {readSet.has(s.id) ? "Read" : "Unread"}
                      </div>
                    </div>
                    <div className="mt-6 text-xs transition-colors group-hover:text-primary" style={{ color: "rgba(225,224,204,0.4)" }}>
                      Open →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
