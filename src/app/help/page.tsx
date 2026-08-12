import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Frequently asked questions about using AqoonsiPlus.",
};

const FAQS = [
  {
    q: "How do I create a profile?",
    a: "Click “Create Profile” in the navigation bar, sign up with your email, and you'll be guided through building your digital profile.",
  },
  {
    q: "How does verification work?",
    a: "After creating a profile, you can submit it for review. Our team verifies identity and cross-checks submitted information before granting a verified badge. See the Verification page for details.",
  },
  {
    q: "Who can see my profile?",
    a: "You control visibility. Public profiles are searchable by anyone; private documents are only visible to you and platform staff.",
  },
  {
    q: "Can I update my profile after it's published?",
    a: "Yes. Profile owners can edit their information at any time from their dashboard.",
  },
  {
    q: "How do I get a QR code for my profile?",
    a: "Every public profile automatically generates a QR code, available from the profile page header — you can download, share, or print it.",
  },
  {
    q: "How do I report incorrect information?",
    a: "Contact our support team with details of the profile and the correction needed.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionLabel>Help Center</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl">
        Frequently Asked Questions
      </h1>

      <div className="mt-10 space-y-6">
        {FAQS.map((f) => (
          <div key={f.q} className="rounded-2xl border border-mist p-6">
            <h2 className="font-heading text-base font-bold text-navy">
              {f.q}
            </h2>
            <p className="mt-2 leading-relaxed text-slate">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-slate">
        Still need help?{" "}
        <Link href="/contact" className="font-semibold text-teal hover:underline">
          Contact our team
        </Link>
      </p>
    </div>
  );
}
