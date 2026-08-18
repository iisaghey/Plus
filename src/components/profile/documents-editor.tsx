"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, FileText, Pencil, Lock, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  updateDocument,
  deleteDocument,
  createDocumentFromUpload,
  type DocumentFormState,
} from "@/lib/actions/documents";
import { uploadPrivateFile } from "@/lib/supabase/upload";
import { MultiFileUpload, type UploadedFileMeta } from "@/components/profile/multi-file-upload";
import { FilePreviewCard, kindFromMimeType } from "@/components/profile/file-preview-card";
import { formatFileSize } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type Entry = Tables<"documents">;

export function DocumentsEditor({
  profileId,
  entries,
  locked = false,
}: {
  profileId: string;
  entries: Entry[];
  locked?: boolean;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleFileUploaded(file: UploadedFileMeta) {
    const result = await createDocumentFromUpload(profileId, {
      url: file.url ?? "",
      path: file.path,
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  function handleRemove(id: string) {
    setRemovingId(id);
    startTransition(async () => {
      const result = await deleteDocument(id, profileId);
      setRemovingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Document removed");
      router.refresh();
    });
  }

  function handleReplace(entry: Entry, file: File) {
    setReplacingId(entry.id);
    startTransition(async () => {
      try {
        const uploaded = await uploadPrivateFile("profile-documents", profileId, file);
        const formData = new FormData();
        formData.set("title", entry.title);
        formData.set("category", entry.category ?? "");
        formData.set("issuing_organization", entry.issuing_organization ?? "");
        formData.set("document_date", entry.document_date ?? "");
        formData.set("storage_path", uploaded.path);
        formData.set("is_private", entry.is_private ? "true" : "false");
        await updateDocument(entry.id, profileId, {}, formData);
        toast.success("File replaced");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Replace failed");
      } finally {
        setReplacingId(null);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-mist p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-teal" />
        <h2 className="font-heading text-base font-bold text-navy dark:text-white">Documents &amp; Records</h2>
      </div>
      <p className="mt-1 text-xs text-slate">
        PDFs, Word docs, scanned records, and images. Files are kept private by default.
      </p>

      {!locked && (
        <div className="mt-4">
          <MultiFileUpload
            bucket="profile-documents"
            folderId={profileId}
            isPrivate
            accept="application/pdf,.doc,.docx,image/*"
            label="Upload Documents & Records"
            onFileUploaded={handleFileUploaded}
          />
        </div>
      )}

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate">No documents added yet.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {entries.map((entry) =>
            editingId === entry.id ? (
              <div key={entry.id} className="col-span-2 sm:col-span-3">
                <DocumentMetaForm
                  profileId={profileId}
                  entry={entry}
                  onCancel={() => setEditingId(null)}
                  onDone={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                />
              </div>
            ) : (
              <FilePreviewCard
                key={entry.id}
                path={entry.storage_path}
                bucket="profile-documents"
                fileName={entry.file_name ?? entry.title}
                fileSize={formatFileSize(entry.file_size)}
                kind={entry.mime_type ? kindFromMimeType(entry.mime_type) : "document"}
                removing={pending && removingId === entry.id}
                onRemove={() => handleRemove(entry.id)}
                onReplace={locked ? undefined : (file) => handleReplace(entry, file)}
              >
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  {entry.is_private ? (
                    <Lock className="h-3 w-3 shrink-0 text-slate" />
                  ) : (
                    <Globe className="h-3 w-3 shrink-0 text-teal" />
                  )}
                  {!locked && (
                    <button
                      type="button"
                      onClick={() => setEditingId(entry.id)}
                      disabled={pending && replacingId === entry.id}
                      className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-teal hover:underline disabled:opacity-50"
                    >
                      <Pencil className="h-3 w-3" />
                      Details
                    </button>
                  )}
                </div>
              </FilePreviewCard>
            )
          )}
        </div>
      )}
    </div>
  );
}

function DocumentMetaForm({
  profileId,
  entry,
  onCancel,
  onDone,
}: {
  profileId: string;
  entry: Entry;
  onCancel: () => void;
  onDone: () => void;
}) {
  const action = updateDocument.bind(null, entry.id, profileId);
  const [state, formAction, pending] = useActionState<DocumentFormState, FormData>(action, {});
  const [isPrivate, setIsPrivate] = useState(entry.is_private ?? true);

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="rounded-xl border border-teal/30 bg-offwhite p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">Document Details</p>
        <button type="button" onClick={onCancel} className="text-slate hover:text-navy dark:hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}

      <input type="hidden" name="storage_path" value={entry.storage_path ?? ""} />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Title" name="title" required defaultValue={entry.title} />
        <Field label="Category" name="category" defaultValue={entry.category ?? ""} />
        <Field
          label="Issuing Organization"
          name="issuing_organization"
          defaultValue={entry.issuing_organization ?? ""}
        />
        <Field label="Date" name="document_date" type="date" defaultValue={entry.document_date ?? ""} />
      </div>

      <input type="hidden" name="is_private" value={isPrivate ? "true" : "false"} />
      <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-mist text-teal focus:ring-teal"
        />
        Keep private (only visible to you and staff)
      </label>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-xs font-semibold text-slate hover:bg-mist/60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-aqoonsi disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save Details
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
        defaultValue={defaultValue ?? ""}
        className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
      />
    </div>
  );
}
