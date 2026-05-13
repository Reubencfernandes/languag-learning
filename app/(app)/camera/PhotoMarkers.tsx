"use client";

import { useState } from "react";
import type { FuriSegment } from "@/lib/types/dialogue";
import { Furi } from "@/components/Furi";

type MarkerObject = {
  label: string;
  translation: string;
  translationSegments?: FuriSegment[];
  romanized?: string;
  box: [number, number, number, number];
};

export function PhotoMarkers({
  objects,
  imageSize,
}: {
  objects: MarkerObject[];
  imageSize: { w: number; h: number };
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      {objects.map((obj, i) => {
        const [x1, y1, x2, y2] = obj.box;
        const isNormalized = x1 <= 1 && y1 <= 1 && x2 <= 1 && y2 <= 1;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const left = isNormalized ? `${cx * 100}%` : `${(cx / imageSize.w) * 100}%`;
        const top = isNormalized ? `${cy * 100}%` : `${(cy / imageSize.h) * 100}%`;

        const isSelected = selected === i;
        const isDimmed = selected !== null && !isSelected;
        const wrapperOpacity = isDimmed ? "opacity-30" : "opacity-100";
        const wrapperZ = isSelected ? "z-20" : "z-10";

        return (
          <button
            type="button"
            key={`${obj.translation}-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(isSelected ? null : i);
            }}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-opacity duration-200 ${wrapperOpacity} ${wrapperZ}`}
            style={{ left, top }}
          >
            <span
              className={`relative rounded-full border-2 border-black bg-[#FFD21E] transition-all duration-200 ${
                isSelected ? "h-5 w-5 bg-[#0EA5A4] shadow-[2px_2px_0px_rgba(0,0,0,1)]" : "h-4 w-4"
              }`}
            />
            <div
              className={`mt-2 rounded-xl border-2 border-black bg-white px-3 py-1.5 text-center shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
                isSelected ? "scale-110 shadow-[5px_5px_0px_rgba(0,0,0,1)] bg-[#FFD21E]" : ""
              }`}
            >
              <div
                className={`whitespace-nowrap font-black text-black ${
                  isSelected ? "text-sm" : "text-xs"
                } ${obj.translationSegments ? "has-furi" : ""}`}
              >
                <Furi text={obj.translation} segments={obj.translationSegments} />
              </div>
              {obj.romanized ? (
                <div
                  className={`whitespace-nowrap font-bold text-gray-700 ${
                    isSelected ? "text-xs" : "text-[10px]"
                  }`}
                >
                  {obj.romanized}
                </div>
              ) : null}
            </div>
          </button>
        );
      })}
    </>
  );
}
