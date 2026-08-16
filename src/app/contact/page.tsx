import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import {
  FacebookIcon,
  TwitterIcon,
  TikTokIcon,
  LinkedinIcon,
} from "@/components/ui/social-icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the AqoonsiPlus team.",
};

const CONTACTS = [
  {
    href: "mailto:Aqoonsiplus@gmail.com",
    icon: Mail,
    label: "Email",
    value: "Aqoonsiplus@gmail.com",
  },
  {
    href: "tel:+252610300301",
    icon: Phone,
    label: "Phone",
    value: "+252 610 300 301",
  },
  {
    href: "https://www.facebook.com/share/19RPR1MFj3/?mibextid=wwXIfr",
    icon: FacebookIcon,
    label: "Facebook",
    value: "@aqoonsiplus",
    external: true,
  },
  {
    href: "https://x.com/aqoonsiplus",
    icon: TwitterIcon,
    label: "Twitter / X",
    value: "@aqoonsiplus",
    external: true,
  },
  {
    href: "https://www.tiktok.com/@aqoonsiplus?is_from_webapp=1&sender_device=pc",
    icon: TikTokIcon,
    label: "TikTok",
    value: "@aqoonsiplus",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/aqoonsi-plus-b2267642a/",
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "AqoonsiPlus",
    external: true,
  },
  {
    href: "/help",
    icon: MessageCircle,
    label: "Help Center",
    value: "Browse frequently asked questions",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <SectionLabel className="mx-auto justify-center">Contact</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
        Get in Touch
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-slate">
        Have a question about verification, your profile, or partnering with
        AqoonsiPlus? Reach out and our team will respond as soon as possible.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACTS.map(({ href, icon: Icon, label, value, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
            className="flex flex-col items-center gap-3 rounded-2xl border border-mist p-8 transition-colors hover:border-teal/30 hover:bg-offwhite"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-teal">
              <Icon className="h-5 w-5" />
            </div>
            <p className="font-heading text-base font-bold text-navy dark:text-white">{label}</p>
            <p className="text-sm text-slate">{value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
