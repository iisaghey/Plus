import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AqoonsiPlus collects, uses, and protects your information.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly when creating a profile — including biographical details, career history, achievements, media, and documents — as well as account information such as your email address.",
  },
  {
    title: "How We Use Information",
    body: "Information is used to build, verify, and present your digital profile, to operate the platform securely, and to communicate with you about your account.",
  },
  {
    title: "Information Sharing",
    body: "Profile information you mark as public is visible to visitors. Private documents and account details are never shared publicly and are protected by role-based access controls.",
  },
  {
    title: "Data Security",
    body: "AqoonsiPlus uses Supabase's Postgres database with row-level security, encrypted storage, and role-based permissions to protect your data.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal information at any time by contacting us.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionLabel>Legal</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-slate">Last updated: January 2026</p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-heading text-lg font-bold text-navy">
              {s.title}
            </h2>
            <p className="mt-2 leading-relaxed text-slate">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
