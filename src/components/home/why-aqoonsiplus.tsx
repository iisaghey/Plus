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

const REASONS = [
  {
    icon: LayoutGrid,
    title: "All Your Leadership Information in One Place",
    description:
      "AqoonsiPlus brings your important leadership information together in one organized digital profile. Your biography, education, career history, government positions, activities, travels, speeches, media, documents, and achievements are structured into clear sections that are easy to access.",
  },
  {
    icon: BadgeCheck,
    title: "Present Your Leadership Professionally",
    description:
      "AqoonsiPlus provides a professional digital profile that presents your identity, career history, leadership experience, positions, achievements, and activities in a clear and structured format.",
  },
  {
    icon: Share2,
    title: "Your Profile, Easy to Access and Share",
    description:
      "Your AqoonsiPlus profile can be accessed through a Public Profile Link and a Unique QR Code, making it easier to find and share your professional information when needed.",
  },
  {
    icon: RefreshCcw,
    title: "Keep Your Leadership Profile Current",
    description:
      "Your leadership journey continues to develop. AqoonsiPlus allows new information such as positions, achievements, activities, travels, speeches, media, and documents to be added as they become available.",
  },
  {
    icon: Archive,
    title: "Preserve Your Leadership Journey",
    description:
      "AqoonsiPlus helps organize and preserve your leadership information, from education and career history to government positions, activities, achievements, and official records.",
  },
];

export function WhyAqoonsiPlus() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <CinematicBackground src="/home/sheikh-sharif.jpg" alt="" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel light className="mx-auto justify-center">
            Why AqoonsiPlus?
          </SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            Built for Trust, Designed for Legacy
          </h2>
        </Reveal>

        <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, description }) => (
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
