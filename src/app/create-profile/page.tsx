"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function CreateProfilePage() {
  const router = useRouter();
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
      toast.success("Account created — let's build your profile.");
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
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy">
          Check Your Email
        </h1>
        <p className="mt-2 text-sm text-slate">
          We sent a confirmation link to <strong>{email}</strong>. Confirm
          your account to start building your digital profile.
        </p>
        <Link href="/login" className="mt-6 text-sm font-semibold text-teal hover:underline">
          Back to Sign In
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
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy">
          Create Your Profile
        </h1>
        <p className="mt-2 text-sm text-slate">
          Start building your verified digital legacy on AqoonsiPlus.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            Email
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
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
            placeholder="At least 8 characters"
          />
        </div>

        <Button type="submit" variant="primary" size="md" disabled={loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Profile
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Already have a profile?{" "}
        <Link href="/login" className="font-semibold text-teal hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
