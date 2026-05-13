import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { OnboardingForm } from "./OnboardingForm";
import { Languages } from "lucide-react";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/");
  if (session.targetLang && session.level) redirect("/practice");

  return (
    <main className="min-h-screen bg-[#F8FBFF] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col justify-center">
        <div className="rounded-2xl border-3 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-[#0EA5A4] p-6 text-white sm:p-8 border-b-3 border-black">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <Languages size={32} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-xs font-black uppercase text-white/90 tracking-widest">
                  Welcome to PraxaLing
                </div>
                <h1 className="text-3xl font-black leading-tight text-white uppercase tracking-tight">Set up your course</h1>
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

