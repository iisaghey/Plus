import Link from "next/link";
import { Logo } from "./logo";
import {
  FacebookIcon,
  TwitterIcon,
  TikTokIcon,
  LinkedinIcon,
} from "@/components/ui/social-icons";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

const SOCIALS = [
  {
    href: "https://www.facebook.com/share/19RPR1MFj3/?mibextid=wwXIfr",
    label: "Facebook",
    icon: FacebookIcon,
  },
  { href: "https://x.com/aqoonsiplus", label: "Twitter / X", icon: TwitterIcon },
  {
    href: "https://www.tiktok.com/@aqoonsiplus?is_from_webapp=1&sender_device=pc",
    label: "TikTok",
    icon: TikTokIcon,
  },
  { href: "https://www.linkedin.com/in/aqoonsi-plus-b2267642a/", label: "LinkedIn", icon: LinkedinIcon },
];

export async function Footer() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  const columns = [
    {
      title: t.footer.platform,
      links: [
        { href: "/about", label: t.footer.about },
        { href: "/profiles", label: t.footer.profiles },
        { href: "/verification", label: t.footer.verification },
        { href: "/search", label: t.footer.advancedSearch },
        { href: "/about#how-it-works", label: t.footer.howItWorks },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { href: "/privacy", label: t.footer.privacyPolicy },
        { href: "/terms", label: t.footer.termsOfService },
      ],
    },
    {
      title: t.footer.support,
      links: [
        { href: "/contact", label: t.footer.contact },
        { href: "/help", label: t.footer.helpCenter },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs font-heading text-lg font-semibold text-white/90">
              &ldquo;{t.footer.tagline}&rdquo;
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
              {t.footer.description}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-sky/40 hover:text-sky"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-sky"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© 2026 AqoonsiPlus. {t.footer.rights}</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            {t.footer.securedBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
