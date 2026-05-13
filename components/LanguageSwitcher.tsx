"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { LANGUAGES } from "@/lib/languages";
import { Plus } from "lucide-react";

export function LanguageSwitcher({
  targetLangs,
  currentLang,
  nativeLang,
  level,
}: {
  targetLangs: string[];
  currentLang: string;
  nativeLang: string;
  level: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingLang, setPendingLang] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  function updateProfile(newTargetLangs: string[], switchTo: string) {
    if (isPending) return;
    setPendingLang(switchTo);
    startTransition(async () => {
      try {
        await fetch("/api/me/profile", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ nativeLang, targetLang: switchTo, targetLangs: newTargetLangs, level }),
        });
        router.refresh();
      } finally {
        setPendingLang(null);
        setIsAdding(false);
      }
    });
  }

  const availableLangs = LANGUAGES.filter((l) => l.code !== nativeLang && !targetLangs.includes(l.code));

  return (
    <div className="flex flex-wrap items-center gap-2.5 mt-4">
      {targetLangs.map((lang) => {
        const language = LANGUAGES.find((l) => l.code === lang);
        if (!language) return null;
        const isActive = lang === (pendingLang ?? currentLang);
        const isCurrentlySwitching = pendingLang === lang;

        return (
          <button
            key={lang}
            onClick={() => updateProfile(targetLangs, lang)}
            disabled={isPending}
            className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 border-black text-sm font-black transition-all duration-200 ${
              isActive
                ? "bg-[#FFD21E] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]"
                : "bg-white text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
            } ${isPending && !isCurrentlySwitching ? "pointer-events-none" : ""}`}
          >
            {isCurrentlySwitching ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <ReactCountryFlag 
                countryCode={language.flag} 
                svg 
                style={{ width: "1.25rem", height: "1.25rem" }} 
                className="transition-transform duration-200 group-hover:scale-110"
              />
            )}
            <span>{language.name}</span>
          </button>
        );
      })}

      <div className="relative">
        <button
          onClick={() => setIsAdding(!isAdding)}
          disabled={isPending}
          className="flex items-center justify-center h-9 w-9 rounded-xl border-2 border-black bg-white text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
        >
          <Plus size={18} strokeWidth={2.5} className={`transition-transform duration-200 ${isAdding ? "rotate-45" : ""}`} />
        </button>

        {isAdding && (
          <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] z-50 p-1">
            {availableLangs.length > 0 ? (
              availableLangs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => updateProfile([...targetLangs, lang.code], lang.code)}
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
  );
}
