"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/language-provider";

export type TimelineEntry = {
  id: string;
  year: string;
  title: string;
  subtitle?: string | null;
  location?: string | null;
  description?: string | null;
  current?: boolean;
  kind?: string;
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const { t } = useTranslation();

  if (entries.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate">
        {t("profilesPublic.timeline.empty")}
      </p>
    );
  }

  return (
    <ol className="relative ml-3 border-l-2 border-mist pl-8">
      {entries.map((entry, i) => (
        <motion.li
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.05 }}
          className="relative pb-10 last:pb-0"
        >
          <span
            className={cn(
              "absolute -left-[2.35rem] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-offwhite",
              entry.current ? "bg-emerald" : "bg-teal"
            )}
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-heading text-lg font-bold text-navy dark:text-white">
              {entry.year}
            </span>
            {entry.current && (
              <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald">
                {t("profilesPublic.timeline.current")}
              </span>
            )}
            {entry.kind && (
              <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy/60 dark:bg-white/5 dark:text-white/70">
                {entry.kind}
              </span>
            )}
          </div>
          <p className="mt-1 text-[15px] font-semibold text-navy dark:text-white">
            {entry.title}
          </p>
          {(entry.subtitle || entry.location) && (
            <p className="text-sm text-slate">
              {[entry.subtitle, entry.location].filter(Boolean).join(" · ")}
            </p>
          )}
          {entry.description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
              {entry.description}
            </p>
          )}
        </motion.li>
      ))}
    </ol>
  );
}
