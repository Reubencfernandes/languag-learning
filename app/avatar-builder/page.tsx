"use client";
import React, { useState } from "react";

const EYES = ["Awe.svg", "Driven.svg", "FACE.svg", "Hectic.svg", "Monster.svg"];
const CLOTHES = [
  "BODY.svg",
  "Gaming.svg",
  "Macbook.svg",
  "Paper.svg",
  "Shirt and Coat.svg",
  "Striped Pocket Tee.svg",
  "Thunder T-Shirt.svg",
];
const HEAD_WOMEN = ["Hijab.svg", "Long Bangs.svg", "Long Curly.svg"];
const HEAD_MEN = [
  "Bantu Knots.svg",
  "Flat Top Long.svg",
  "Mohawk 2.svg",
  "No Hair 1.svg",
  "Pomp.svg",
  "Short 5.svg",
  "Twists.svg",
];
const HEADS = [
  ...HEAD_MEN.map((h) => `head_men/${h}`),
  ...HEAD_WOMEN.map((h) => `head_women/${h}`),
];
const ACCESSORIES = ["Sunglasses.svg", "None"];

export default function AvatarBuilder() {
  const [activeHead, setActiveHead] = useState(HEADS[0]);
  const [activeClothes, setActiveClothes] = useState(CLOTHES[0]);
  const [activeEyes, setActiveEyes] = useState(EYES[0]);
  const [activeAcc, setActiveAcc] = useState(ACCESSORIES[0]);

  const [headConfig, setHeadConfig] = useState({ bottom: 52, left: 50, ml: -6, w: 60, h: 72 });
  const [eyesConfig, setEyesConfig] = useState({ top: 55, left: 55, w: 34 });
  const [accConfig, setAccConfig] = useState({ top: 55, left: 55, w: 40 });
  const [bodyConfig, setBodyConfig] = useState({ bottom: 0, w: 96 });

  return (
    <div className="min-h-screen bg-[#F8FBFF] p-6 text-[#3C3C3C] font-sans flex flex-col md:flex-row gap-10 items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-2xl font-black">Avatar Preview</h1>
        
        {/* Preview Container (scaled up for visibility) */}
        <div 
          className="duo-card relative shrink-0 flex items-end justify-center rounded-2xl"
          style={{ width: "160px", height: "260px", transform: "scale(2)", transformOrigin: "top" }}
        >
          {/* Clothes / Body */}
          <img
            src={`/clothes/${activeClothes}`}
            style={{
              position: "absolute",
              bottom: `${bodyConfig.bottom}px`,
              left: "50%",
              transform: "translateX(-50%)",
              width: `${bodyConfig.w}px`,
              maxWidth: "none",
            }}
            alt="clothes"
          />

          {/* Head Container */}
          <div
            style={{
              position: "absolute",
              bottom: `${headConfig.bottom}px`,
              left: `${headConfig.left}%`,
              transform: "translateX(-50%)",
              marginLeft: `${headConfig.ml}px`,
              width: `${headConfig.w}px`,
              height: `${headConfig.h}px`,
              zIndex: 10,
            }}
          >
            {/* Head Image */}
            <img
              src={`/${activeHead}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              alt="head"
            />

            {/* Eyes */}
            <img
              src={`/eyes/${activeEyes}`}
              style={{
                position: "absolute",
                top: `${eyesConfig.top}%`,
                left: `${eyesConfig.left}%`,
                transform: "translate(-50%, -50%)",
                width: `${eyesConfig.w}px`,
                objectFit: "contain",
              }}
              alt="eyes"
            />

            {/* Accessory */}
            {activeAcc !== "None" && (
              <img
                src={`/Accessories/${activeAcc}`}
                style={{
                  position: "absolute",
                  top: `${accConfig.top}%`,
                  left: `${accConfig.left}%`,
                  transform: "translate(-50%, -50%)",
                  width: `${accConfig.w}px`,
                  objectFit: "contain",
                }}
                alt="accessory"
              />
            )}
          </div>
        </div>
      </div>

      <div className="duo-card w-full max-w-xl p-6 space-y-8 overflow-y-auto max-h-[90vh]">
        
        {/* Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="duo-eyebrow block mb-1">Head</label>
            <select className="duo-input" value={activeHead} onChange={e => setActiveHead(e.target.value)}>
              {HEADS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="duo-eyebrow block mb-1">Clothes</label>
            <select className="duo-input" value={activeClothes} onChange={e => setActiveClothes(e.target.value)}>
              {CLOTHES.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="duo-eyebrow block mb-1">Eyes</label>
            <select className="duo-input" value={activeEyes} onChange={e => setActiveEyes(e.target.value)}>
              {EYES.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="duo-eyebrow block mb-1">Accessory</label>
            <select className="duo-input" value={activeAcc} onChange={e => setActiveAcc(e.target.value)}>
              {ACCESSORIES.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          
          <div className="duo-soft-panel p-4 space-y-4">
            <h3 className="font-black text-[#0B7C7B]">Head Configuration</h3>
            <Slider label="Bottom Offset (px)" value={headConfig.bottom} min={0} max={100} onChange={v => setHeadConfig({...headConfig, bottom: v})} />
            <Slider label="Left Position (%)" value={headConfig.left} min={0} max={100} onChange={v => setHeadConfig({...headConfig, left: v})} />
            <Slider label="Margin Left (px)" value={headConfig.ml} min={-50} max={50} onChange={v => setHeadConfig({...headConfig, ml: v})} />
            <Slider label="Width (px)" value={headConfig.w} min={20} max={150} onChange={v => setHeadConfig({...headConfig, w: v})} />
            <Slider label="Height (px)" value={headConfig.h} min={20} max={150} onChange={v => setHeadConfig({...headConfig, h: v})} />
          </div>

          <div className="duo-soft-panel p-4 space-y-4">
            <h3 className="font-black text-[#0B7C7B]">Eyes Configuration</h3>
            <Slider label="Top Position (%)" value={eyesConfig.top} min={0} max={100} onChange={v => setEyesConfig({...eyesConfig, top: v})} />
            <Slider label="Left Position (%)" value={eyesConfig.left} min={0} max={100} onChange={v => setEyesConfig({...eyesConfig, left: v})} />
            <Slider label="Width (px)" value={eyesConfig.w} min={10} max={100} onChange={v => setEyesConfig({...eyesConfig, w: v})} />
          </div>

          <div className="duo-soft-panel p-4 space-y-4">
            <h3 className="font-black text-[#7C3AED]">Accessory Configuration</h3>
            <Slider label="Top Position (%)" value={accConfig.top} min={0} max={100} onChange={v => setAccConfig({...accConfig, top: v})} />
            <Slider label="Left Position (%)" value={accConfig.left} min={0} max={100} onChange={v => setAccConfig({...accConfig, left: v})} />
            <Slider label="Width (px)" value={accConfig.w} min={10} max={100} onChange={v => setAccConfig({...accConfig, w: v})} />
          </div>
          
          <div className="duo-soft-panel p-4 space-y-4">
            <h3 className="font-black text-[#7C3AED]">Body Configuration</h3>
            <Slider label="Bottom Offset (px)" value={bodyConfig.bottom} min={-50} max={50} onChange={v => setBodyConfig({...bodyConfig, bottom: v})} />
            <Slider label="Width (px)" value={bodyConfig.w} min={20} max={200} onChange={v => setBodyConfig({...bodyConfig, w: v})} />
          </div>
          
        </div>

        {/* Output */}
        <div className="duo-soft-panel p-4">
          <h3 className="text-sm font-black mb-2 text-[#777777]">Copy these values back to the agent:</h3>
          <pre className="text-xs text-[#0B7C7B] whitespace-pre-wrap font-mono">
{`headConfig: ${JSON.stringify(headConfig)}
eyesConfig: ${JSON.stringify(eyesConfig)}
accConfig: ${JSON.stringify(accConfig)}
bodyConfig: ${JSON.stringify(bodyConfig)}`}
          </pre>
        </div>

      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string, value: number, min: number, max: number, onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-1/3 text-xs font-bold text-[#777777]">{label}</div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={e => onChange(Number(e.target.value))} 
        className="w-1/2"
      />
      <div className="w-1/6 text-xs text-right font-mono text-[#3C3C3C]">{value}</div>
    </div>
  );
}

