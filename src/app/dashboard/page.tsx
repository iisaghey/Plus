import { redirect } from "next/navigation";
import { ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/profile/sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("slug, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-teal">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate">
            Signed in as
          </p>
          <p className="text-sm font-semibold text-navy">{user.email}</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-mist p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-heading text-xl font-bold text-navy">
          {profile
            ? `Welcome back, ${profile.full_name}`
            : "Your profile builder is coming next"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate">
          {profile
            ? "The full profile-editing dashboard — biography, timeline, achievements, media, and documents — is being built in the next phase."
            : "You're authenticated. The guided profile-creation wizard (biography, career timeline, achievements, media, and documents) is being built in the next phase."}
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <SignOutButton />
      </div>
    </div>
  );
}
