import {
  ShieldCheck,
  Target,
  Eye,
  Lock,
  Lightbulb,
  Award,
  Archive,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust",
    description: "Building confidence through reliable and verified information.",
  },
  {
    icon: Target,
    title: "Accuracy",
    description: "Maintaining accurate and well-organized information.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Promoting clarity and responsible information management.",
  },
  {
    icon: Lock,
    title: "Security",
    description: "Protecting digital identities and sensitive archives.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Using modern technology to preserve and present information.",
  },
  {
    icon: Award,
    title: "Professionalism",
    description: "Maintaining high standards across every profile.",
  },
  {
    icon: Archive,
    title: "Preservation",
    description:
      "Protecting leadership stories and digital legacies for future generations.",
  },
];

export function OurValues() {
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel className="mx-auto justify-center">
            Our Values
          </SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl">
            The Principles Behind AqoonsiPlus
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`rounded-2xl border border-mist bg-white p-6 text-center transition-shadow hover:shadow-lg hover:shadow-navy/5 ${
                i === 6 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/5 text-gold">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-base font-bold text-navy">
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
