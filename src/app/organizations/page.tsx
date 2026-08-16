import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Badge } from "@/components/ui/badge";
import { getOrganizations } from "@/lib/data/profiles";

export const metadata: Metadata = {
  title: "Organizations",
  description:
    "Government institutions, companies, and organizations represented on AqoonsiPlus.",
};

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionLabel>Organizations</SectionLabel>
      <h1 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
        Government Institutions
      </h1>
      <p className="mt-3 max-w-xl text-slate">
        Explore government institutions and public bodies connected to the
        leadership profiles on AqoonsiPlus.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          "Federal Government Institutions",
          "Federal Member State Institutions",
          "Regional & Local Government",
          "Ministries & Government Offices",
          "Public Authorities & Agencies",
        ].map((label) => (
          <Badge key={label} variant="neutral" size="sm">
            {label}
          </Badge>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6 transition-shadow hover:shadow-lg hover:shadow-navy/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-teal">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-navy dark:text-white">
                  {org.name}
                </h3>
                {org.country && (
                  <p className="text-xs text-slate">{org.country}</p>
                )}
              </div>
            </div>
            {org.type && (
              <Badge variant="neutral" size="sm" className="mt-4">
                {org.type}
              </Badge>
            )}
            {org.description && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">
                {org.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
