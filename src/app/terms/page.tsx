import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/section-label";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the AqoonsiPlus platform.",
};

const SECTION_KEYS = [
  "acceptance",
  "accountResponsibilities",
  "verification",
  "contentStandards",
  "limitationOfLiability",
] as const;

export default async function TermsPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const terms = t.publicPages.terms;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionLabel>{terms.sectionLabel}</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
        {terms.heading}
      </h1>
      <p className="mt-3 text-sm text-slate">{terms.lastUpdated}</p>

      <div className="mt-10 space-y-8">
        {SECTION_KEYS.map((key) => {
          const s = terms.sections[key];
          return (
            <div key={key}>
              <h2 className="font-heading text-lg font-bold text-navy dark:text-white">
                {s.title}
              </h2>
              <p className="mt-2 leading-relaxed text-slate">{s.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
