import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProfileCardData } from "@/lib/data/profiles";

export function ProfileCard({ profile }: { profile: ProfileCardData }) {
  const organization = Array.isArray(profile.organizations)
    ? profile.organizations[0]
    : profile.organizations;
  const category = Array.isArray(profile.categories)
    ? profile.categories[0]
    : profile.categories;

  return (
    <Link
      href={`/profile/${profile.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-mist bg-white dark:bg-offwhite transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-xl hover:shadow-navy/5"
    >
      <div className="relative h-24 bg-gradient-to-br from-navy via-royal to-aqoonsi">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="-mt-10 mb-3 flex items-end justify-between">
          <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-mist p-1 shadow-md">
            {profile.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={profile.full_name}
                width={80}
                height={80}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            ) : null}
          </div>
          {profile.verification_status === "verified" && (
            <Badge variant="verified" className="mb-1">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {category && (
          <span className="font-accent text-[10px] font-semibold uppercase tracking-wider text-teal">
            {category.name}
          </span>
        )}
        <h3 className="mt-1 font-heading text-base font-bold text-navy dark:text-white group-hover:text-teal transition-colors">
          {profile.full_name}
        </h3>
        {profile.current_position && (
          <p className="mt-0.5 text-sm font-medium text-slate">
            {profile.current_position}
          </p>
        )}
        {organization && (
          <p className="text-xs text-slate/80">{organization.name}</p>
        )}

        {profile.location && (
          <div className="mt-2 flex items-center gap-1 text-xs text-slate">
            <MapPin className="h-3 w-3" />
            {profile.location}
          </div>
        )}

        {profile.short_bio && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate">
            {profile.short_bio}
          </p>
        )}

        <span className="mt-4 inline-flex items-center text-sm font-semibold text-teal">
          View Profile
          <svg
            className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
