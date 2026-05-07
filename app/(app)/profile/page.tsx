import { Flame, Languages, Trophy, UserRound } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { languageName, LEVEL_DESCRIPTIONS, type Level } from "@/lib/languages";
import { LogoutButton } from "./LogoutButton";

export default async function ProfilePage() {
  const session = (await getSession())!;

  return (
    <section className="space-y-6">
      <div className="duo-card overflow-hidden">
        <div className="bg-[#7C3AED] p-5 text-white sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {session.avatarUrl ? (
                <img
                  src={session.avatarUrl}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-3xl border-4 border-white/60 object-cover shadow-[0_4px_0_rgba(0,0,0,0.12)]"
                />
              ) : (
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-white text-3xl font-black text-[#7C3AED] shadow-[0_4px_0_rgba(0,0,0,0.12)]">
                  {session.hfUsername?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-black uppercase text-white/75">Profile</div>
                <h1 className="truncate text-3xl font-black leading-tight">{session.hfUsername}</h1>
                <div className="truncate text-sm font-bold text-white/80">{session.email ?? "no email"}</div>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
          <Stat
            icon={<Languages size={20} />}
            label="I speak"
            value={session.nativeLang ? languageName(session.nativeLang) : "Not set"}
            tone="blue"
          />
          <Stat
            icon={<UserRound size={20} />}
            label="Learning"
            value={session.targetLang ? languageName(session.targetLang) : "Not set"}
            tone="green"
          />
          <Stat
            icon={<Trophy size={20} />}
            label="Level"
            value={
              session.level
                ? `${session.level} / ${LEVEL_DESCRIPTIONS[session.level as Level]}`
                : "Not set"
            }
            tone="yellow"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuestCard icon={<Flame size={22} />} title="Daily streak" value="1 day" progress={42} />
        <QuestCard icon={<Trophy size={22} />} title="Practice goal" value="270 XP" progress={68} />
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "blue" | "green" | "yellow";
}) {
  const tones = {
    blue: "bg-[#EDE9FE] text-[#7C3AED]",
    green: "bg-[#CCFBF1] text-[#0B7C7B]",
    yellow: "bg-[#FEF3C7] text-[#92400E]",
  };

  return (
    <div className="duo-soft-panel flex gap-3 p-4">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs font-black uppercase text-[#777777]">{label}</div>
        <div className="mt-1 text-base font-black leading-snug text-[#3C3C3C]">{value}</div>
      </div>
    </div>
  );
}

function QuestCard({
  icon,
  title,
  value,
  progress,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  progress: number;
}) {
  return (
    <div className="duo-card p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#CCFBF1] text-[#0B7C7B]">{icon}</div>
        <div>
          <div className="text-xs font-black uppercase text-[#777777]">{title}</div>
          <div className="text-xl font-black text-[#3C3C3C]">{value}</div>
        </div>
      </div>
      <div className="duo-progress mt-4">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

