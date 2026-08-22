"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Hourglass, CheckCircle2, HelpCircle, X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";
import {
  requestEditPermission,
  type EditRequestFormState,
} from "@/lib/actions/edit-permissions";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/i18n/language-provider";

function useRequestableFields() {
  const { t } = useTranslation();
  return [
    { key: "full_name", label: t("editorWorkspace.permissionGate.fieldFullName") },
    { key: "profession", label: t("editorWorkspace.permissionGate.fieldProfession") },
    { key: "short_bio", label: t("editorWorkspace.permissionGate.fieldBio") },
    { key: "photo_url", label: t("editorWorkspace.permissionGate.fieldPhoto") },
    { key: "career_timeline", label: t("editorWorkspace.permissionGate.fieldCareerTimeline") },
    { key: "achievements", label: t("editorWorkspace.permissionGate.fieldAchievements") },
    { key: "media", label: t("editorWorkspace.permissionGate.fieldMedia") },
    { key: "documents", label: t("editorWorkspace.permissionGate.fieldDocuments") },
  ];
}

export type GrantInfo = {
  grantType: "one_time" | "time_limited" | "full";
  expiresAt: string | null;
  allowedFields: string[] | null;
};

export type PendingRequestInfo = {
  status: "pending" | "more_info_requested";
  reviewNotes: string | null;
};

export function EditPermissionGate({
  profileId,
  profileName,
  locked,
  grant,
  pendingRequest,
}: {
  profileId: string;
  profileName: string;
  locked: boolean;
  grant: GrantInfo | null;
  pendingRequest: PendingRequestInfo | null;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const { t } = useTranslation();

  if (grant) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald/30 bg-emerald/5 px-4 py-3 text-sm text-navy dark:text-white">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
        <div>
          <p className="font-semibold">{t("editorWorkspace.permissionGate.grantedTitle")}</p>
          <p className="mt-0.5 text-xs text-slate">
            {grant.grantType === "one_time" && t("editorWorkspace.permissionGate.grantOneTime")}
            {grant.grantType === "full" && t("editorWorkspace.permissionGate.grantFull")}
            {grant.grantType === "time_limited" &&
              (grant.expiresAt
                ? t("editorWorkspace.permissionGate.grantExpiresMessage").replace(
                    "{date}",
                    new Date(grant.expiresAt).toLocaleString()
                  )
                : t("editorWorkspace.permissionGate.grantTimeLimitedNoDate"))}
            {grant.allowedFields && grant.allowedFields.length > 0 && (
              <>
                {" "}
                {t("editorWorkspace.permissionGate.restrictedToMessage").replace(
                  "{fields}",
                  grant.allowedFields.join(", ")
                )}
              </>
            )}
            {" "}
            {t("editorWorkspace.permissionGate.grantReviewNotice")}
          </p>
        </div>
      </div>
    );
  }

  if (pendingRequest?.status === "pending") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-navy dark:text-white">
        <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <div>
          <p className="font-semibold">{t("editorWorkspace.permissionGate.pendingTitle")}</p>
          <p className="mt-0.5 text-xs text-slate">
            {t("editorWorkspace.permissionGate.pendingMessage").replace("{name}", profileName)}
          </p>
        </div>
      </div>
    );
  }

  if (!locked) return null;

  return (
    <>
      <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-mist bg-offwhite px-4 py-3 text-sm">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
          <div>
            <p className="font-semibold text-navy dark:text-white">
              {t("editorWorkspace.permissionGate.lockedTitle")}
            </p>
            <p className="mt-0.5 text-xs text-slate">
              {t("editorWorkspace.permissionGate.lockedMessage")}
            </p>
            {pendingRequest?.status === "more_info_requested" && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-gold">
                <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t("editorWorkspace.permissionGate.moreInfoRequested")}
                {pendingRequest.reviewNotes ? `: "${pendingRequest.reviewNotes}"` : "."}{" "}
                {t("editorWorkspace.permissionGate.moreInfoSuffix")}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="shrink-0 rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-aqoonsi"
        >
          {t("editorWorkspace.permissionGate.requestButton")}
        </button>
      </div>

      <RequestForm
        profileId={profileId}
        profileName={profileName}
        open={formOpen}
        onClose={() => setFormOpen(false)}
      />
    </>
  );
}

function RequestForm({
  profileId,
  profileName,
  open,
  onClose,
}: {
  profileId: string;
  profileName: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const requestableFields = useRequestableFields();
  const action = requestEditPermission.bind(null, profileId);
  const [state, formAction, pending] = useActionState<EditRequestFormState, FormData>(
    action,
    {}
  );
  const [uploading, setUploading] = useState(false);
  const [documentPath, setDocumentPath] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(t("editorWorkspace.permissionGate.requestSubmittedToast"));
      onClose();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error(t("editorWorkspace.permissionGate.notSignedIn"));
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("edit-request-documents")
        .upload(path, file);
      if (error) throw error;
      setDocumentPath(path);
      toast.success(t("editorWorkspace.permissionGate.documentAttachedToast"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("editorWorkspace.permissionGate.uploadFailedFallback")
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE }}
        >
          <motion.div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-offwhite p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: DURATION.base, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-navy dark:text-white">
                {t("editorWorkspace.permissionGate.modalTitle")}
              </h3>
              <button onClick={onClose} className="text-slate hover:text-navy dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {state.error && (
              <p className="mt-3 text-sm text-red-600">
                {state.errorCode ? t(`editorWorkspace.errors.${state.errorCode}`) : state.error}
              </p>
            )}

            <form action={formAction} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  {t("editorWorkspace.permissionGate.profileNameLabel")}
                </label>
                <input
                  disabled
                  value={profileName}
                  className="mt-1.5 w-full rounded-lg border border-mist bg-mist/30 px-3 py-2 text-sm text-slate"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  {t("editorWorkspace.permissionGate.reasonLabel")} <span className="text-teal">*</span>
                </label>
                <textarea
                  name="reason"
                  required
                  rows={2}
                  placeholder={t("editorWorkspace.permissionGate.reasonPlaceholder")}
                  className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  {t("editorWorkspace.permissionGate.fieldsLabel")}
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                  {requestableFields.map((f) => (
                    <label key={f.key} className="flex items-center gap-1.5 text-xs text-navy dark:text-white">
                      <input
                        type="checkbox"
                        name="fields_requested"
                        value={f.key}
                        className="h-3.5 w-3.5 rounded border-mist text-teal focus:ring-teal"
                      />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  {t("editorWorkspace.permissionGate.descriptionLabel")}
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder={t("editorWorkspace.permissionGate.descriptionPlaceholder")}
                  className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  {t("editorWorkspace.permissionGate.documentLabel")}
                </label>
                <input type="hidden" name="supporting_document_path" value={documentPath} />
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-navy hover:border-teal disabled:opacity-50 dark:text-white"
                  >
                    {uploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    {documentPath
                      ? t("editorWorkspace.permissionGate.replaceFile")
                      : t("editorWorkspace.permissionGate.uploadFile")}
                  </button>
                  {documentPath && (
                    <span className="text-xs text-emerald">
                      {t("editorWorkspace.permissionGate.attached")}
                    </span>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  onChange={handleFile}
                  className="hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-slate hover:bg-mist/60"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={pending || uploading}
                  className="flex items-center gap-1.5 rounded-full bg-teal px-5 py-2 text-xs font-semibold text-white hover:bg-aqoonsi disabled:opacity-50"
                >
                  {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {t("editorWorkspace.permissionGate.submitRequest")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
