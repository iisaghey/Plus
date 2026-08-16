import Image from "next/image";
import { MapPin, Building2, Globe } from "lucide-react";
import { LinkedinIcon, TwitterIcon } from "@/components/ui/social-icons";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "./share-button";
import { ProfileQrCode } from "./profile-qr-code";
import type { Tables } from "@/types/database.types";

type ProfileWithRelations = Tables<"profiles"> & {
  organizations: { id: string; name: string; logo_url: string | null; website: string | null } | null;
  categories: { id: string; name: string; slug: string } | null;
};

export function ProfileHeader({
  profile,
  isSuperAdmin,
}: {
  profile: ProfileWithRelations;
  isSuperAdmin: boolean;
}) {
  const social = (profile.social_links ?? {}) as Record<string, string>;
  const isVerified = profile.verification_status === "verified";

  return (
    <div className="relative">
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-navy via-royal to-aqoonsi sm:h-64">
        {profile.cover_url && (
          <Image
            src={profile.cover_url}
            alt=""
            fill
            priority
            className="object-cover opacity-70 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex flex-col gap-6 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-mist shadow-xl sm:h-40 sm:w-40">
              {profile.photo_url && (
                <Image
                  src={profile.photo_url}
                  alt={profile.full_name}
                  width={160}
                  height={160}
                  priority
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                {profile.categories && (
                  <Badge variant="teal" size="sm">
                    {profile.categories.name}
                  </Badge>
                )}
                {isVerified && <Badge variant="verified" size="sm">Verified Profile</Badge>}
                {profile.verification_status === "pending" && (
                  <Badge variant="pending" size="sm">Verification Pending</Badge>
                )}
              </div>
              <h1 className="mt-2 font-heading text-2xl font-bold text-navy dark:text-white sm:text-3xl">
                {profile.preferred_title ? `${profile.preferred_title} ` : ""}
                {profile.full_name}
              </h1>
              <p className="mt-1 text-base font-medium text-slate">
                {profile.current_position}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate">
                {profile.organizations && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {profile.organizations.name}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 pb-1">
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-mist text-slate hover:border-teal hover:text-teal"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-mist text-slate hover:border-teal hover:text-teal"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-mist text-slate hover:border-teal hover:text-teal"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
            <ProfileQrCode
              slug={profile.slug}
              fullName={profile.full_name}
              isSuperAdmin={isSuperAdmin}
            />
            <ShareButton slug={profile.slug} fullName={profile.full_name} />
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-10 items-center rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-royal"
              >
                Contact
              </a>
            )}
          </div>
        </div>

        {profile.short_bio && (
          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-slate">
            {profile.short_bio}
          </p>
        )}
      </div>
    </div>
  );
}
