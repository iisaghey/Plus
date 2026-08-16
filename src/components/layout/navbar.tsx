"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, ShieldCheck, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/motion";

const NAV_LINKS = [
  { href: "/profiles", label: "Profiles" },
  { href: "/leaders", label: "Leaders" },
  { href: "/professionals", label: "Professionals" },
  { href: "/organizations", label: "Organizations" },
  { href: "/about", label: "About" },
  { href: "/verification", label: "Verification" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-mist bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(15,23,42,0.04)] dark:bg-offwhite/90"
          : "border-transparent bg-white/70 backdrop-blur-sm dark:bg-offwhite/70"
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate transition-colors hover:bg-offwhite hover:text-navy dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate transition-colors hover:bg-offwhite hover:text-navy dark:hover:text-white"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <ThemeToggle />
          <LinkButton href="/login" variant="ghost" size="sm">
            Login
          </LinkButton>
          <LinkButton href="/create-profile" variant="primary" size="sm">
            <ShieldCheck className="h-4 w-4" />
            Create Profile
          </LinkButton>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy dark:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <motion.span
              key={open ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: DURATION.fast, ease: EASE }}
              className="flex"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="overflow-hidden border-t border-mist bg-white lg:hidden dark:bg-offwhite"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE }}
          >
            <div className="px-4 py-4">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-navy hover:bg-offwhite dark:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-mist pt-4">
                <LinkButton href="/login" variant="outline" size="md" className="w-full">
                  Login
                </LinkButton>
                <LinkButton href="/create-profile" variant="primary" size="md" className="w-full">
                  <ShieldCheck className="h-4 w-4" />
                  Create Profile
                </LinkButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
