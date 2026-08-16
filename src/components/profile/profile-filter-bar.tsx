"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";

export function ProfileFilterBar({
  categories,
  countries,
  lockCategory,
}: {
  categories: { name: string; slug: string }[];
  countries: string[];
  lockCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", q);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-mist bg-white dark:bg-offwhite p-4 sm:flex-row sm:items-center">
      <form onSubmit={onSearchSubmit} className="flex flex-1 items-center gap-2">
        <Search className="h-4 w-4 shrink-0 text-slate" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, position, or profession…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-slate focus:outline-none"
        />
      </form>

      {!lockCategory && (
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="rounded-xl border border-mist bg-white dark:bg-offwhite px-3 py-2 text-sm text-navy dark:text-white focus:border-teal focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      <select
        value={searchParams.get("country") ?? ""}
        onChange={(e) => updateParam("country", e.target.value)}
        className="rounded-xl border border-mist bg-white dark:bg-offwhite px-3 py-2 text-sm text-navy dark:text-white focus:border-teal focus:outline-none"
      >
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("verification") ?? ""}
        onChange={(e) => updateParam("verification", e.target.value)}
        className="rounded-xl border border-mist bg-white dark:bg-offwhite px-3 py-2 text-sm text-navy dark:text-white focus:border-teal focus:outline-none"
      >
        <option value="">Any Status</option>
        <option value="verified">Verified</option>
        <option value="pending">Pending</option>
        <option value="unverified">Unverified</option>
      </select>

      <select
        value={searchParams.get("sort") ?? ""}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-xl border border-mist bg-white dark:bg-offwhite px-3 py-2 text-sm text-navy dark:text-white focus:border-teal focus:outline-none"
      >
        <option value="">Most Viewed</option>
        <option value="recent">Newest</option>
        <option value="name">Name (A–Z)</option>
      </select>
    </div>
  );
}
