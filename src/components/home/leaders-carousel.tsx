"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";

const SLIDES = [
  {
    src: "/home/hamza-abdi.jpg",
    name: "Hamza Abdi Barre",
    caption: "Prime Minister of Somalia",
  },
  {
    src: "/home/sheikh-sharif.jpg",
    name: "Sheikh Sharif Sheikh Ahmed",
    caption: "Former President of Somalia",
  },
  {
    src: "/home/abdiqasim.jpg",
    name: "Abdiqasim Salad Hassan",
    caption: "Former President of Somalia",
  },
  {
    src: "/home/farmajo-hassan.jpg",
    name: "A Legacy of Leadership",
    caption: "Presidential transitions, preserved with dignity.",
  },
  {
    src: "/home/abwan-xadraawi.jpg",
    name: "Community Leadership",
    caption: "Voices that help shape the nation.",
  },
];

const AUTOPLAY_MS = 5500;

export function LeadersCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, []);

  // Keep `active` (for dots/buttons) in sync with whatever the user swiped to.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame: number;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!track) return;
        const index = Math.round(track.scrollLeft / track.clientWidth);
        setActive(Math.max(0, Math.min(SLIDES.length - 1, index)));
      });
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Gentle autoplay — pauses on hover/touch and respects reduced motion.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(() => {
      const next = (active + 1) % SLIDES.length;
      scrollToIndex(next);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [active, paused, reduceMotion, scrollToIndex]);

  return (
    <section className="bg-white py-20 dark:bg-offwhite sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel className="mx-auto justify-center">Featured Leaders</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            Leadership on AqoonsiPlus
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative mt-12">
        <div
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className="relative aspect-[4/3] w-full shrink-0 snap-start sm:aspect-[16/7]"
            >
              <Image
                src={slide.src}
                alt={slide.name}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 py-6 sm:px-12 sm:py-10">
                <p className="font-heading text-xl font-bold text-white sm:text-2xl">
                  {slide.name}
                </p>
                <p className="mt-1 text-sm text-white/75 sm:text-base">{slide.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          aria-label="Previous"
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition-transform hover:scale-105 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(SLIDES.length - 1, active + 1))}
          aria-label="Next"
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition-transform hover:scale-105 sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="mt-5 flex justify-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-teal" : "w-1.5 bg-mist hover:bg-slate/40"
              )}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
