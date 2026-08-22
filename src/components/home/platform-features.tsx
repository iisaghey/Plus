"use client";

import {
  IdCard,
  User,
  BookOpenText,
  GraduationCap,
  GitBranch,
  Landmark,
  CalendarCheck,
  Plane,
  Mic,
  Images,
  FileText,
  Trophy,
  Phone,
  Share2,
  ShieldCheck,
  QrCode,
  Link2,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { useTranslation } from "@/i18n/language-provider";

const FEATURE_ICONS = [
  { key: "digitalProfile", icon: IdCard },
  { key: "personalInfo", icon: User },
  { key: "biography", icon: BookOpenText },
  { key: "education", icon: GraduationCap },
  { key: "careerJourney", icon: GitBranch },
  { key: "governmentPositions", icon: Landmark },
  { key: "officialActivities", icon: CalendarCheck },
  { key: "officialTravels", icon: Plane },
  { key: "speeches", icon: Mic },
  { key: "media", icon: Images },
  { key: "documents", icon: FileText },
  { key: "achievements", icon: Trophy },
  { key: "contact", icon: Phone },
  { key: "socialMedia", icon: Share2 },
  { key: "verifiedProfile", icon: ShieldCheck },
  { key: "qrCode", icon: QrCode },
  { key: "profileLink", icon: Link2 },
] as const;

export function PlatformFeatures() {
  const { t } = useTranslation();

  const features = FEATURE_ICONS.map(({ key, icon }) => ({
    icon,
    title: t(`home.platformFeatures.features.${key}`),
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel className="mx-auto justify-center">
          {t("home.platformFeatures.label")}
        </SectionLabel>
        <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
          {t("home.platformFeatures.heading")}
        </h2>
        <p className="mt-3 text-slate">{t("home.platformFeatures.description")}</p>
      </Reveal>

      <StaggerGrid
        stagger={0.035}
        className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {features.map(({ icon: Icon, title }, i) => (
          <StaggerItem
            key={title}
            className="group flex items-start gap-3 rounded-2xl border border-mist p-4 transition-colors hover:border-teal/30 hover:bg-offwhite"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white transition-colors group-hover:bg-teal">
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div>
              <span className="font-accent text-[10px] font-semibold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold leading-snug text-navy dark:text-white">
                {title}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
