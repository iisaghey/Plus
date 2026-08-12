import Link from "next/link";
import { Logo } from "./logo";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/about", label: "About" },
      { href: "/profiles", label: "Profiles" },
      { href: "/verification", label: "Verification" },
      { href: "/search", label: "Advanced Search" },
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
  { href: "#", label: "Facebook", icon: Facebook },
  { href: "#", label: "LinkedIn", icon: Linkedin },
  { href: "#", label: "Twitter / X", icon: Twitter },
  { href: "#", label: "YouTube", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs font-heading text-lg font-semibold text-white/90">
              &ldquo;Every Leader Has a Story.&rdquo;
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
              A trusted digital identity and leadership archive platform for
              individuals, professionals, and public figures worldwide.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
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
