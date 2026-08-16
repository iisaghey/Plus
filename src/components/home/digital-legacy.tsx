import { Archive, Lock, QrCode, RefreshCcw } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";

const POINTS = [
  {
    icon: Lock,
    title: "Securely Organized",
    description:
      "Your profile information, documents, and media are organized within a structured digital profile with appropriate access controls.",
  },
  {
    icon: QrCode,
    title: "Accessible When Needed",
    description:
      "Your public profile can be accessed through a dedicated profile link and unique QR code, making your professional information easier to find and share.",
  },
  {
    icon: RefreshCcw,
    title: "Continuously Updated",
    description:
      "As new positions, achievements, activities, speeches, media, and documents become available, your profile can be updated to reflect your ongoing leadership journey.",
  },
];

export function DigitalLegacy() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionLabel>Digital Legacy</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            Preserving Leadership History for the Future
          </h2>
          <p className="mt-4 leading-relaxed text-slate">
            AqoonsiPlus helps organize and preserve a leader&apos;s
            professional journey, achievements, activities, media, and
            official records in one structured digital profile. Each profile
            is designed to remain accessible, organized, and updatable as the
            leader&apos;s journey continues.
          </p>

          <dl className="mt-8 space-y-6">
            {POINTS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <dt className="font-heading text-base font-bold text-navy dark:text-white">
                    {title}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate">
                    {description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-teal/10 via-transparent to-gold/10" />
          <div className="rounded-[2rem] border border-mist bg-white dark:bg-offwhite p-8 shadow-xl shadow-navy/5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
                <Archive className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading text-lg font-bold text-navy dark:text-white">
                  Digital Legacy Archive
                </p>
                <p className="text-xs text-slate">Preserved &middot; Verified &middot; Secure</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Biography & Career History",
                "Government Positions & Leadership Journey",
                "Achievements & Recognition",
                "Speeches, Media & Documents",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-offwhite px-4 py-3 text-sm font-medium text-navy dark:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
