import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import {
  FacebookIcon,
  TwitterIcon,
  TikTokIcon,
  LinkedinIcon,
} from "@/components/ui/social-icons";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the AqoonsiPlus team.",
};

export default async function ContactPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const contact = t.publicPages.contact;

  const CONTACTS = [
    {
      href: "mailto:Aqoonsiplus@gmail.com",
      icon: Mail,
      label: contact.methods.email,
      value: "Aqoonsiplus@gmail.com",
    },
    {
      href: "tel:+252610300301",
      icon: Phone,
      label: contact.methods.phone,
      value: "+252 610 300 301",
    },
    {
      href: "https://www.facebook.com/share/19RPR1MFj3/?mibextid=wwXIfr",
      icon: FacebookIcon,
      label: contact.methods.facebook,
      value: "@aqoonsiplus",
      external: true,
    },
    {
      href: "https://x.com/aqoonsiplus",
      icon: TwitterIcon,
      label: contact.methods.twitter,
      value: "@aqoonsiplus",
      external: true,
    },
    {
      href: "https://www.tiktok.com/@aqoonsiplus?is_from_webapp=1&sender_device=pc",
      icon: TikTokIcon,
      label: contact.methods.tiktok,
      value: "@aqoonsiplus",
      external: true,
    },
    {
      href: "https://www.linkedin.com/in/aqoonsi-plus-b2267642a/",
      icon: LinkedinIcon,
      label: contact.methods.linkedin,
      value: "AqoonsiPlus",
      external: true,
    },
    {
      href: "/help",
      icon: MessageCircle,
      label: contact.methods.helpCenter,
      value: contact.helpCenterDescription,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <SectionLabel className="mx-auto justify-center">{contact.sectionLabel}</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
        {contact.heading}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-slate">{contact.description}</p>

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
