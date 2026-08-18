import type { Tables } from "@/types/database.types";

export type SectionKey =
  | "identity"
  | "contact"
  | "social"
  | "biography"
  | "education"
  | "career"
  | "positions"
  | "achievements"
  | "activities"
  | "travel"
  | "speeches"
  | "media"
  | "documents";

export type SectionCompleteness = {
  key: SectionKey;
  label: string;
  complete: boolean;
  /** Human-readable list of what's still missing, e.g. ["profile photo", "category"]. */
  missing: string[];
};

export type ProfileCompletenessInput = {
  profile: Tables<"profiles">;
  biography: Tables<"biographies"> | null;
  education: Tables<"education">[];
  careerTimeline: Tables<"career_timeline">[];
  positions: Tables<"government_positions">[];
  achievements: Tables<"achievements">[];
  activities: Tables<"official_activities">[];
  travel: Tables<"official_travel">[];
  speeches: Tables<"speeches">[];
  media: Tables<"media">[];
  documents: Tables<"documents">[];
};

function listSection(
  key: SectionKey,
  label: string,
  entries: unknown[],
  missingLabel: string
): SectionCompleteness {
  return {
    key,
    label,
    complete: entries.length > 0,
    missing: entries.length > 0 ? [] : [missingLabel],
  };
}

/** All 13 mandatory profile sections. Every one must be complete before the
 * creator can advance past its step or submit the profile for review. */
export function computeSectionCompleteness(
  input: ProfileCompletenessInput
): SectionCompleteness[] {
  const { profile } = input;
  const socialLinks = (profile.social_links as Record<string, string> | null) ?? {};

  const identityMissing: string[] = [];
  if (!profile.full_name) identityMissing.push("full name");
  if (!profile.photo_url) identityMissing.push("profile photo");
  if (!profile.current_position) identityMissing.push("current position");
  if (!profile.category_id) identityMissing.push("category");

  const hasContact = Boolean(profile.email || profile.phone);
  const hasSocial = Object.values(socialLinks).some((v) => Boolean(v));
  const hasBiography = Boolean(input.biography?.summary);

  return [
    {
      key: "identity",
      label: "Full Name, Photo, Position & Category",
      complete: identityMissing.length === 0,
      missing: identityMissing,
    },
    {
      key: "contact",
      label: "Contact Information",
      complete: hasContact,
      missing: hasContact ? [] : ["an email or phone number"],
    },
    {
      key: "social",
      label: "Official Social Media",
      complete: hasSocial,
      missing: hasSocial ? [] : ["at least one social media link"],
    },
    {
      key: "biography",
      label: "Biography",
      complete: hasBiography,
      missing: hasBiography ? [] : ["a short biography summary"],
    },
    listSection("education", "Education", input.education, "at least one education entry"),
    listSection(
      "career",
      "Career & Leadership Journey",
      input.careerTimeline,
      "at least one career timeline entry"
    ),
    listSection(
      "positions",
      "Government Positions",
      input.positions,
      "at least one government position"
    ),
    listSection(
      "achievements",
      "Achievements & Awards",
      input.achievements,
      "at least one achievement"
    ),
    listSection(
      "activities",
      "Official Activities & Meetings",
      input.activities,
      "at least one official activity"
    ),
    listSection("travel", "Official Travels", input.travel, "at least one official travel record"),
    listSection(
      "speeches",
      "Speeches & Public Communications",
      input.speeches,
      "at least one speech"
    ),
    listSection("media", "Media & Gallery", input.media, "at least one photo, video, or file"),
    listSection("documents", "Documents & Records", input.documents, "at least one document"),
  ];
}
