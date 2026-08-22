"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/language-provider";

export default function CreateProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.session) {
      toast.success(t("profilesPublic.createProfile.accountCreatedToast"));
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setConfirmationSent(true);
  }

  if (confirmationSent) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald/10 text-emerald">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy dark:text-white">
          {t("profilesPublic.createProfile.checkEmailHeading")}
        </h1>
        <p className="mt-2 text-sm text-slate">
          {t("profilesPublic.createProfile.checkEmailMessagePrefix")}{" "}
          <strong>{email}</strong>. {t("profilesPublic.createProfile.checkEmailMessageSuffix")}
        </p>
        <Link href="/login" className="mt-6 text-sm font-semibold text-teal hover:underline">
          {t("profilesPublic.createProfile.backToSignIn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/5 text-teal">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy dark:text-white">
          {t("profilesPublic.createProfile.heading")}
        </h1>
        <p className="mt-2 text-sm text-slate">
          {t("profilesPublic.createProfile.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            {t("profilesPublic.createProfile.fullNameLabel")}
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
            placeholder={t("profilesPublic.createProfile.fullNamePlaceholder")}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            {t("auth.email")}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            {t("auth.password")}
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
            placeholder={t("profilesPublic.createProfile.passwordPlaceholder")}
          />
        </div>

        <Button type="submit" variant="primary" size="md" disabled={loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("profilesPublic.createProfile.submitButton")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        {t("profilesPublic.createProfile.alreadyHaveProfile")}{" "}
        <Link href="/login" className="font-semibold text-teal hover:underline">
          {t("profilesPublic.createProfile.signInLink")}
        </Link>
      </p>
    </div>
  );
}
