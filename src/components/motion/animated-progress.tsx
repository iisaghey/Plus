"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

export function AnimatedProgress({
  value,
  className = "h-full rounded-full bg-teal",
  trackClassName = "h-2 w-full overflow-hidden rounded-full bg-mist",
}: {
  value: number;
  className?: string;
  trackClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={trackClassName}>
      <motion.div
        className={className}
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: DURATION.slow * 2, ease: EASE }
        }
      />
    </div>
  );
}
