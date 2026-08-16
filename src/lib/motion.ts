// Shared motion constants so every animated surface feels like one system.
// Keep durations short (200-600ms) and easing consistent per the "premium,
// subtle, fast" brief -- this is a trust/records platform, not a showcase.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.5,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
