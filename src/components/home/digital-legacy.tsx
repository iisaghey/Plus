import { Archive, Lock, Users, Infinity as InfinityIcon } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

const POINTS = [
  {
    icon: Lock,
    title: "Secured Beyond a Lifetime",
    description:
      "Records, documents, and media are stored in secure, access-controlled archives built to last.",
  },
  {
    icon: Users,
    title: "Accessible to Future Generations",
    description:
      "Family, institutions, and researchers can reference a verified public record long into the future.",
  },
  {
    icon: InfinityIcon,
    title: "Continuously Preserved",
    description:
      "Profiles remain part of the permanent archive, independent of any single platform or administration.",
  },
];

export function DigitalLegacy() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionLabel>Digital Legacy</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            Preserving Leadership History for Future Generations
          </h2>
          <p className="mt-4 leading-relaxed text-slate">
            AqoonsiPlus exists to make sure a leader&apos;s work outlives the
            moment it happened. Every biography, timeline entry, achievement,
            and document becomes part of a permanent, verified digital
            record &mdash; preserved securely and presented with the dignity
            a life of public service deserves.
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
        </div>

        <div className="relative">
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
                <p className="text-xs text-slate">Permanent &middot; Verified &middot; Secure</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Biography & career record",
                "Government position history",
                "Achievements & recognitions",
                "Speeches, media & documents",
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
        </div>
      </div>
    </section>
  );
}
