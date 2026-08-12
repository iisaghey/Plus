"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, ArrowRight, SlidersHorizontal } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function Hero({
  stats,
}: {
  stats: { totalProfiles: number; verifiedProfiles: number; organizations: number };
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <section className="relative overflow-hidden bg-navy">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(10,110,138,0.55), transparent 60%), radial-gradient(ellipse 70% 50% at 85% 20%, rgba(56,189,248,0.25), transparent 55%), radial-gradient(ellipse 60% 60% at 50% 100%, rgba(0,124,131,0.4), transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-accent text-xs font-semibold uppercase tracking-widest text-sky backdrop-blur-sm animate-fade-up">
          <ShieldCheck className="h-3.5 w-3.5" />
          Trusted Digital Identity Platform
        </div>

        <h1
          className="mt-6 text-balance font-heading text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          Every Leader Has a Story.
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/70 sm:text-lg animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          Discover verified digital profiles, leadership histories,
          achievements, official activities, speeches, media, and
          professional legacies &mdash; all in one trusted platform.
        </p>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/15 bg-white/95 p-2 shadow-2xl shadow-navy/40 backdrop-blur animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <Search className="ml-3 h-5 w-5 shrink-0 text-slate" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search leaders, professionals, personalities…"
            className="h-11 w-full bg-transparent text-sm text-ink placeholder:text-slate focus:outline-none"
          />
          <button
            type="button"
            onClick={() => router.push("/search")}
            className="hidden h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate hover:bg-offwhite sm:flex"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Advanced
          </button>
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-teal px-6 text-sm font-semibold text-white transition-colors hover:bg-aqoonsi"
          >
            Search
          </button>
        </form>

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          <LinkButton href="/profiles" variant="primary" size="lg">
            Explore Profiles
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/create-profile" variant="outline-white" size="lg">
            Create a Profile
          </LinkButton>
        </div>

        <dl
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-8 animate-fade-up"
          style={{ animationDelay: "400ms" }}
        >
          {[
            { label: "Digital Profiles", value: stats.totalProfiles },
            { label: "Verified Leaders", value: stats.verifiedProfiles },
            { label: "Organizations", value: stats.organizations },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="font-accent text-[11px] uppercase tracking-wider text-white/40">
                {stat.label}
              </dt>
              <dd className="mt-1 font-heading text-2xl font-bold text-white sm:text-3xl">
                {stat.value.toLocaleString()}+
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
