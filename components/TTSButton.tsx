"use client";

import { useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { ttsLang } from "@/lib/tts";

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    // Chrome loads voices asynchronously
    const onchange = () => {
      resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.removeEventListener("voiceschanged", onchange);
    };
    window.speechSynthesis.addEventListener("voiceschanged", onchange);
    // safety timeout in case the event never fires
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], bcp47: string): SpeechSynthesisVoice | null {
  const lang = bcp47.toLowerCase();
  const base = lang.split("-")[0];
  // exact match first, then prefix match
  return (
    voices.find((v) => v.lang.toLowerCase() === lang) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base)) ??
    null
  );
}

export function TTSButton({
  text,
  lang,
  className,
}: {
  text: string;
  lang: string;
  className?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  async function toggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // clear any leftover queue

    const bcp47 = ttsLang(lang);
    const voices = await getVoices();
    const voice = pickVoice(voices, bcp47);

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = bcp47;
    if (voice) utt.voice = voice;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    uttRef.current = utt;

    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={speaking ? "Stop speaking" : "Listen"}
      className={
        className ??
        `rounded-lg border-2 border-black p-1.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all ${
          speaking ? "bg-[#FF8080]" : "bg-[#FFD21E]"
        }`
      }
    >
      {speaking ? (
        <Square size={16} strokeWidth={3} className="fill-current" />
      ) : (
        <Volume2 size={16} strokeWidth={3} />
      )}
    </button>
  );
}
