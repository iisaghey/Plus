"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/profile/image-upload-field";
import { SOCIAL_FIELDS } from "@/lib/social-fields";
import type { ProfileFormState } from "@/lib/actions/profile";
import type { Tables } from "@/types/database.types";
import { useTranslation } from "@/i18n/language-provider";

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
  const { t } = useTranslation();

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.errorCode ? t(`editorWorkspace.errors.${state.errorCode}`) : state.error}
        </div>
      )}

      <fieldset disabled={locked} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("editorWorkspace.profileForm.fullName")} name="full_name" required defaultValue={profile?.full_name} />
        <Field label={t("editorWorkspace.profileForm.preferredTitle")} name="preferred_title" placeholder={t("editorWorkspace.profileForm.preferredTitlePlaceholder")} defaultValue={profile?.preferred_title ?? ""} />
        <Field label={t("editorWorkspace.profileForm.profession")} name="profession" defaultValue={profile?.profession ?? ""} />
        <Field label={t("editorWorkspace.profileForm.currentPosition")} name="current_position" required defaultValue={profile?.current_position ?? ""} />

        <SelectField
          label={t("editorWorkspace.profileForm.category")}
          name="category_id"
          required
          defaultValue={profile?.category_id ?? ""}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SelectField
          label={t("editorWorkspace.profileForm.organization")}
          name="organization_id"
          defaultValue={profile?.organization_id ?? ""}
          options={organizations.map((o) => ({ value: o.id, label: o.name }))}
        />

        <Field label={t("editorWorkspace.profileForm.country")} name="country" defaultValue={profile?.country ?? ""} />
        <Field label={t("editorWorkspace.profileForm.location")} name="location" placeholder={t("editorWorkspace.profileForm.locationPlaceholder")} defaultValue={profile?.location ?? ""} />
        <Field label={t("editorWorkspace.profileForm.nationality")} name="nationality" defaultValue={profile?.nationality ?? ""} />
        <Field label={t("editorWorkspace.profileForm.email")} name="email" type="email" defaultValue={profile?.email ?? ""} />
        <Field label={t("editorWorkspace.profileForm.phone")} name="phone" type="tel" placeholder={t("editorWorkspace.profileForm.phonePlaceholder")} defaultValue={profile?.phone ?? ""} />
        <Field label={t("editorWorkspace.profileForm.website")} name="website" type="url" placeholder={t("editorWorkspace.profileForm.websitePlaceholder")} defaultValue={profile?.website ?? ""} />
      </div>

      <SocialLinksFields socialLinks={(profile?.social_links as Record<string, string> | null) ?? {}} />

      {profile ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageUploadField
            name="photo_url"
            label={t("editorWorkspace.profileForm.profilePhoto")}
            defaultValue={profile.photo_url}
            bucket="profile-photos"
            profileId={profile.id}
          />
          <ImageUploadField
            name="cover_url"
            label={t("editorWorkspace.profileForm.coverPhoto")}
            defaultValue={profile.cover_url}
            bucket="profile-photos"
            profileId={profile.id}
            shape="wide"
          />
        </div>
      ) : (
        <p className="rounded-xl bg-offwhite px-4 py-3 text-xs text-slate">
          {t("editorWorkspace.profileForm.photoHint")}
        </p>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">
          {t("editorWorkspace.profileForm.shortBio")}
        </label>
        <textarea
          name="short_bio"
          rows={4}
          defaultValue={profile?.short_bio ?? ""}
          className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
          placeholder={t("editorWorkspace.profileForm.shortBioPlaceholder")}
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

export function SocialLinksFields({ socialLinks }: { socialLinks: Record<string, string> }) {
  const { t } = useTranslation();
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">
        {t("editorWorkspace.profileForm.socialMediaLabel")}
      </label>
      <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-slate" />
            <input
              name={`social_${key}`}
              type="url"
              placeholder={placeholder}
              aria-label={label}
              defaultValue={socialLinks[key] ?? ""}
              className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
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
  required,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">
        {label}
        {required && <span className="text-teal"> *</span>}
      </label>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="mt-1.5 w-full rounded-xl border border-mist bg-white dark:bg-offwhite px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none invalid:text-slate"
      >
        <option value="" disabled={required}>
          {required
            ? t("editorWorkspace.profileForm.selectCategoryPlaceholder")
            : t("editorWorkspace.profileForm.noneOption")}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
