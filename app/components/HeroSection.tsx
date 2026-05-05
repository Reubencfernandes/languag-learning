"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <main className="h-screen p-4 md:p-6 bg-black">
      <div className="relative h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="http://d8j0ntlcm91z4.cloudfront.net/user_34DpnLwtmxkLgtVe8psPn1j2G8i/hf_20260505_151902_782a6426-d5ef-40eb-b482-d807701834c1.mp4"
        />

        {/* Noise overlay */}
        <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Hero content */}
        <div
          ref={ref}
          className="absolute bottom-0 left-0 right-0 grid grid-cols-12 gap-4 p-6 md:p-10 pb-10 md:pb-14"
        >
          {/* Giant heading — left 8 cols */}
          <div className="col-span-12 lg:col-span-8 flex items-end z-0">
            <div className="relative inline-block leading-[0.85] pointer-events-none">
              <motion.span
                className="block text-5xl sm:text-6xl md:text-8xl lg:text-[10vw] xl:text-[9vw] 2xl:text-[8vw] font-medium tracking-[-0.07em] whitespace-nowrap"
                style={{ color: "#E1E0CC", lineHeight: 0.85 }}
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
              >
                DialogueDock
                <sup
                  className="absolute"
                  style={{
                    color: "#E1E0CC",
                    top: "0.65em",
                    right: "-0.3em",
                    fontSize: "0.31em",
                    lineHeight: 1,
                  }}
                >
                  *
                </sup>
              </motion.span>
            </div>
          </div>

          {/* Right column — 4 cols */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-end gap-5 pb-1 lg:pb-2 z-10">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="text-primary/70 text-xs sm:text-sm md:text-base max-w-[280px] lg:max-w-none"
              style={{ lineHeight: 1.2 }}
            >
              Learn a new language through natural dialogues. Start thinking like a native speaker and stop translating.
            </motion.p>

            <motion.a
              href="/api/auth/login"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="inline-flex items-center self-start rounded-full bg-primary px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base font-medium text-black transition-colors hover:bg-orange-400 hover:text-white whitespace-nowrap"
            >
              Start with HuggingFace
            </motion.a>
          </div>
        </div>
      </div>
    </main>
  );
}
