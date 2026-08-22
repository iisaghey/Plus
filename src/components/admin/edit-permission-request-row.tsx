"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  X,
  HelpCircle,
  Loader2,
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { decideEditPermissionRequest } from "@/lib/actions/edit-permissions";
import { getSignedUrl } from "@/lib/supabase/upload";
import type { Enums } from "@/types/database.types";
import { useTranslation } from "@/i18n/language-provider";

export type EditRequestRowData = {
  id: string;
  profile_id: string;
  editor_id: string;
  editor_email: string | null;
  reason: string;
  fields_requested: string[];
  description: string | null;
  supporting_document_path: string | null;
  status: string;
  review_notes: string | null;
  created_at: string;
  profile_name: string;
  profile_slug: string;
  profile_photo: string | null;
};

export function EditPermissionRequestRow({ request }: { request: EditRequestRowData }) {
  const router = useRouter();
  const { t } = useTranslation();

  const GRANT_TYPES: { value: Enums<"edit_grant_type">; label: string }[] = [
    { value: "one_time", label: t("admin.editPermissionRequestRow.grantOneTime") },
    { value: "time_limited", label: t("admin.editPermissionRequestRow.grantTimeLimited") },
    { value: "full", label: t("admin.editPermissionRequestRow.grantFull") },
  ];

  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState("");
  const [approving, setApproving] = useState(false);
  const [grantType, setGrantType] = useState<Enums<"edit_grant_type">>("one_time");
  const [expiresAt, setExpiresAt] = useState("");
  const [fieldsOnly, setFieldsOnly] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(false);

  function decide(decision: "approve" | "reject" | "more_info") {
    startTransition(async () => {
      const result = await decideEditPermissionRequest(request.id, decision, {
        grantType: decision === "approve" ? grantType : undefined,
        allowedFields:
          decision === "approve" && fieldsOnly ? request.fields_requested : undefined,
        expiresAt:
          decision === "approve" && grantType === "time_limited" && expiresAt
            ? new Date(expiresAt).toISOString()
            : null,
        notes: notes || undefined,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        decision === "approve"
          ? t("admin.editPermissionRequestRow.permissionGranted")
          : decision === "reject"
            ? t("admin.editPermissionRequestRow.requestRejected")
            : t("admin.editPermissionRequestRow.moreInfoRequested")
      );
      router.refresh();
    });
  }

  async function viewDocument() {
    if (!request.supporting_document_path) return;
    setViewingDoc(true);
    try {
      const url = await getSignedUrl(
        "edit-request-documents",
        request.supporting_document_path
      );
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("admin.editPermissionRequestRow.couldNotOpenDocument"));
    } finally {
      setViewingDoc(false);
    }
  }

  return (
    <div className="rounded-xl border border-mist p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-mist">
            {request.profile_photo && (
              <Image
                src={request.profile_photo}
                alt={request.profile_name}
                width={44}
                height={44}
                className="h-full w-full object-contain"
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-navy dark:text-white">
                {request.profile_name}
              </p>
              <Link
                href={`/profile/${request.profile_slug}`}
                target="_blank"
                className="text-slate hover:text-teal"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="text-xs text-slate">
              {t("admin.editPermissionRequestRow.requestedBy")} {request.editor_email ?? t("admin.editPermissionRequestRow.editorFallback")} ·{" "}
              {new Date(request.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-teal"
        >
          {expanded ? t("admin.editPermissionRequestRow.hideDetails") : t("admin.editPermissionRequestRow.viewDetails")}
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-mist pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">{t("admin.editPermissionRequestRow.reason")}</p>
            <p className="mt-1 text-sm text-navy dark:text-white">{request.reason}</p>
          </div>
          {request.fields_requested.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                {t("admin.editPermissionRequestRow.fieldsRequested")}
              </p>
              <p className="mt-1 text-sm text-navy dark:text-white">
                {request.fields_requested.join(", ")}
              </p>
            </div>
          )}
          {request.description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                {t("admin.editPermissionRequestRow.descriptionOfChanges")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate">{request.description}</p>
            </div>
          )}
          {request.supporting_document_path && (
            <button
              onClick={viewDocument}
              disabled={viewingDoc}
              className="flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline disabled:opacity-50"
            >
              {viewingDoc ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              {t("admin.editPermissionRequestRow.viewSupportingDocument")}
            </button>
          )}
          {request.status === "more_info_requested" && request.review_notes && (
            <p className="rounded-lg bg-gold/10 px-3 py-2 text-xs text-navy dark:text-white">
              {t("admin.editPermissionRequestRow.youPreviouslyAsked")} &ldquo;{request.review_notes}&rdquo;
            </p>
          )}

          {approving && (
            <div className="rounded-lg border border-teal/30 bg-teal/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                {t("admin.editPermissionRequestRow.grantConfiguration")}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <select
                  value={grantType}
                  onChange={(e) => setGrantType(e.target.value as Enums<"edit_grant_type">)}
                  className="rounded-lg border border-mist bg-white dark:bg-offwhite px-3 py-1.5 text-xs focus:border-teal focus:outline-none"
                >
                  {GRANT_TYPES.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
                {grantType === "time_limited" && (
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="rounded-lg border border-mist px-3 py-1.5 text-xs focus:border-teal focus:outline-none"
                  />
                )}
                {request.fields_requested.length > 0 && (
                  <label className="flex items-center gap-1.5 text-xs text-navy dark:text-white">
                    <input
                      type="checkbox"
                      checked={fieldsOnly}
                      onChange={(e) => setFieldsOnly(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-mist text-teal focus:ring-teal"
                    />
                    {t("admin.editPermissionRequestRow.specificFieldsOnly")} ({request.fields_requested.join(", ")})
                  </label>
                )}
              </div>
            </div>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("admin.editPermissionRequestRow.notesPlaceholder")}
            rows={2}
            className="w-full rounded-lg border border-mist px-3 py-2 text-xs text-ink placeholder:text-slate focus:border-teal focus:outline-none"
          />

          <div className="flex flex-wrap gap-2">
            {approving ? (
              <button
                onClick={() => decide("approve")}
                disabled={pending}
                className="flex h-9 items-center gap-1.5 rounded-full bg-emerald/10 px-4 text-xs font-semibold text-emerald hover:bg-emerald/20 disabled:opacity-50"
              >
                {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {t("admin.editPermissionRequestRow.confirmGrant")}
              </button>
            ) : (
              <button
                onClick={() => setApproving(true)}
                disabled={pending}
                className="flex h-9 items-center gap-1.5 rounded-full bg-emerald/10 px-4 text-xs font-semibold text-emerald hover:bg-emerald/20 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                {t("admin.editPermissionRequestRow.approvePermission")}
              </button>
            )}
            <button
              onClick={() => decide("reject")}
              disabled={pending}
              className="flex h-9 items-center gap-1.5 rounded-full bg-red-50 px-4 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              {t("admin.editPermissionRequestRow.rejectRequest")}
            </button>
            <button
              onClick={() => decide("more_info")}
              disabled={pending}
              className="flex h-9 items-center gap-1.5 rounded-full bg-gold/10 px-4 text-xs font-semibold text-gold hover:bg-gold/20 disabled:opacity-50"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {t("admin.editPermissionRequestRow.requestMoreInformation")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
