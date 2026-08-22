import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  ShieldCheck,
  ArrowRight,
  Send,
  ClipboardList,
  LayoutGrid,
  Rocket,
  RefreshCcw,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { LinkButton } from "@/components/ui/button";
import { OurValues } from "@/components/home/our-values";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

const HOW_IT_WORKS_META = [
  { key: "apply", step: "01", icon: Send },
  { key: "collect", step: "02", icon: ClipboardList },
  { key: "build", step: "03", icon: LayoutGrid },
  { key: "review", step: "04", icon: ShieldCheck },
  { key: "launch", step: "05", icon: Rocket },
  { key: "update", step: "06", icon: RefreshCcw },
] as const;

const VERIFICATION_STEPS_META = [
  { key: "identity", step: "01" },
  { key: "information", step: "02" },
  { key: "profile", step: "03" },
] as const;

const TEAM = [
  {
    name: "Mohamedqadar Dahir Abdi",
    role: "Chief Executive Officer",
    company: "AqoonsiPlus Platform",
    photo: "/team-mohamedqadar.jpg",
  },
  {
    name: "Issa Abud Hussein",
    role: "HR & Administration Manager",
    company: "AqoonsiPlus Platform",
    photo: "/team-issa.jpg",
  },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about AqoonsiPlus's mission, vision, values, and how profile verification works.",
};

export default async function AboutPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const about = t.publicPages.about;

  return (
    <div>
      <section className="bg-navy">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <SectionLabel light className="mx-auto justify-center">
            {about.sectionLabel}
          </SectionLabel>
          <h1 className="mt-4 text-balance font-heading text-3xl font-bold text-white sm:text-4xl">
            {about.heading}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance leading-relaxed text-white/70">
            {about.description}
          </p>
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
            {about.badges.map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-accent text-xs font-semibold uppercase tracking-widest text-sky backdrop-blur-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <StaggerGrid className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <StaggerItem className="rounded-2xl border border-mist p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-navy dark:text-white">
              {about.missionTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-slate">{about.missionBody}</p>
          </StaggerItem>
          <StaggerItem className="rounded-2xl border border-mist p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-navy dark:text-white">
              {about.visionTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-slate">{about.visionBody}</p>
          </StaggerItem>
        </StaggerGrid>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel className="mx-auto justify-center">
            {about.howItWorksLabel}
          </SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            {about.howItWorksHeading}
          </h2>
        </Reveal>

        <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS_META.map(({ key, step, icon: Icon }) => {
            const { label, title, description } = about.steps[key];
            return (
              <StaggerItem
                key={step}
                hoverLift
                className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-teal">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-heading text-2xl font-bold text-gold">
                    {step}
                  </span>
                </div>
                <p className="mt-4 font-accent text-[11px] font-semibold uppercase tracking-widest text-slate">
                  {label}
                </p>
                <h3 className="mt-1 font-heading text-base font-bold text-navy dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {description}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </section>

      <section className="bg-offwhite">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <SectionLabel className="mx-auto justify-center">
              {about.verificationLabel}
            </SectionLabel>
            <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white">
              {about.verificationHeading}
            </h2>
          </Reveal>

          <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {VERIFICATION_STEPS_META.map(({ key, step }) => {
              const { title, description } = about.verificationSteps[key];
              return (
                <StaggerItem
                  key={step}
                  className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6"
                >
                  <span className="font-heading text-2xl font-bold text-gold">
                    {step}
                  </span>
                  <h3 className="mt-2 font-heading text-base font-bold text-navy dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {description}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          <div className="mt-8 text-center">
            <LinkButton href="/verification" variant="outline" size="md">
              <ShieldCheck className="h-4 w-4" />
              {about.learnMoreVerification}
            </LinkButton>
          </div>
        </div>
      </section>

      <OurValues />

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl font-bold text-navy dark:text-white">
            {about.ourTeam}
          </h2>
        </Reveal>

        <StaggerGrid className="mt-12 flex flex-wrap justify-center gap-6">
          {TEAM.map((member) => (
            <StaggerItem
              key={member.name}
              hoverLift
              className="w-full max-w-xs rounded-2xl border border-mist bg-white dark:bg-offwhite p-8 text-center"
            >
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-mist ring-4 ring-teal/10">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-navy dark:text-white">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-teal">
                {member.role}
              </p>
              <p className="text-xs text-slate">{member.company}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <Reveal className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-navy dark:text-white sm:text-3xl">
          {about.readyHeading}
        </h2>
        <div className="mt-6">
          <LinkButton href="/create-profile" variant="primary" size="lg">
            {about.createProfileCta}
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
        <p className="mt-4 text-sm text-slate">
          {about.haveQuestions}{" "}
          <Link href="/contact" className="font-medium text-teal hover:underline">
            {about.contactUs}
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
