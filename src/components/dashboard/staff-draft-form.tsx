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
import { useTranslation } from "@/i18n/language-provider";

type Option = { id: string; name: string };

export function StaffDraftForm({
  action,
  triggerLabel,
}: {
  action: (state: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
  triggerLabel?: string;
}) {
  const { t } = useTranslation();
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
        {triggerLabel ?? t("dashboard.staffDraftForm.newDraft")}
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
                {t("dashboard.staffDraftForm.modalTitle")}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate hover:text-navy dark:hover:text-white"
                aria-label={t("common.close")}
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
                  label={t("dashboard.staffDraftForm.fullName")}
                  name="full_name"
                  required
                  value={fullName}
                  onChange={setFullName}
                />
                <TextField
                  label={t("dashboard.staffDraftForm.preferredTitle")}
                  name="preferred_title"
                  placeholder={t("dashboard.staffDraftForm.preferredTitlePlaceholder")}
                />
                <TextField label={t("dashboard.staffDraftForm.profession")} name="profession" />
                <TextField label={t("dashboard.staffDraftForm.currentPosition")} name="current_position" />
                <SelectField
                  label={t("dashboard.staffDraftForm.category")}
                  name="category_id"
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                />
                <SelectField
                  label={t("dashboard.staffDraftForm.organization")}
                  name="organization_id"
                  options={organizations.map((o) => ({ value: o.id, label: o.name }))}
                />
                <TextField label={t("dashboard.staffDraftForm.country")} name="country" />
                <TextField
                  label={t("dashboard.staffDraftForm.location")}
                  name="location"
                  placeholder={t("dashboard.staffDraftForm.locationPlaceholder")}
                />
                <TextField label={t("dashboard.staffDraftForm.nationality")} name="nationality" />
                <TextField label={t("dashboard.staffDraftForm.email")} name="email" type="email" />
                <TextField
                  label={t("dashboard.staffDraftForm.phone")}
                  name="phone"
                  type="tel"
                  placeholder={t("dashboard.staffDraftForm.phonePlaceholder")}
                />
                <TextField
                  label={t("dashboard.staffDraftForm.website")}
                  name="website"
                  type="url"
                  placeholder="https://"
                />
              </div>

              <SocialLinksFields socialLinks={{}} />

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  {t("dashboard.staffDraftForm.shortBio")}
                </label>
                <textarea
                  name="short_bio"
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
                  placeholder={t("dashboard.staffDraftForm.shortBioPlaceholder")}
                />
              </div>

              {userId ? (
                <div>
                  <ImageUploadField
                    name="photo_url"
                    label={t("dashboard.staffDraftForm.profilePhotoLabel")}
                    bucket="profile-photos"
                    profileId={userId}
                    onUploaded={setPhotoUrl}
                  />
                  {!photoUrl && (
                    <p className="mt-1.5 text-xs text-slate">
                      {t("dashboard.staffDraftForm.photoRequiredHint")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("dashboard.staffDraftForm.preparingUpload")}
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-mist pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate hover:bg-mist/60"
                >
                  {t("common.cancel")}
                </button>
                <Button type="submit" variant="primary" size="md" disabled={!canSubmit}>
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("dashboard.staffDraftForm.createProfileSubmit")}
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
  const { t } = useTranslation();
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
        <option value="">{t("dashboard.staffDraftForm.none")}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
