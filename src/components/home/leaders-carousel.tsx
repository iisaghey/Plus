"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";

// Grouped by role, each group ordered most-recent-first. Somalia's
// transitional-era succession is genuinely contested depending on the
// source, so captions describe the role/era rather than asserting an
// exact ordinal (e.g. "9th President") we can't fully verify.
const SLIDES = [
  // Presidents, newest to oldest.
  {
    src: "/home/hassan-sheikh-mohamud.jpg",
    name: "Hassan Sheikh Mohamud",
    role: "Presidential",
    caption: "President of Somalia (2012–2017, 2022–present)",
  },
  {
    src: "/home/mohamed-abdullahi-farmaajo.jpg",
    name: "Mohamed Abdullahi Farmaajo",
    role: "Presidential",
    caption: "Former President of Somalia (2017–2022)",
  },
  {
    src: "/home/sheikh-sharif.jpg",
    name: "Sheikh Sharif Sheikh Ahmed",
    role: "Presidential",
    caption: "Former President of Somalia (2009–2012)",
  },
  {
    src: "/home/abdullahi-yusuf-ahmed.jpg",
    name: "Abdullahi Yusuf Ahmed",
    role: "Presidential",
    caption: "Former President of Somalia (2004–2008)",
  },
  {
    src: "/home/abdiqasim.jpg",
    name: "Abdiqasim Salad Hassan",
    role: "Presidential",
    caption: "Former President of Somalia (2000–2004)",
  },
  {
    src: "/home/maxamed-siyaad-bare.png",
    name: "Maxamed Siyaad Barre",
    role: "Presidential",
    caption: "Former President of Somalia (1969–1991)",
  },
  {
    src: "/home/aden-abdulle-osman-daar.jpg",
    name: "Aden Abdulle Osman Daar",
    role: "Presidential",
    caption: "First President of the Somali Republic (1960–1967)",
  },
  // Prime Ministers, newest to oldest.
  {
    src: "/home/hamza-abdi.jpg",
    name: "Hamza Abdi Barre",
    role: "Prime Minister",
    caption: "Prime Minister of Somalia (2022–present)",
  },
  {
    src: "/home/mohamed-hussein-roble.jpg",
    name: "Mohamed Hussein Roble",
    role: "Prime Minister",
    caption: "Former Prime Minister of Somalia (2020–2022)",
  },
  {
    src: "/home/hassan-ali-kheire.jpg",
    name: "Hassan Ali Kheire",
    role: "Prime Minister",
    caption: "Former Prime Minister of Somalia (2017–2020)",
  },
  {
    src: "/home/cabdiwali-sheikh-axmed.jpg",
    name: "Cabdiwali Sheikh Axmed",
    role: "Prime Minister",
    caption: "Former Prime Minister of Somalia (2014–2017)",
  },
  {
    src: "/home/abdullahi-issa-mohamud.jpg",
    name: "Abdullahi Issa Mohamud",
    role: "Prime Minister",
    caption: "First Prime Minister of Somalia (1956–1960)",
  },
  // Other national figures.
  {
    src: "/home/abwan-xadraawi.jpg",
    name: "Hadraawi",
    role: "Cultural Leader",
    caption: "Renowned Somali Poet & Wordsmith",
  },
  {
    src: "/home/abdalla-deerow-isxaaq.png",
    name: "Abdalla Deerow Isxaaq",
    role: "National Leader",
    caption: "Somali Political Leader",
  },
];

const AUTOPLAY_MS = 5500;

export function LeadersCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0); // continuous scrollLeft / slideWidth
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startScrollLeft: number; pointerId: number } | null>(null);
  const reduceMotion = useReducedMotion();

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, []);

  // Continuous scroll tracking drives both the settled `active` index (for
  // dots/autoplay) and a fractional `progress` value used for the per-slide
  // parallax offset while swiping.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame: number;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!track) return;
        const raw = track.scrollLeft / track.clientWidth;
        setProgress(raw);
        setActive(Math.max(0, Math.min(SLIDES.length - 1, Math.round(raw))));
      });
    }
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Gentle autoplay — pauses on hover/touch/drag and respects reduced motion.
  useEffect(() => {
    if (reduceMotion || paused || dragging) return;
    const id = setInterval(() => {
      const next = (active + 1) % SLIDES.length;
      scrollToIndex(next);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [active, paused, dragging, reduceMotion, scrollToIndex]);

  // Mouse drag-to-swipe. Touch already gets native momentum scrolling from
  // scroll-snap, so this only engages for mouse/pen pointers.
  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { startX: e.clientX, startScrollLeft: track.scrollLeft, pointerId: e.pointerId };
    track.setPointerCapture(e.pointerId);
    track.style.scrollSnapType = "none";
    setDragging(true);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;
    track.scrollLeft = drag.startScrollLeft - (e.clientX - drag.startX);
  }

  function endDrag() {
    const track = trackRef.current;
    if (!dragRef.current || !track) return;
    dragRef.current = null;
    track.style.scrollSnapType = "";
    const nearest = Math.max(0, Math.min(SLIDES.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    scrollToIndex(nearest);
    setDragging(false);
  }

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
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            "scrollbar-none flex snap-x snap-mandatory overflow-x-auto",
            dragging ? "cursor-grabbing select-none" : "cursor-grab scroll-smooth"
          )}
        >
          {SLIDES.map((slide, i) => {
            const offset = i - progress; // -1 = slide to the left of active, 0 = active, 1 = to the right
            const isActive = i === active;
            return (
              <div
                key={slide.src}
                className="relative aspect-[4/3] w-full shrink-0 snap-start overflow-hidden sm:aspect-[16/7]"
              >
                <div
                  className="absolute inset-0 transition-transform duration-100 ease-out"
                  style={
                    reduceMotion
                      ? undefined
                      : { transform: `scale(1.12) translateX(${offset * -6}%)` }
                  }
                >
                  <Image
                    src={slide.src}
                    alt={slide.name}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    draggable={false}
                    className={cn(
                      "object-cover transition-transform duration-[4000ms] ease-out",
                      !reduceMotion && isActive && "scale-110"
                    )}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 px-6 py-6 transition-all duration-700 ease-out sm:px-12 sm:py-10",
                    isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  )}
                >
                  <span className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    {slide.role}
                  </span>
                  <p className="mt-1 font-heading text-xl font-bold text-white sm:text-2xl">
                    {slide.name}
                  </p>
                  <p className="mt-1 text-sm text-white/75 sm:text-base">{slide.caption}</p>
                </div>
              </div>
            );
          })}
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
