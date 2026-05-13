import { getSession } from "@/lib/auth/session";
import { languageName, LEVEL_DESCRIPTIONS, type Level } from "@/lib/languages";
import { LogoutButton } from "./LogoutButton";
import { StreakUpdater } from "./StreakUpdater";
import { Edit2, Globe, Languages } from "lucide-react";
import { LearningLanguagesEditor } from "./LearningLanguagesEditor";

export default async function ProfilePage() {
  const session = (await getSession())!;
  const targetLangs = session.targetLangs ?? (session.targetLang ? [session.targetLang] : []);

  return (
    <section className="flex justify-center items-start min-h-[calc(100vh-8rem)] py-8 px-4">
      <StreakUpdater />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border-3 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Banner */}
        <div className="h-48 w-full bg-[#A855F7] border-b-3 border-black relative">
          <button className="absolute top-4 right-4 bg-white border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all text-black">
            <Edit2 size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="px-6 pb-12 lg:px-10">
          {/* Avatar */}
          <div className="relative flex justify-between items-end -mt-20 mb-8">
            {session.avatarUrl ? (
              <img 
                src={session.avatarUrl} 
                alt="Profile"
                className="w-40 h-40 rounded-2xl border-4 border-black object-cover bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)]" 
              />
            ) : (
              <div className="w-40 h-40 rounded-2xl border-4 border-black bg-white text-6xl flex items-center justify-center font-black text-[#A855F7] shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                {session.hfUsername?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-black text-black tracking-tight leading-none uppercase">{session.hfUsername}</h1>
                <p className="text-lg font-bold text-gray-700 mt-3">{session.email ?? "Language Learner"}</p>
                <div className="mt-4 inline-block rounded-xl border-3 border-black bg-[#FFD21E] px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  {session.level ? LEVEL_DESCRIPTIONS[session.level as Level] : "Level Not set"}
                </div>
              </div>
              
              <div className="pt-4">
                <LogoutButton className="bg-black text-white px-8 py-3 rounded-xl text-base font-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-widest flex items-center justify-center gap-2" />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-black">
                  <Globe size={18} strokeWidth={2.5} className="text-[#3B82F6]" />
                  <span className="text-sm font-black uppercase tracking-wider">Native language</span>
                </div>
                <div className="rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-black text-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  {session.nativeLang ? languageName(session.nativeLang) : "Not set"}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-black">
                  <Languages size={18} strokeWidth={2.5} className="text-[#FF6B6B]" />
                  <span className="text-sm font-black uppercase tracking-wider">Learning</span>
                </div>
                <LearningLanguagesEditor 
                  targetLangs={targetLangs} 
                  nativeLang={session.nativeLang ?? "en"} 
                  level={session.level ?? "A1"} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
