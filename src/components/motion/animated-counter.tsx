"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export function AnimatedCounter({
  value,
  duration = 1.4,
  suffix = "",
  formatter,
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  formatter?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, duration, reduceMotion]);

  const text = formatter ? formatter(display) : display.toLocaleString();

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}
