"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  text: string;
  className?: string;
  delayOffset?: number;
  suffix?: ReactNode;
  suffixClassName?: string;
};

export function WordsPullUp({ text, className, delayOffset = 0, suffix, suffixClassName }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className ?? ""}`}>
      {words.map((word, i) => (
        <span key={i} className="relative mr-[0.18em] inline-block last:mr-0">
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: delayOffset + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {suffix && i === words.length - 1 ? (
            <motion.span
              className={suffixClassName}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: delayOffset + i * 0.08 + 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {suffix}
            </motion.span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

