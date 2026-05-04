"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImagePlus, RotateCcw, Sparkles } from "lucide-react";

type AnalysisObject = {
  label: string;
  translation: string;
  box: [number, number, number, number];
  score: number;
};

type Analysis = {
  id: string;
  caption: string;
  objects: AnalysisObject[];
  sentences: Array<{ target: string; gloss: string }>;
  imageUrl?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function CameraClient() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      const res = await fetch("/api/vision/analyze", { method: "POST", body: form });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || j.error || "Analysis failed.");
        return;
      }
      const j = (await res.json()) as Analysis;
      setAnalysis(j);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) pick(f);
  }

  function clear() {
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

      {/* Upload zone */}
      {!previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
          style={{ borderColor: "rgba(225,224,204,0.15)" }}
        >
          <ImagePlus size={36} className="mx-auto mb-4" style={{ color: "rgba(225,224,204,0.35)" }} />
          <p className="text-sm font-medium text-[#E1E0CC]">Tap to upload or take a photo</p>
          <p className="mt-1 text-xs" style={{ color: "rgba(225,224,204,0.4)" }}>
            Gemma AI will identify objects and teach you vocabulary
          </p>
        </motion.div>
      )}

      {/* Image preview with overlays */}
      {previewUrl && imageSize && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
            >
              <Camera size={14} />
              New photo
            </button>
            <button
              onClick={clear}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors hover:border-primary/40"
              style={{ borderColor: "rgba(225,224,204,0.15)", color: "rgba(225,224,204,0.7)" }}
            >
              <RotateCcw size={14} />
              Clear
            </button>
          </div>

          <div className="relative inline-block overflow-hidden rounded-2xl border max-w-full" style={{ borderColor: "rgba(225,224,204,0.12)" }}>
            <img
              src={previewUrl}
              alt="Your photo"
              className="block max-h-[520px] w-auto max-w-full"
            />
            {/* Object bounding boxes — Gemma returns 0-1 normalized */}
            {analysis?.objects.map((obj, i) => {
              const [x1, y1, x2, y2] = obj.box;
              const isNormalized = x1 <= 1 && y1 <= 1 && x2 <= 1 && y2 <= 1;
              let left: string, top: string, width: string, height: string;

              if (isNormalized) {
                left = `${x1 * 100}%`;
                top = `${y1 * 100}%`;
                width = `${(x2 - x1) * 100}%`;
                height = `${(y2 - y1) * 100}%`;
              } else {
                const W = imageSize.w;
                const H = imageSize.h;
                left = `${(x1 / W) * 100}%`;
                top = `${(y1 / H) * 100}%`;
                width = `${((x2 - x1) / W) * 100}%`;
                height = `${((y2 - y1) / H) * 100}%`;
              }

              return (
                <div
                  key={i}
                  className="pointer-events-none absolute border-2 border-primary"
                  style={{ left, top, width, height }}
                >
                  <span className="absolute left-0 top-0 -translate-y-full rounded-md rounded-bl-none bg-primary px-1.5 py-0.5 text-[11px] font-medium text-black whitespace-nowrap">
                    {obj.translation}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 backdrop-blur-sm">
                <Sparkles size={24} className="text-primary animate-pulse" />
                <span className="text-sm text-[#E1E0CC]">Gemma is analysing…</span>
              </div>
            )}
          </div>

          {analysis?.caption && (
            <p className="text-sm italic" style={{ color: "rgba(225,224,204,0.55)" }}>
              {analysis.caption}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Results */}
      {analysis && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="grid gap-8 lg:grid-cols-2"
          >
            {/* Objects */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(225,224,204,0.5)" }}>
                Objects detected
              </h2>
              {analysis.objects.length > 0 ? (
                <ul className="space-y-2">
                  {analysis.objects.map((o, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                      className="flex items-center justify-between rounded-xl border px-4 py-3"
                      style={{ borderColor: "rgba(225,224,204,0.1)", background: "#101010" }}
                    >
                      <div>
                        <div className="text-base font-semibold text-[#E1E0CC]">{o.translation}</div>
                        <div className="text-xs" style={{ color: "rgba(225,224,204,0.4)" }}>{o.label}</div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "rgba(225,224,204,0.4)" }}>
                  No objects detected. Try a clearer photo.
                </p>
              )}
            </div>

            {/* Sentences */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(225,224,204,0.5)" }}>
                Practice sentences
              </h2>
              {analysis.sentences.length > 0 ? (
                <ul className="space-y-3">
                  {analysis.sentences.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                      className="rounded-xl border px-4 py-3"
                      style={{ borderColor: "rgba(225,224,204,0.1)", background: "#101010" }}
                    >
                      <div className="text-base text-[#E1E0CC]">{s.target}</div>
                      <div className="mt-1 text-xs" style={{ color: "rgba(225,224,204,0.45)" }}>{s.gloss}</div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "rgba(225,224,204,0.4)" }}>
                  No sentences generated. Retry the photo.
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
