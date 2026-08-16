"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/profile/image-upload-field";
import type { ProfileFormState } from "@/lib/actions/profile";
import type { Tables } from "@/types/database.types";

type Action = (
  state: ProfileFormState,
  formData: FormData
) => Promise<ProfileFormState>;

export function ProfileForm({
  action,
  profile,
  categories,
  organizations,
  submitLabel,
  locked = false,
}: {
  action: Action;
  profile?: Tables<"profiles"> | null;
  categories: { id: string; name: string }[];
  organizations: { id: string; name: string }[];
  submitLabel: string;
  locked?: boolean;
}) {
  const [state, formAction, pending] = useActionState<
    ProfileFormState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <fieldset disabled={locked} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="full_name" required defaultValue={profile?.full_name} />
        <Field label="Preferred Title" name="preferred_title" placeholder="Dr., Eng., Hon..." defaultValue={profile?.preferred_title ?? ""} />
        <Field label="Profession" name="profession" defaultValue={profile?.profession ?? ""} />
        <Field label="Current Position" name="current_position" defaultValue={profile?.current_position ?? ""} />

        <SelectField
          label="Category"
          name="category_id"
          defaultValue={profile?.category_id ?? ""}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SelectField
          label="Organization"
          name="organization_id"
          defaultValue={profile?.organization_id ?? ""}
          options={organizations.map((o) => ({ value: o.id, label: o.name }))}
        />

        <Field label="Country" name="country" defaultValue={profile?.country ?? ""} />
        <Field label="Location" name="location" placeholder="City, Country" defaultValue={profile?.location ?? ""} />
        <Field label="Nationality" name="nationality" defaultValue={profile?.nationality ?? ""} />
        <Field label="Email" name="email" type="email" defaultValue={profile?.email ?? ""} />
        <Field label="Website" name="website" type="url" placeholder="https://" defaultValue={profile?.website ?? ""} />
      </div>

      {profile ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageUploadField
            name="photo_url"
            label="Profile Photo"
            defaultValue={profile.photo_url}
            bucket="profile-photos"
            profileId={profile.id}
          />
          <ImageUploadField
            name="cover_url"
            label="Cover Photo"
            defaultValue={profile.cover_url}
            bucket="profile-photos"
            profileId={profile.id}
            shape="wide"
          />
        </div>
      ) : (
        <p className="rounded-xl bg-offwhite px-4 py-3 text-xs text-slate">
          You can add a profile photo and cover image after creating your
          profile.
        </p>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">
          Short Biography
        </label>
        <textarea
          name="short_bio"
          rows={4}
          defaultValue={profile?.short_bio ?? ""}
          className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
          placeholder="A brief summary that appears on your public profile card…"
        />
      </div>

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
      </fieldset>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | null;
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
        defaultValue={defaultValue ?? ""}
        className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
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
