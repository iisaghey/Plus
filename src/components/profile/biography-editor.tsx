"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, BookOpen, Check } from "lucide-react";
import { toast } from "sonner";
import { saveBiography, type BiographyFormState } from "@/lib/actions/biography";
import type { Tables } from "@/types/database.types";

export function BiographyEditor({
  profileId,
  biography,
}: {
  profileId: string;
  biography: Tables<"biographies"> | null;
}) {
  const action = saveBiography.bind(null, profileId);
  const [state, formAction, pending] = useActionState<BiographyFormState, FormData>(
    action,
    {}
  );
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("Biography saved");
      setJustSaved(true);
      const timer = setTimeout(() => setJustSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <div className="rounded-2xl border border-mist p-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-teal" />
        <h2 className="font-heading text-base font-bold text-navy">Biography</h2>
      </div>
      <p className="mt-1 text-xs text-slate">
        A longer-form biography shown on the Biography tab of the public profile.
      </p>

      <form action={formAction} className="mt-4 space-y-3">
        {state.error && (
          <p className="text-xs text-red-600">{state.error}</p>
        )}

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            Summary
          </label>
          <textarea
            name="summary"
            rows={2}
            defaultValue={biography?.summary ?? ""}
            placeholder="A short summary shown at the top of the Biography tab…"
            className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            Full Biography
          </label>
          <textarea
            name="content"
            rows={8}
            defaultValue={biography?.content ?? ""}
            placeholder="Write the full biography…"
            className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-aqoonsi disabled:opacity-50"
          >
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {justSaved && !pending && <Check className="h-3.5 w-3.5" />}
            Save Biography
          </button>
        </div>
      </form>
    </div>
  );
}
