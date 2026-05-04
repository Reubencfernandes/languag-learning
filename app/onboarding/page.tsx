import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.userId))
    .limit(1);

  if (existing) redirect("/practice");

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-10 bg-black min-h-screen">
      <div className="mb-8 space-y-2">
        <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(225,224,204,0.4)" }}>
          Welcome to Langlearn
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#E1E0CC]">Set up your profile</h1>
        <p style={{ color: "rgba(225,224,204,0.55)" }}>
          Pick your native and target languages, plus your current level.
        </p>
      </div>
      <OnboardingForm />
    </main>
  );
}
