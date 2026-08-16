"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE, staggerContainer } from "@/lib/motion";

export function StaggerGrid({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 16,
  hoverLift = false,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  /** Lift on hover via Framer's transform, since a CSS hover:-translate-y-*
   *  class would be silently overridden by Framer's inline transform style. */
  hoverLift?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION.base, ease: EASE },
        },
      }}
      whileHover={
        hoverLift
          ? { y: -4, transition: { duration: DURATION.fast, ease: EASE } }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
