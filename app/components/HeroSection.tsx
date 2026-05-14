"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WordsPullUp } from "./WordsPullUp";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_34DpnLwtmxkLgtVe8psPn1j2G8i/hf_20260505_151902_782a6426-d5ef-40eb-b482-d807701834c1.mp4";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  return (
    <main className="overflow-hidden bg-black" style={{ color: "#E1E0CC" }}>
      <Hero />
    </main>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <section className="h-screen p-4 md:p-6">
      <div className="relative h-full overflow-hidden rounded-2xl bg-black md:rounded-[2rem]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_URL}
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 sm:px-6 md:px-10 md:pb-10">
          <div className="grid grid-cols-12 items-end gap-5 md:gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="font-medium leading-[0.85] tracking-[0] pb-[0.15em]">
                <WordsPullUp
                  text="PraxaLing"
                  className="text-[3.2rem] sm:text-[5rem] md:text-[6.8rem] lg:text-[8rem] xl:text-[9.25rem] 2xl:text-[10rem]"
                  suffix="*"
                  suffixClassName="absolute top-[0.65em] -right-[0.3em] text-[0.31em] leading-none"
                />
              </h1>
            </div>

            <div className="col-span-12 max-w-md pb-2 lg:col-span-4 lg:pb-5">
              <motion.p
                className="text-xs leading-[1.3] text-white font-medium drop-shadow sm:text-sm md:text-base"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              >
                Practicing languages using PraxaLing.
              </motion.p>

              <motion.a
                href="/api/auth/login"
                target="_top"
                rel="noopener"
                className="group mt-5 inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-bold text-black transition-all duration-300 hover:gap-4 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] sm:text-base"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">🤗</span>
                  Start with Hugging Face
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight size={18} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
