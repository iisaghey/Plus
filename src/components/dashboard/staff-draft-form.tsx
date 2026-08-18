"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/profile/image-upload-field";
import { SocialLinksFields } from "@/components/profile/profile-form";
import { createClient } from "@/lib/supabase/client";
import { DURATION, EASE } from "@/lib/motion";
import type { ProfileFormState } from "@/lib/actions/profile";

type Option = { id: string; name: string };

export function StaffDraftForm({
  action,
  triggerLabel = "New Draft",
}: {
  action: (state: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Option[]>([]);
  const [organizations, setOrganizations] = useState<Option[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    supabase
      .from("categories")
      .select("id, name")
      .eq("status", "active")
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
    supabase
      .from("organizations")
      .select("id, name")
      .eq("status", "active")
      .order("name")
      .then(({ data }) => setOrganizations(data ?? []));
  }, [open]);

  const canSubmit = fullName.trim().length > 0 && photoUrl.length > 0 && !pending;

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        {triggerLabel}
      </Button>

      <AnimatePresence>
        {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE }}
        >
          <motion.div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-offwhite p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: DURATION.base, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-navy dark:text-white">
                Create New Profile
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate hover:text-navy dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {state.error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <form action={formAction} className="mt-4 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  label="Full Name"
                  name="full_name"
                  required
                  value={fullName}
                  onChange={setFullName}
                />
                <TextField label="Preferred Title" name="preferred_title" placeholder="Dr., Eng., Hon..." />
                <TextField label="Profession" name="profession" />
                <TextField label="Current Position" name="current_position" />
                <SelectField
                  label="Category"
                  name="category_id"
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                />
                <SelectField
                  label="Organization"
                  name="organization_id"
                  options={organizations.map((o) => ({ value: o.id, label: o.name }))}
                />
                <TextField label="Country" name="country" />
                <TextField label="Location" name="location" placeholder="City, Country" />
                <TextField label="Nationality" name="nationality" />
                <TextField label="Email" name="email" type="email" />
                <TextField label="Phone" name="phone" type="tel" placeholder="+252..." />
                <TextField label="Website" name="website" type="url" placeholder="https://" />
              </div>

              <SocialLinksFields socialLinks={{}} />

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  Short Biography
                </label>
                <textarea
                  name="short_bio"
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
                  placeholder="A brief summary that appears on the profile card…"
                />
              </div>

              {userId ? (
                <div>
                  <ImageUploadField
                    name="photo_url"
                    label="Profile Photo *"
                    bucket="profile-photos"
                    profileId={userId}
                    onUploaded={setPhotoUrl}
                  />
                  {!photoUrl && (
                    <p className="mt-1.5 text-xs text-slate">
                      A profile photo is required to create the profile.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Preparing photo upload…
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-mist pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate hover:bg-mist/60"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="md" disabled={!canSubmit}>
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Profile
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TextField({
  label,
  name,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">
        {label}
        {required && <span className="text-teal"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={onChange ? value : undefined}
        defaultValue={onChange ? undefined : ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">
        {label}
      </label>
      <select
        name={name}
        defaultValue=""
        className="mt-1.5 w-full rounded-xl border border-mist bg-white dark:bg-offwhite px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
      >
        <option value="">None</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
