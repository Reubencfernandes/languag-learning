"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { languageName, LANGUAGES } from "@/lib/languages";
import { X, Plus } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

export function LearningLanguagesEditor({
  targetLangs,
  nativeLang,
  level,
}: {
  targetLangs: string[];
  nativeLang: string;
  level: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);

  function updateLangs(newList: string[]) {
    if (isPending) return;
    startTransition(async () => {
      try {
        await fetch("/api/me/profile", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ 
            nativeLang, 
            targetLang: newList[0] || "en", 
            targetLangs: newList, 
            level 
          }),
        });
        router.refresh();
      } finally {
        setIsAdding(false);
      }
    });
  }

  const availableLangs = LANGUAGES.filter(
    (l) => l.code !== nativeLang && !targetLangs.includes(l.code)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {targetLangs.map((lang) => (
          <div 
            key={lang}
            className="group relative flex items-center gap-2 rounded-xl border-2 border-black bg-[#FFD21E] px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          >
            {languageName(lang)}
            <button
              onClick={() => updateLangs(targetLangs.filter(l => l !== lang))}
              disabled={isPending || targetLangs.length <= 1}
              className="ml-1 p-0.5 rounded-md hover:bg-black/10 transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        ))}
        
        <div className="relative">
          <button
            onClick={() => setIsAdding(!isAdding)}
            disabled={isPending}
            className="flex items-center justify-center h-10 w-10 rounded-xl border-2 border-black bg-white text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            <Plus size={20} strokeWidth={3} className={`transition-transform duration-200 ${isAdding ? "rotate-45" : ""}`} />
          </button>

          {isAdding && (
            <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] z-50 p-1">
              {availableLangs.length > 0 ? (
                availableLangs.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => updateLangs([...targetLangs, lang.code])}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-bold text-black hover:bg-[#F3F4F6] rounded-lg transition-colors text-left"
                  >
                    <ReactCountryFlag countryCode={lang.flag} svg style={{ width: "1.1rem", height: "1.1rem" }} />
                    <span>{lang.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs font-bold text-gray-500 italic">No more languages</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isPending && (
        <div className="text-[10px] font-black uppercase tracking-widest text-[#0EA5A4] animate-pulse">
          Updating languages...
        </div>
      )}
    </div>
  );
}
