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

const STATUSES = [
  {
    label: "Verified",
    variant: "verified" as const,
    description:
      "Identity confirmed and information reviewed against supporting records.",
  },
  {
    label: "Pending",
    variant: "pending" as const,
    description:
      "Submitted for review; identity or information checks are in progress.",
  },
  {
    label: "Unverified",
    variant: "neutral" as const,
    description:
      "Profile has not yet entered the verification process.",
  },
];

const CHECKS = [
  {
    icon: BadgeCheck,
    title: "Identity Verified",
    description:
      "Confirms the profile represents a real individual with a legitimate claim to the identity presented.",
  },
  {
    icon: FileSearch,
    title: "Information Reviewed",
    description:
      "Career history, positions, and achievements are cross-checked against supporting documentation.",
  },
  {
    icon: Calendar,
    title: "Verification Date",
    description:
      "Every verified profile displays the date its verification was last confirmed.",
  },
  {
    icon: Lock,
    title: "Secure Review Process",
    description:
      "Verification is handled by trained reviewers with role-based access, never exposed publicly.",
  },
];

export const metadata: Metadata = {
  title: "Verification",
  description:
    "How AqoonsiPlus verifies the identity and information behind every trusted profile.",
};

export default function VerificationPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-emerald">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <SectionLabel light className="mx-auto mt-6 justify-center">
            Verification
          </SectionLabel>
          <h1 className="mt-4 text-balance font-heading text-3xl font-bold text-white sm:text-4xl">
            Trust You Can See
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/70">
            Every verified badge on AqoonsiPlus represents a completed
            review of identity and information &mdash; not a self-reported
            claim.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
            What Verification Checks
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CHECKS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-mist p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-teal">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-navy">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-offwhite">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-navy sm:text-3xl">
            Verification Statuses
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {STATUSES.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-mist bg-white p-6 text-center"
              >
                <Badge variant={s.variant} size="md" className="mx-auto">
                  {s.label}
                </Badge>
                <p className="mt-4 text-sm leading-relaxed text-slate">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
          Ready to get verified?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate">
          Create your profile and submit it for review to earn a verified
          badge on AqoonsiPlus.
        </p>
        <div className="mt-6">
          <LinkButton href="/create-profile" variant="primary" size="lg">
            Create Your Profile
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
