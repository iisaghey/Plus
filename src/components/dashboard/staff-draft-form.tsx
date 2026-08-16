"use client";

import { useActionState, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProfileFormState } from "@/lib/actions/profile";

export function StaffDraftForm({
  action,
  triggerLabel = "New Draft",
}: {
  action: (state: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    action,
    {}
  );

  if (!open) {
    return (
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        {triggerLabel}
      </Button>
    );
  }

  return (
    <div className="w-full max-w-xs rounded-xl border border-mist bg-white dark:bg-offwhite p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-navy dark:text-white">New Profile Draft</p>
        <button onClick={() => setOpen(false)} className="text-slate hover:text-navy dark:hover:text-white">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
      <form action={formAction} className="mt-2 flex gap-2">
        <input
          name="full_name"
          required
          placeholder="Full name"
          className="w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-teal focus:outline-none"
        />
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create"}
        </Button>
      </form>
    </div>
  );
}
