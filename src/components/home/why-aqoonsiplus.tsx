"use client";

import {
  LayoutGrid,
  BadgeCheck,
  Share2,
  RefreshCcw,
  Archive,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { CinematicBackground } from "@/components/home/cinematic-background";
import { useTranslation } from "@/i18n/language-provider";

const REASON_ICONS = [
  { key: "allInOnePlace", icon: LayoutGrid },
  { key: "presentProfessionally", icon: BadgeCheck },
  { key: "easyToAccess", icon: Share2 },
  { key: "keepCurrent", icon: RefreshCcw },
  { key: "preserveJourney", icon: Archive },
] as const;

export function WhyAqoonsiPlus() {
  const { t } = useTranslation();

  const reasons = REASON_ICONS.map(({ key, icon }) => ({
    icon,
    title: t(`home.whyAqoonsiplus.reasons.${key}.title`),
    description: t(`home.whyAqoonsiplus.reasons.${key}.description`),
  }));

  return (
    <section className="relative overflow-hidden bg-navy">
      <CinematicBackground src="/home/sheikh-sharif.jpg" alt="" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel light className="mx-auto justify-center">
            {t("home.whyAqoonsiplus.label")}
          </SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            {t("home.whyAqoonsiplus.heading")}
          </h2>
        </Reveal>

        <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description }) => (
            <StaggerItem
              key={title}
              hoverLift
              className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-navy/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-teal">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-bold text-navy dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
