"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, FileText, Music, ExternalLink } from "lucide-react";
import { DURATION, EASE } from "@/lib/motion";

export type LightboxItem = {
  id: string;
  url: string | null;
  kind: "photo" | "video" | "audio" | "document";
  title: string | null;
  description: string | null;
};

export function MediaLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const open = index !== null;
  const item = open ? items[index] : null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/95 p-4 sm:p-8"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous"
                className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next"
                className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.div
            key={item.id}
            className="flex max-h-full w-full max-w-4xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: DURATION.base, ease: EASE }}
          >
            {item.kind === "photo" && item.url && (
              <div className="relative h-[65vh] w-full">
                <Image
                  src={item.url}
                  alt={item.title ?? ""}
                  fill
                  className="rounded-xl object-contain"
                  sizes="90vw"
                />
              </div>
            )}
            {item.kind === "video" && item.url && (
              <video
                src={item.url}
                controls
                autoPlay
                className="max-h-[65vh] w-full rounded-xl bg-black"
              />
            )}
            {item.kind === "audio" && (
              <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white/5 p-8">
                <Music className="h-12 w-12 text-teal" />
                {item.url && <audio src={item.url} controls autoPlay className="w-full" />}
              </div>
            )}
            {item.kind === "document" && (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/5 p-10">
                <FileText className="h-12 w-12 text-teal" />
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open document
                  </a>
                )}
              </div>
            )}

            {(item.title || item.description) && (
              <div className="max-w-lg text-center">
                {item.title && (
                  <p className="font-heading text-base font-semibold text-white">{item.title}</p>
                )}
                {item.description && (
                  <p className="mt-1 text-sm text-white/60">{item.description}</p>
                )}
              </div>
            )}
          </motion.div>

          {items.length > 1 && (
            <p className="absolute bottom-4 text-xs text-white/50">
              {index! + 1} / {items.length}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
