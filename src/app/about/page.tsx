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

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Send,
    label: "Apply",
    title: "Request Your AqoonsiPlus Profile",
    description:
      "The leader or public official contacts AqoonsiPlus to request the creation of a professional digital profile.",
  },
  {
    step: "02",
    icon: ClipboardList,
    label: "Information Collection",
    title: "We Collect Your Information",
    description:
      "We collect the key information needed to build the profile, including personal information, biography, education, career history, government positions, activities & meetings, official travels, speeches, media, documents, and achievements.",
  },
  {
    step: "03",
    icon: LayoutGrid,
    label: "Profile Building",
    title: "We Build Your Digital Profile",
    description:
      "The information collected is organized into a professional digital profile, with each part of the leader's journey presented in its own structured section.",
  },
  {
    step: "04",
    icon: ShieldCheck,
    label: "Review & Verification",
    title: "Review & Verification",
    description:
      "The profile and its information are reviewed. Information requiring verification is checked using supporting documents and available information before the profile is marked as verified.",
  },
  {
    step: "05",
    icon: Rocket,
    label: "Profile Launch",
    title: "Your Profile Goes Live",
    description:
      "Once the profile is completed and reviewed, it is published and made accessible through a public profile link, verified status, and a unique QR code.",
  },
  {
    step: "06",
    icon: RefreshCcw,
    label: "Continuous Updates",
    title: "Keep Your Profile Updated",
    description:
      "The profile can continue to be updated as new information becomes available, including new positions, achievements, official activities, travels, speeches, photos & videos, and documents.",
  },
];

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

export default function AboutPage() {
  return (
    <div>
      <section className="bg-navy">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <SectionLabel light className="mx-auto justify-center">
            About AqoonsiPlus
          </SectionLabel>
          <h1 className="mt-4 text-balance font-heading text-3xl font-bold text-white sm:text-4xl">
            A Trusted Home for Leadership Stories
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance leading-relaxed text-white/70">
            AqoonsiPlus is a digital profile and information management
            platform built to organize, preserve, verify, and professionally
            present information about political leaders and public
            officials. We exist to ensure that a leader&apos;s professional
            journey, public service, achievements, and official history are
            organized and preserved in one digital home.
          </p>
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
            {["Political Leaders", "Government Officials", "Former Public Officials"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-accent text-xs font-semibold uppercase tracking-widest text-sky backdrop-blur-sm"
                >
                  {label}
                </span>
              )
            )}
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
              Our Mission
            </h2>
            <p className="mt-3 leading-relaxed text-slate">
              To build, organize, verify, and manage professional digital
              profiles for political leaders and public officials, bringing
              their identity, career history, leadership journey,
              achievements, activities, media, and official records together
              in one accessible digital home.
            </p>
          </StaggerItem>
          <StaggerItem className="rounded-2xl border border-mist p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-navy dark:text-white">
              Our Vision
            </h2>
            <p className="mt-3 leading-relaxed text-slate">
              To become a trusted digital home for leadership history, where
              the professional journeys, achievements, and public service
              records of leaders are organized, preserved, and accessible
              for the future.
            </p>
          </StaggerItem>
        </StaggerGrid>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel className="mx-auto justify-center">
            How AqoonsiPlus Works
          </SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            From Application to a Living Profile
          </h2>
        </Reveal>

        <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map(({ step, icon: Icon, label, title, description }) => (
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
          ))}
        </StaggerGrid>
      </section>

      <section className="bg-offwhite">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <SectionLabel className="mx-auto justify-center">
              How Verification Works
            </SectionLabel>
            <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white">
              A Structured, Human-Reviewed Process
            </h2>
          </Reveal>

          <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Identity Verified",
                description:
                  "Profile ownership and identity documents are reviewed against official records.",
              },
              {
                step: "02",
                title: "Information Reviewed",
                description:
                  "Career history, positions, and achievements are cross-checked for accuracy.",
              },
              {
                step: "03",
                title: "Profile Verified",
                description:
                  "Approved profiles receive a verified badge with a visible verification date.",
              },
            ].map((s) => (
              <StaggerItem
                key={s.step}
                className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6"
              >
                <span className="font-heading text-2xl font-bold text-gold">
                  {s.step}
                </span>
                <h3 className="mt-2 font-heading text-base font-bold text-navy dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {s.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <div className="mt-8 text-center">
            <LinkButton href="/verification" variant="outline" size="md">
              <ShieldCheck className="h-4 w-4" />
              Learn More About Verification
            </LinkButton>
          </div>
        </div>
      </section>

      <OurValues />

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionLabel className="mx-auto justify-center">
            Leadership
          </SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white">
            Our Team
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
          Ready to preserve your legacy?
        </h2>
        <div className="mt-6">
          <LinkButton href="/create-profile" variant="primary" size="lg">
            Create Your Profile
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
        <p className="mt-4 text-sm text-slate">
          Have questions?{" "}
          <Link href="/contact" className="font-medium text-teal hover:underline">
            Contact us
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
