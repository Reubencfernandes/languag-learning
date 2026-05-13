"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Level } from "@/lib/languages";
import type { FuriSegment } from "@/lib/types/dialogue";
import { LevelPicker } from "@/components/LevelPicker";
import { Furi } from "@/components/Furi";
import { TTSButton } from "@/components/TTSButton";
import { PhotoMarkers } from "./PhotoMarkers";
import { ImagePlus, Camera, RotateCcw, Wand2, AlertCircle } from "lucide-react";

type AnalysisObject = {
  label: string;
  translation: string;
  translationSegments?: FuriSegment[];
  romanized?: string;
  box: [number, number, number, number];
  score: number;
};

type Analysis = {
  id: string;
  caption: string;
  objects: AnalysisObject[];
  sentences: Array<{ target: string; targetSegments?: FuriSegment[]; gloss: string; romanized?: string }>;
  imageUrl?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function CameraClient({ defaultLevel, lang }: { defaultLevel: Level; lang: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<Level>(defaultLevel);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(file: File) {
    setError(null);
    setAnalysis(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;

    void upload(file);
  }

  async function upload(file: File) {
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("level", level);
      const res = await fetch("/api/vision/analyze", { method: "POST", body: form });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || j.error || "Analysis failed.");
        return;
      }
      setAnalysis((await res.json()) as Analysis);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) pick(file);
  }

  function clear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAnalysis(null);
    setImageSize(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onInputChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-5 border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <span className="text-sm font-black uppercase tracking-wide text-black">Sentences match level</span>
        <LevelPicker value={level} onChange={setLevel} size="sm" />
      </div>

      {!previewUrl && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          onClick={() => inputRef.current?.click()}
          className="group relative flex min-h-[360px] w-full flex-col items-center justify-center rounded-2xl border-3 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all p-8 text-center overflow-hidden cursor-pointer"
        >
          <div className="relative flex flex-col items-center z-10">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-3 border-black bg-[#FFD21E] shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform duration-300">
              <ImagePlus size={48} strokeWidth={2.5} className="text-black" />
            </div>
            <h3 className="text-2xl font-black text-black tracking-tight mb-2 uppercase">Drop anything to upload</h3>
            <p className="max-w-sm text-sm font-bold text-gray-700 leading-relaxed">
              Camera or gallery images automatically become interactive vocabulary cards.
            </p>
          </div>
        </motion.button>
      )}

      {previewUrl && imageSize && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button 
              onClick={() => inputRef.current?.click()} 
              className="flex items-center justify-center gap-2.5 rounded-xl bg-[#3B82F6] border-3 border-black text-white px-8 py-3 text-base font-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wider"
            >
              <Camera size={20} strokeWidth={2.5} />
              New photo
            </button>
            <button 
              onClick={clear} 
              className="flex items-center justify-center gap-2.5 rounded-xl bg-white border-3 border-black text-black px-8 py-3 text-base font-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wider"
            >
              <RotateCcw size={20} strokeWidth={2.5} />
              Clear
            </button>
          </div>

          <div className="relative inline-block max-w-full overflow-hidden rounded-2xl bg-white p-2 border-3 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <div className="relative inline-block max-w-full overflow-hidden rounded-xl bg-black">
              <img src={previewUrl} alt="Selected practice" className="block max-h-[560px] w-auto max-w-full object-contain" />

              {analysis ? <PhotoMarkers objects={analysis.objects} imageSize={imageSize} /> : null}

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm z-20">
                  <Wand2 size={48} strokeWidth={2.5} className="animate-bounce text-[#3B82F6]" />
                  <span className="text-lg font-black text-black uppercase tracking-wider">Analyzing image...</span>
                </div>
              )}
            </div>
          </div>

          {analysis?.caption ? (
            <div className="rounded-xl bg-[#FFD21E] border-3 border-black p-5 text-base font-black text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] italic">
              "{analysis.caption}"
            </div>
          ) : null}
        </div>
      )}

      {error ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 rounded-xl border-3 border-black bg-[#FF8080] p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        >
          <AlertCircle size={24} strokeWidth={2.5} className="text-black shrink-0" />
          <div>
            <p className="text-base font-black text-black uppercase tracking-tight">Analysis failed</p>
            <p className="mt-1 text-sm font-bold text-black/80">{error}</p>
          </div>
        </motion.div>
      ) : null}

      {analysis ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid gap-8 lg:grid-cols-2"
        >
          <ResultCard title="Objects detected">
            {analysis.objects.length > 0 ? (
              <ul className="space-y-4">
                {analysis.objects.map((o, i) => (
                  <li key={`${o.translation}-row-${i}`} className="rounded-xl bg-white border-2 border-black flex items-center justify-between gap-4 p-4 transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 min-w-0">
                      <TTSButton text={o.translation} lang={lang} />
                      <div>
                        <div className={`text-lg font-black text-black ${o.translationSegments ? "has-furi" : ""}`}>
                          <Furi text={o.translation} segments={o.translationSegments} />
                        </div>
                        {o.romanized ? <div className="text-xs font-bold text-[#3B82F6] mt-0.5">{o.romanized}</div> : null}
                        <div className="mt-1.5"><span className="text-[10px] font-black uppercase tracking-wider text-black bg-[#E6FBFA] border border-black rounded px-1.5 py-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]">{o.label}</span></div>
                      </div>
                    </div>
                    <div className="rounded-lg border-2 border-black bg-[#FFD21E] px-3 py-1 text-xs font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0">
                      {Math.round(o.score * 100)}%
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-bold text-gray-500">No objects detected. Try a clearer photo.</p>
            )}
          </ResultCard>

          <ResultCard title="Practice sentences">
            {analysis.sentences.length > 0 ? (
              <ul className="space-y-4">
                {analysis.sentences.map((s, i) => (
                  <li key={`${s.target}-${i}`} className="rounded-xl bg-white border-2 border-black p-4 transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`text-lg font-black text-black ${s.targetSegments ? "has-furi" : ""}`}>
                        <Furi text={s.target} segments={s.targetSegments} />
                      </div>
                      <TTSButton text={s.target} lang={lang} />
                    </div>
                    {s.romanized ? <div className="mt-1 text-sm font-bold italic text-[#3B82F6]">{s.romanized}</div> : null}
                    <div className="mt-3 text-xs font-black text-black bg-[#FFF7D6] p-2.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">{s.gloss}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-bold text-gray-500">No sentences generated. Retry the photo.</p>
            )}
          </ResultCard>
        </motion.div>
      ) : null}
    </div>
  );
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 border-3 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
      <h2 className="text-sm font-black uppercase tracking-wider text-black mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-[#FFD21E] border-2 border-black rounded-full" />
        {title}
      </h2>
      {children}
    </section>
  );
}

