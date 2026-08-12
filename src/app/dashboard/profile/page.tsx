import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProfile, updateProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: categories }, { data: organizations }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("categories").select("id, name").eq("status", "active").order("name"),
      supabase.from("organizations").select("id, name").eq("status", "active").order("name"),
    ]);

  const action = profile
    ? updateProfile.bind(null, profile.id)
    : createProfile;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-navy">
        {profile ? "Edit Your Profile" : "Create Your Profile"}
      </h1>
      <p className="mt-2 text-sm text-slate">
        {profile
          ? "Update your core identity details."
          : "Start with the essentials — you can add your career timeline, achievements, media, and documents from your dashboard afterward."}
      </p>

      <div className="mt-8">
        <ProfileForm
          action={action}
          profile={profile}
          categories={categories ?? []}
          organizations={organizations ?? []}
          submitLabel={profile ? "Save Changes" : "Create Profile"}
        />
      </div>
    </div>
  );
}
