import {
  ShieldCheck,
  IdCard,
  Lock,
  History,
  SearchCheck,
  Landmark,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Verified Information",
    description:
      "Every profile passes a structured verification process before being marked as trusted.",
  },
  {
    icon: IdCard,
    title: "Professional Digital Identity",
    description:
      "A single, authoritative digital identity for leaders and professionals worldwide.",
  },
  {
    icon: Lock,
    title: "Secure Archives",
    description:
      "Documents and sensitive records are protected with granular, role-based access controls.",
  },
  {
    icon: History,
    title: "Leadership History",
    description:
      "Full career, government, and leadership timelines preserved in one organized record.",
  },
  {
    icon: SearchCheck,
    title: "Advanced Search",
    description:
      "Find leaders and professionals by position, institution, country, or industry in seconds.",
  },
  {
    icon: Landmark,
    title: "Digital Legacy",
    description:
      "Achievements and contributions preserved securely for future generations to reference.",
  },
];

export function WhyAqoonsiPlus() {
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel className="mx-auto justify-center">
            Why AqoonsiPlus?
          </SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            Built for Trust, Designed for Legacy
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6 transition-shadow hover:shadow-lg hover:shadow-navy/5"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
