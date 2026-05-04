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
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
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
                className="block text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium tracking-[-0.07em]"
                style={{ color: "#E1E0CC", lineHeight: 0.85 }}
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
              >
                Langlearn
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
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-end gap-5 pb-1 lg:pb-12 z-10">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="text-primary/70 text-xs sm:text-sm md:text-base max-w-[280px] lg:max-w-none"
              style={{ lineHeight: 1.2 }}
            >
              Practice real-world languages using AI with Langlearn — not only learn but understand key things.
            </motion.p>

            <motion.a
              href="/api/auth/login"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="inline-flex items-center self-start rounded-full bg-primary px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base font-medium text-black transition-colors hover:bg-yellow-400 whitespace-nowrap"
            >
              Start with HuggingFace
            </motion.a>
          </div>
        </div>
      </div>
    </main>
  );
}
