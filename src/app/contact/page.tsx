import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the AqoonsiPlus team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <SectionLabel className="mx-auto justify-center">Contact</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl">
        Get in Touch
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-slate">
        Have a question about verification, your profile, or partnering with
        AqoonsiPlus? Reach out and our team will respond as soon as possible.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href="mailto:support@aqoonsiplus.example.com"
          className="flex flex-col items-center gap-3 rounded-2xl border border-mist p-8 transition-colors hover:border-teal/30 hover:bg-offwhite"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-teal">
            <Mail className="h-5 w-5" />
          </div>
          <p className="font-heading text-base font-bold text-navy">Email Support</p>
          <p className="text-sm text-slate">support@aqoonsiplus.example.com</p>
        </a>

        <a
          href="/help"
          className="flex flex-col items-center gap-3 rounded-2xl border border-mist p-8 transition-colors hover:border-teal/30 hover:bg-offwhite"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-teal">
            <MessageCircle className="h-5 w-5" />
          </div>
          <p className="font-heading text-base font-bold text-navy">Help Center</p>
          <p className="text-sm text-slate">Browse frequently asked questions</p>
        </a>
      </div>
    </div>
  );
}
