import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  PenSquare,
  ExternalLink,
  Sparkles,
  Hourglass,
  XCircle,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/profile/sign-out-button";
import { SubmitVerificationButton } from "@/components/profile/submit-verification-button";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const COMPLETION_FIELDS = [
  "preferred_title",
  "profession",
  "current_position",
  "category_id",
  "organization_id",
  "country",
  "location",
  "short_bio",
  "photo_url",
] as const;

const STAFF_ROLES = ["super_admin", "admin", "editor", "verifier"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: userRole }, { data: profile }] = await Promise.all([
    supabase
      .from("user_roles")
      .select("role, account_status")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  const isStaff = Boolean(userRole && STAFF_ROLES.includes(userRole.role));
  const accountStatus = userRole?.account_status ?? "pending";

  const completion = profile
    ? Math.round(
        ((1 +
          COMPLETION_FIELDS.filter((f) => Boolean(profile[f])).length) /
          (COMPLETION_FIELDS.length + 1)) *
          100
      )
    : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-teal">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate">
              Signed in as
            </p>
            <p className="text-sm font-semibold text-navy dark:text-white">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </div>

      {isStaff && (
        <Link
          href="/admin"
          className="mt-6 flex items-center justify-between rounded-2xl border border-teal/30 bg-teal/5 p-4 transition-colors hover:bg-teal/10"
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-teal" />
            <div>
              <p className="text-sm font-semibold text-navy dark:text-white">Staff Panel</p>
              <p className="text-xs text-slate">
                Review account approvals and profile verifications.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal">Open →</span>
        </Link>
      )}

      {!isStaff && accountStatus === "pending" && (
        <div className="mt-10 rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
            <Hourglass className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-navy dark:text-white">
            Your account is pending approval
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate">
            A member of our team reviews new accounts before you can create a
            profile. This is usually quick — check back soon.
          </p>
        </div>
      )}

      {!isStaff && accountStatus === "rejected" && (
        <div className="mt-10 rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <XCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-navy dark:text-white">
            Your account was not approved
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate">
            Contact our support team if you believe this was a mistake.
          </p>
          <div className="mt-6">
            <LinkButton href="/contact" variant="outline" size="md">
              Contact Support
            </LinkButton>
          </div>
        </div>
      )}

      {(isStaff || accountStatus === "approved") && !profile && (
        <div className="mt-10 rounded-2xl border border-dashed border-mist p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-navy dark:text-white">
            You haven&apos;t created your profile yet
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate">
            Add your name, title, and biography to publish your digital
            profile on AqoonsiPlus.
          </p>
          <div className="mt-6">
            <LinkButton href="/dashboard/profile" variant="primary" size="md">
              <PenSquare className="h-4 w-4" />
              Create Your Profile
            </LinkButton>
          </div>
        </div>
      )}

      {(isStaff || accountStatus === "approved") && profile && (
        <div className="mt-10 space-y-6">
          <div className="rounded-2xl border border-mist p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-mist">
                  {profile.photo_url && (
                    <Image
                      src={profile.photo_url}
                      alt={profile.full_name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-lg font-bold text-navy dark:text-white">
                      {profile.full_name}
                    </p>
                    {profile.verification_status === "verified" && (
                      <Badge variant="verified" size="sm">
                        Verified
                      </Badge>
                    )}
                    {profile.verification_status === "pending" && (
                      <Badge variant="pending" size="sm">
                        Verification Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate">
                    {profile.current_position ?? "No position added yet"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <LinkButton href="/dashboard/profile" variant="outline" size="sm">
                  <PenSquare className="h-3.5 w-3.5" />
                  Edit Profile
                </LinkButton>
                <LinkButton
                  href={`/profile/${profile.slug}`}
                  variant="ghost"
                  size="sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Public Profile
                </LinkButton>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-medium text-slate">
                <span>Profile Completion</span>
                <span>{completion}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-teal transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              {completion < 100 && (
                <p className="mt-2 text-xs text-slate">
                  Add a category, organization, location, and photo to
                  complete your profile.
                </p>
              )}
            </div>

            {(profile.verification_status === "unverified" ||
              profile.verification_status === "rejected") && (
              <div className="mt-6 flex items-center justify-between rounded-xl bg-offwhite p-4">
                <p className="text-xs text-slate">
                  {profile.verification_status === "rejected"
                    ? "Your last verification request was not approved. You can submit again."
                    : "Ready to earn a verified badge? Submit your profile for review."}
                </p>
                <SubmitVerificationButton profileId={profile.id} />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-dashed border-mist p-8 text-center">
            <p className="text-sm font-semibold text-navy dark:text-white">
              Career timeline, achievements, media & documents
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate">
              Dedicated editors for these sections are coming in the next
              phase. Your base profile is live at{" "}
              <Link
                href={`/profile/${profile.slug}`}
                className="font-medium text-teal hover:underline"
              >
                /profile/{profile.slug}
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
