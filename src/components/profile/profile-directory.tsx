import { SectionLabel } from "@/components/ui/section-label";
import { ProfileFilterBar } from "@/components/profile/profile-filter-bar";
import { ProfileCard } from "@/components/profile/profile-card";
import { searchProfiles, getFilterOptions } from "@/lib/data/profiles";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export async function ProfileDirectory({
  label,
  title,
  description,
  searchParams,
  presetCategory,
}: {
  label: string;
  title: string;
  description: string;
  searchParams: { [key: string]: string | string[] | undefined };
  presetCategory?: string;
}) {
  const toStr = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const params = {
    q: toStr(searchParams.q),
    category: presetCategory ?? toStr(searchParams.category),
    country: toStr(searchParams.country),
    verification: toStr(searchParams.verification),
    sort: toStr(searchParams.sort),
  };

  const [profiles, { categories, countries }, locale] = await Promise.all([
    searchProfiles(params),
    getFilterOptions(),
    getServerLocale(),
  ]);
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionLabel>{label}</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-slate">{description}</p>

      <div className="mt-8">
        <ProfileFilterBar
          categories={categories}
          countries={countries}
          lockCategory={Boolean(presetCategory)}
        />
      </div>

      <p className="mt-6 text-sm text-slate">
        {profiles.length}{" "}
        {profiles.length === 1
          ? t.profilesPublic.directory.resultsCountSingular
          : t.profilesPublic.directory.resultsCountPlural}
      </p>

      {profiles.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-mist py-20 text-center">
          <p className="font-heading text-lg font-semibold text-navy dark:text-white">
            {t.profilesPublic.directory.emptyTitle}
          </p>
          <p className="mt-2 text-sm text-slate">
            {t.profilesPublic.directory.emptyDescription}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
