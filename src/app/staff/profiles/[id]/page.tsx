import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { SubmitReviewButton } from "@/components/dashboard/submit-review-button";
import { Badge } from "@/components/ui/badge";

export default async function StaffEditProfilePage(
  props: PageProps<"/staff/profiles/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: categories }, { data: organizations }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
      supabase.from("categories").select("id, name").eq("status", "active").order("name"),
      supabase.from("organizations").select("id, name").eq("status", "active").order("name"),
    ]);

  if (!profile) notFound();

  const action = updateProfile.bind(null, profile.id, `/staff/profiles/${profile.id}`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <h1 className="font-heading text-2xl font-bold text-navy">
          {profile.full_name}
        </h1>
        <Badge variant="neutral" size="sm">
          {profile.workflow_status.replace(/_/g, " ")}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-slate">
        Edit the profile, then submit it for editorial review when ready.
      </p>

      <div className="mt-8">
        <ProfileForm
          action={action}
          profile={profile}
          categories={categories ?? []}
          organizations={organizations ?? []}
          submitLabel="Save Changes"
        />
      </div>

      {["draft", "in_progress", "changes_required"].includes(
        profile.workflow_status
      ) && (
        <div className="mt-6 flex items-center justify-between rounded-xl bg-offwhite p-4">
          <p className="text-xs text-slate">
            Ready for editorial review? This sends it to the assigned editor.
          </p>
          <SubmitReviewButton profileId={profile.id} redirectTo="/staff" />
        </div>
      )}
    </div>
  );
}
