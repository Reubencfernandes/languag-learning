import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users, profiles } from "@/lib/db/schema";
import { languageName, LEVEL_DESCRIPTIONS, type Level } from "@/lib/languages";
import { LogoutButton } from "./LogoutButton";

export default async function ProfilePage() {
  const session = (await getSession())!;
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.userId)).limit(1);

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-5">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full" />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-black"
            style={{ background: "#DEDBC8" }}
          >
            {user?.hfUsername?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#E1E0CC]">{user?.hfUsername}</h1>
          <div className="text-sm" style={{ color: "rgba(225,224,204,0.5)" }}>{user?.email ?? "no email"}</div>
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat label="I speak" value={languageName(profile.nativeLang)} />
        <Stat label="I'm learning" value={languageName(profile.targetLang)} />
        <Stat label="Level" value={`${profile.level} — ${LEVEL_DESCRIPTIONS[profile.level as Level]}`} />
      </dl>

      <LogoutButton />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "rgba(225,224,204,0.1)", background: "#101010" }}>
      <div className="text-xs uppercase tracking-[0.15em]" style={{ color: "rgba(225,224,204,0.4)" }}>{label}</div>
      <div className="mt-1 text-base font-medium text-[#E1E0CC]">{value}</div>
    </div>
  );
}
