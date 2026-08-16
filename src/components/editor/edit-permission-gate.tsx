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

const REQUESTABLE_FIELDS = [
  { key: "full_name", label: "Name & Title" },
  { key: "profession", label: "Profession / Position" },
  { key: "short_bio", label: "Biography" },
  { key: "photo_url", label: "Photo / Cover" },
  { key: "career_timeline", label: "Career Timeline" },
  { key: "achievements", label: "Achievements" },
  { key: "media", label: "Media" },
  { key: "documents", label: "Documents" },
];

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

  if (grant) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald/30 bg-emerald/5 px-4 py-3 text-sm text-navy dark:text-white">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
        <div>
          <p className="font-semibold">Edit Permission Granted</p>
          <p className="mt-0.5 text-xs text-slate">
            {grant.grantType === "one_time" && "One-time edit — this window closes after your next save."}
            {grant.grantType === "full" && "Full profile editing until revoked."}
            {grant.grantType === "time_limited" &&
              (grant.expiresAt
                ? `Permission expires: ${new Date(grant.expiresAt).toLocaleString()}`
                : "Time-limited access.")}
            {grant.allowedFields && grant.allowedFields.length > 0 && (
              <> Restricted to: {grant.allowedFields.join(", ")}.</>
            )}
            {" "}Your changes will need Super Admin/Admin review before going live again.
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
          <p className="font-semibold">Permission Pending</p>
          <p className="mt-0.5 text-xs text-slate">
            Your edit request for {profileName} is awaiting Super Admin review. You can&apos;t
            edit this profile until it&apos;s approved.
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
            <p className="font-semibold text-navy dark:text-white">Editing Locked</p>
            <p className="mt-0.5 text-xs text-slate">
              This profile is currently published. You need Super Admin permission to edit
              this profile.
            </p>
            {pendingRequest?.status === "more_info_requested" && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-gold">
                <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Super Admin asked for more information
                {pendingRequest.reviewNotes ? `: "${pendingRequest.reviewNotes}"` : "."} Please
                submit a new request with the details.
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="shrink-0 rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-aqoonsi"
        >
          Request Edit Permission
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
      toast.success("Edit permission request submitted");
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
      if (!user) throw new Error("Not signed in");
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("edit-request-documents")
        .upload(path, file);
      if (error) throw error;
      setDocumentPath(path);
      toast.success("Document attached");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
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
                Request Edit Permission
              </h3>
              <button onClick={onClose} className="text-slate hover:text-navy dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {state.error && (
              <p className="mt-3 text-sm text-red-600">{state.error}</p>
            )}

            <form action={formAction} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  Profile Name
                </label>
                <input
                  disabled
                  value={profileName}
                  className="mt-1.5 w-full rounded-lg border border-mist bg-mist/30 px-3 py-2 text-sm text-slate"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  Reason for Editing <span className="text-teal">*</span>
                </label>
                <textarea
                  name="reason"
                  required
                  rows={2}
                  placeholder="Why does this published profile need a change?"
                  className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  Fields That Need Changes
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                  {REQUESTABLE_FIELDS.map((f) => (
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
                  Description of Requested Changes
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe exactly what should change…"
                  className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                  Supporting Document (optional)
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
                    {documentPath ? "Replace File" : "Upload File"}
                  </button>
                  {documentPath && (
                    <span className="text-xs text-emerald">Attached</span>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending || uploading}
                  className="flex items-center gap-1.5 rounded-full bg-teal px-5 py-2 text-xs font-semibold text-white hover:bg-aqoonsi disabled:opacity-50"
                >
                  {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
