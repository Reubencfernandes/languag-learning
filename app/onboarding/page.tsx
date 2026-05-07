import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/");
  if (session.targetLang && session.level) redirect("/practice");

  return (
    <main className="min-h-screen bg-[#F8FBFF] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col justify-center">
        <div className="duo-card overflow-hidden">
          <div className="bg-[#0EA5A4] p-6 text-white sm:p-8">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#0B7C7B] shadow-[0_4px_0_rgba(0,0,0,0.12)]">
                <Sparkles size={28} />
              </div>
              <div>
                <div className="text-xs font-black uppercase text-white/80">
                  Welcome to DialogueDock
                </div>
                <h1 className="text-3xl font-black leading-tight">Set up your course</h1>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-8">
            <OnboardingForm />
          </div>
        </div>
      </div>
    </main>
  );
}

