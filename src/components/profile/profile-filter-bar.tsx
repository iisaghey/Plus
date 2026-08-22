"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "@/i18n/language-provider";

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
  const { t } = useTranslation();
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
          placeholder={t("profilesPublic.filterBar.searchPlaceholder")}
          className="w-full bg-transparent text-sm text-ink placeholder:text-slate focus:outline-none"
        />
      </form>

      {!lockCategory && (
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="rounded-xl border border-mist bg-white dark:bg-offwhite px-3 py-2 text-sm text-navy dark:text-white focus:border-teal focus:outline-none"
        >
          <option value="">{t("profilesPublic.filterBar.allCategories")}</option>
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
        <option value="">{t("profilesPublic.filterBar.allCountries")}</option>
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
        <option value="">{t("profilesPublic.filterBar.anyStatus")}</option>
        <option value="verified">{t("profilesPublic.filterBar.verified")}</option>
        <option value="pending">{t("profilesPublic.filterBar.pending")}</option>
        <option value="unverified">{t("profilesPublic.filterBar.unverified")}</option>
      </select>

      <select
        value={searchParams.get("sort") ?? ""}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-xl border border-mist bg-white dark:bg-offwhite px-3 py-2 text-sm text-navy dark:text-white focus:border-teal focus:outline-none"
      >
        <option value="">{t("profilesPublic.filterBar.mostViewed")}</option>
        <option value="recent">{t("profilesPublic.filterBar.newest")}</option>
        <option value="name">{t("profilesPublic.filterBar.nameAZ")}</option>
      </select>
    </div>
  );
}
