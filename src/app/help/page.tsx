import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Frequently asked questions about using AqoonsiPlus.",
};

const FAQ_KEYS = [
  "createProfile",
  "verification",
  "whoCanSee",
  "updateProfile",
  "qrCode",
  "reportIncorrect",
] as const;

export default async function HelpPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const help = t.publicPages.help;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionLabel>{help.sectionLabel}</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
        {help.heading}
      </h1>

      <div className="mt-10 space-y-6">
        {FAQ_KEYS.map((key) => {
          const f = help.faqs[key];
          return (
            <div key={key} className="rounded-2xl border border-mist p-6">
              <h2 className="font-heading text-base font-bold text-navy dark:text-white">
                {f.q}
              </h2>
              <p className="mt-2 leading-relaxed text-slate">{f.a}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center text-sm text-slate">
        {help.stillNeedHelp}{" "}
        <Link href="/contact" className="font-semibold text-teal hover:underline">
          {help.contactOurTeam}
        </Link>
      </p>
    </div>
  );
}
