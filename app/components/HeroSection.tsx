"use client";

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
  return (
    <section className="h-screen p-4 md:p-6">
      <div className="relative h-full overflow-hidden rounded-2xl bg-black md:rounded-[2rem]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_URL}
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 sm:px-6 md:px-10 md:pb-10">
          <div className="grid grid-cols-12 items-end gap-5 md:gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="font-medium leading-[0.85] tracking-[0]">
                <WordsPullUp
                  text="DialogueDock"
                  className="text-[3.2rem] sm:text-[5rem] md:text-[6.8rem] lg:text-[8rem] xl:text-[9.25rem] 2xl:text-[10rem]"
                  suffix="*"
                  suffixClassName="absolute top-[0.65em] -right-[0.3em] text-[0.31em] leading-none"
                />
              </h1>
            </div>

            <div className="col-span-12 max-w-md pb-2 lg:col-span-4 lg:pb-5">
              <motion.p
                className="text-xs leading-[1.2] text-primary/70 sm:text-sm md:text-base"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              >
                Practicing languages using DialogueDock.
              </motion.p>

              <motion.a
                href="/api/auth/login"
                className="group mt-5 inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              >
                Start with Hugging Face
                <span className="grid h-9 w-9 place-items-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight size={18} className="text-primary" />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
