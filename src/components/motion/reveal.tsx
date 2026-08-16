"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  className,
  y = 20,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? undefined : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
