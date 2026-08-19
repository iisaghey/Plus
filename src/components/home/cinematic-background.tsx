"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Full-bleed section background: a low-opacity photo behind a navy gradient
 * overlay, with a slow one-time Ken Burns zoom and a gentle scroll parallax.
 * Purely decorative texture — never competes with foreground text/buttons.
 */
export function CinematicBackground({
  src,
  alt,
  overlay = "from-navy/92 via-navy/88 to-navy/95",
}: {
  src: string;
  alt: string;
  /** Tailwind gradient stop classes for the dark overlay. */
  overlay?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        style={reduceMotion ? undefined : { y }}
        className="absolute -inset-y-[8%] inset-x-0"
      >
        <div
          className={`h-full w-full opacity-[0.16] ${
            reduceMotion ? "" : "animate-ken-burns motion-reduce:animate-none"
          }`}
        >
          <Image src={src} alt={alt} fill priority={false} className="object-cover" />
        </div>
      </motion.div>
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
    </div>
  );
}
