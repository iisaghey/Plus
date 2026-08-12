import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the AqoonsiPlus platform.",
};

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By creating a profile or otherwise using AqoonsiPlus, you agree to these Terms of Service and our Privacy Policy.",
  },
  {
    title: "Account Responsibilities",
    body: "You are responsible for the accuracy of information you submit and for maintaining the security of your account credentials.",
  },
  {
    title: "Verification",
    body: "Verified badges reflect the outcome of AqoonsiPlus's review process and do not constitute an endorsement of any individual or organization.",
  },
  {
    title: "Content Standards",
    body: "Profiles must contain accurate, non-defamatory information. AqoonsiPlus reserves the right to suspend or remove profiles that violate these standards.",
  },
  {
    title: "Limitation of Liability",
    body: "AqoonsiPlus is provided on an as-is basis. We are not liable for decisions made based on information presented on the platform.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionLabel>Legal</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl">
        Terms of Service
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
