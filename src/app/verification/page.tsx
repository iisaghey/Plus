import type { Metadata } from "next";
import {
  ShieldCheck,
  BadgeCheck,
  FileSearch,
  Calendar,
  Lock,
  ArrowRight,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

const STATUS_META = [
  { key: "verified", variant: "verified" as const },
  { key: "pending", variant: "pending" as const },
  { key: "unverified", variant: "neutral" as const },
] as const;

const CHECKS_META = [
  { key: "identity", icon: BadgeCheck },
  { key: "information", icon: FileSearch },
  { key: "date", icon: Calendar },
  { key: "secureProcess", icon: Lock },
] as const;

export const metadata: Metadata = {
  title: "Verification",
  description:
    "How AqoonsiPlus verifies the identity and information behind every trusted profile.",
};

export default async function VerificationPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const verification = t.publicPages.verification;

  return (
    <div>
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-emerald">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <SectionLabel light className="mx-auto mt-6 justify-center">
            {verification.sectionLabel}
          </SectionLabel>
          <h1 className="mt-4 text-balance font-heading text-3xl font-bold text-white sm:text-4xl">
            {verification.heading}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/70">
            {verification.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-navy dark:text-white sm:text-3xl">
            {verification.whatVerificationChecks}
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CHECKS_META.map(({ key, icon: Icon }) => {
            const { title, description } = verification.checks[key];
            return (
              <div
                key={key}
                className="flex gap-4 rounded-2xl border border-mist p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-teal">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-navy dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-offwhite">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-navy dark:text-white sm:text-3xl">
            {verification.statusesHeading}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {STATUS_META.map(({ key, variant }) => {
              const { label, description } = verification.statuses[key];
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6 text-center"
                >
                  <Badge variant={variant} size="md" className="mx-auto">
                    {label}
                  </Badge>
                  <p className="mt-4 text-sm leading-relaxed text-slate">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-navy dark:text-white sm:text-3xl">
          {verification.readyHeading}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate">
          {verification.readyDescription}
        </p>
        <div className="mt-6">
          <LinkButton href="/create-profile" variant="primary" size="lg">
            {verification.createProfileCta}
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
