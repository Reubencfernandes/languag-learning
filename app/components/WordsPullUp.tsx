"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Props = {
  text: string;
  className?: string;
  delayOffset?: number;
};

export function WordsPullUp({ text, className, delayOffset = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className ?? ""}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-[0.18em] last:mr-0">
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
      ))}
    </span>
  );
}
