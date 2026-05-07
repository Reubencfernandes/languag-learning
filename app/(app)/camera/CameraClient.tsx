"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Camera, ImagePlus, RotateCcw, Sparkles } from "lucide-react";
import type { Level } from "@/lib/languages";
import type { FuriSegment } from "@/lib/types/dialogue";
import { LevelPicker } from "@/components/LevelPicker";
import { Furi } from "@/components/Furi";

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

export function CameraClient({ defaultLevel }: { defaultLevel: Level }) {
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
    <div className="space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onInputChange}
        className="hidden"
      />

      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-[#E5E5E5]">
        <span className="text-xs font-black text-[#777777]">Sentences will match this CEFR level</span>
        <LevelPicker value={level} onChange={setLevel} size="sm" />
      </div>

      {!previewUrl && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          onClick={() => inputRef.current?.click()}
          className="duo-card duo-card-interactive flex min-h-[240px] w-full flex-col items-center justify-center border-dashed p-8 text-center"
        >
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#EDE9FE] text-[#7C3AED] shadow-[0_4px_0_#DDD6FE]">
            <ImagePlus size={32} />
          </div>
          <div className="mt-5 text-xl font-black text-[#3C3C3C]">Add a photo</div>
          <div className="mt-1 max-w-sm text-sm font-bold text-[#777777]">
            Camera or gallery images become vocabulary cards.
          </div>
        </motion.button>
      )}

      {previewUrl && imageSize && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button onClick={() => inputRef.current?.click()} className="btn-duo btn-duo-primary gap-2 text-sm">
              <Camera size={18} />
              New photo
            </button>
            <button onClick={clear} className="btn-duo btn-duo-white gap-2 text-sm">
              <RotateCcw size={18} />
              Clear
            </button>
          </div>

          <div className="duo-card inline-block max-w-full overflow-hidden p-2">
            <div className="relative inline-block max-w-full overflow-hidden rounded-2xl bg-[#101010]">
              <img src={previewUrl} alt="Selected practice" className="block max-h-[560px] w-auto max-w-full" />

              {analysis?.objects.map((obj, i) => {
                const [x1, y1, x2, y2] = obj.box;
                const isNormalized = x1 <= 1 && y1 <= 1 && x2 <= 1 && y2 <= 1;
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2;
                const left = isNormalized ? `${cx * 100}%` : `${(cx / imageSize.w) * 100}%`;
                const top = isNormalized ? `${cy * 100}%` : `${(cy / imageSize.h) * 100}%`;

                return (
                  <div
                    key={`${obj.translation}-${i}`}
                    className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                    style={{ left, top }}
                  >
                    <span className="absolute h-6 w-6 animate-ping rounded-full bg-[#0EA5A4]/60" />
                    <span className="relative h-3 w-3 rounded-full bg-[#0EA5A4] ring-4 ring-white/85" />
                    <div className="mt-2 rounded-2xl bg-white px-3 py-2 text-center shadow-[0_4px_0_rgba(0,0,0,0.18)] transition group-hover:-translate-y-1">
                      <div className={`whitespace-nowrap text-xs font-black text-[#3C3C3C] ${obj.translationSegments ? "has-furi" : ""}`}>
                        <Furi text={obj.translation} segments={obj.translationSegments} />
                      </div>
                      {obj.romanized ? (
                        <div className="whitespace-nowrap text-[10px] font-bold text-[#777777]">{obj.romanized}</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
                  <Sparkles size={28} className="animate-pulse text-[#0EA5A4]" />
                  <span className="text-sm font-black text-[#3C3C3C]">Analyzing...</span>
                </div>
              )}
            </div>
          </div>

          {analysis?.caption ? (
            <div className="duo-card p-4 text-sm font-bold italic text-[#777777]">{analysis.caption}</div>
          ) : null}
        </div>
      )}

      {error ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-2xl border-2 border-[#FECDD3] bg-[#FFE4E6] px-4 py-3"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#BE123C]" />
          <div>
            <p className="text-sm font-black text-[#BE123C]">Analysis failed</p>
            <p className="mt-0.5 text-xs font-bold text-[#A33434]">{error}</p>
          </div>
        </motion.div>
      ) : null}

      {analysis ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid gap-5 lg:grid-cols-2"
        >
          <ResultCard title="Objects detected">
            {analysis.objects.length > 0 ? (
              <ul className="space-y-3">
                {analysis.objects.map((o, i) => (
                  <li key={`${o.translation}-row-${i}`} className="duo-soft-panel flex items-center justify-between gap-3 p-4">
                    <div>
                      <div className={`text-base font-black text-[#3C3C3C] ${o.translationSegments ? "has-furi" : ""}`}>
                        <Furi text={o.translation} segments={o.translationSegments} />
                      </div>
                      {o.romanized ? <div className="text-xs font-bold text-[#7C3AED]">{o.romanized}</div> : null}
                      <div className="text-xs font-bold text-[#777777]">{o.label}</div>
                    </div>
                    <div className="rounded-full bg-[#CCFBF1] px-3 py-1 text-xs font-black text-[#0B7C7B]">
                      {Math.round(o.score * 100)}%
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-bold text-[#777777]">No objects detected. Try a clearer photo.</p>
            )}
          </ResultCard>

          <ResultCard title="Practice sentences">
            {analysis.sentences.length > 0 ? (
              <ul className="space-y-3">
                {analysis.sentences.map((s, i) => (
                  <li key={`${s.target}-${i}`} className="duo-soft-panel p-4">
                    <div className={`text-base font-black text-[#3C3C3C] ${s.targetSegments ? "has-furi" : ""}`}>
                      <Furi text={s.target} segments={s.targetSegments} />
                    </div>
                    {s.romanized ? <div className="mt-1 text-sm font-bold italic text-[#7C3AED]">{s.romanized}</div> : null}
                    <div className="mt-1 text-xs font-bold text-[#777777]">{s.gloss}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-bold text-[#777777]">No sentences generated. Retry the photo.</p>
            )}
          </ResultCard>
        </motion.div>
      ) : null}
    </div>
  );
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="duo-card p-5">
      <h2 className="duo-eyebrow mb-4">{title}</h2>
      {children}
    </section>
  );
}

