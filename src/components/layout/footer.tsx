import Link from "next/link";
import { Logo } from "./logo";
import {
  FacebookIcon,
  TwitterIcon,
  TikTokIcon,
  LinkedinIcon,
} from "@/components/ui/social-icons";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/about", label: "About" },
      { href: "/profiles", label: "Profiles" },
      { href: "/verification", label: "Verification" },
      { href: "/search", label: "Advanced Search" },
      { href: "/about#how-it-works", label: "How It Works" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/help", label: "Help Center" },
    ],
  },
];

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
  { href: "https://www.linkedin.com/feed/", label: "LinkedIn", icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs font-heading text-lg font-semibold text-white/90">
              &ldquo;Your Leadership. Your Identity. Your Legacy.&rdquo;
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
              A digital leadership identity and profile management platform
              for political leaders and public officials.
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

          {COLUMNS.map((col) => (
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
          <p>© 2026 AqoonsiPlus. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Secured by Supabase &middot; Built for trust
          </p>
        </div>
      </div>
    </footer>
  );
}
