"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, Mic, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import {
  createSpeech,
  updateSpeech,
  deleteSpeech,
  type SpeechFormState,
} from "@/lib/actions/speeches";
import {
  createSpeechAttachment,
  deleteSpeechAttachment,
} from "@/lib/actions/speech-attachments";
import { MultiFileUpload, type UploadedFileMeta } from "@/components/profile/multi-file-upload";
import { FilePreviewCard, type FileKind } from "@/components/profile/file-preview-card";
import { formatFileSize, formatMonthYear } from "@/lib/utils";
import { useTranslation } from "@/i18n/language-provider";
import type { Tables } from "@/types/database.types";

type Attachment = Tables<"speech_attachments">;
type Entry = Tables<"speeches"> & { speech_attachments: Attachment[] };

const ATTACHMENT_KIND: Record<Attachment["file_type"], FileKind> = {
  video: "video",
  photo: "photo",
  audio: "audio",
  document: "document",
};

export function SpeechesEditor({
  profileId,
  entries,
  locked = false,
}: {
  profileId: string;
  entries: Entry[];
  locked?: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [removingAttachmentId, setRemovingAttachmentId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteSpeech(id, profileId);
      setDeletingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t("editorForms.speeches.toasts.deleted"));
      router.refresh();
    });
  }

  function handleDone() {
    setEditingId(null);
    router.refresh();
  }

  async function handleAttachmentUploaded(speechId: string, file: UploadedFileMeta) {
    const result = await createSpeechAttachment(speechId, profileId, {
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

  function handleRemoveAttachment(attachmentId: string) {
    setRemovingAttachmentId(attachmentId);
    startTransition(async () => {
      const result = await deleteSpeechAttachment(attachmentId, profileId);
      setRemovingAttachmentId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-mist p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-teal" />
          <h2 className="font-heading text-base font-bold text-navy dark:text-white">
            {t("editorForms.speeches.heading")}
          </h2>
        </div>
        {editingId === null && !locked && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/20"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("editorForms.speeches.addButton")}
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {editingId === "new" && (
          <SpeechForm profileId={profileId} onCancel={() => setEditingId(null)} onDone={handleDone} />
        )}

        {entries.length === 0 && editingId !== "new" && (
          <p className="py-6 text-center text-sm text-slate">{t("editorForms.speeches.emptyState")}</p>
        )}

        {entries.map((entry) =>
          editingId === entry.id ? (
            <SpeechForm
              key={entry.id}
              profileId={profileId}
              entry={entry}
              onCancel={() => setEditingId(null)}
              onDone={handleDone}
            />
          ) : (
            <div key={entry.id} className="rounded-xl border border-mist p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-sm font-semibold text-navy dark:text-white">{entry.title}</p>
                    {entry.speech_date && (
                      <p className="text-xs text-slate">{formatMonthYear(entry.speech_date)}</p>
                    )}
                  </div>
                  {(entry.event || entry.location) && (
                    <p className="text-xs text-slate">
                      {[entry.event, entry.location].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {entry.summary && (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate">{entry.summary}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setEditingId(entry.id)}
                    disabled={locked}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate hover:bg-offwhite hover:text-navy dark:hover:text-white disabled:pointer-events-none disabled:opacity-40"
                    aria-label={t("common.edit")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={locked || (pending && deletingId === entry.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label={t("common.delete")}
                  >
                    {pending && deletingId === entry.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
              >
                {expandedId === entry.id ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
                {t("editorForms.speeches.attachmentsButton")}
                {entry.speech_attachments.length > 0 && ` (${entry.speech_attachments.length})`}
              </button>

              {expandedId === entry.id && (
                <div className="mt-3 border-t border-mist pt-3">
                  {!locked && (
                    <MultiFileUpload
                      bucket="profile-media"
                      folderId={profileId}
                      accept="video/*,image/*,audio/*,application/pdf,.doc,.docx"
                      label={t("editorForms.speeches.uploadLabel")}
                      hint={t("editorForms.speeches.uploadHint")}
                      onFileUploaded={(file) => handleAttachmentUploaded(entry.id, file)}
                    />
                  )}
                  {entry.speech_attachments.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {entry.speech_attachments.map((attachment) => (
                        <FilePreviewCard
                          key={attachment.id}
                          path={attachment.storage_path}
                          bucket="profile-media"
                          fileName={attachment.file_name}
                          fileSize={formatFileSize(attachment.file_size)}
                          kind={ATTACHMENT_KIND[attachment.file_type]}
                          removing={pending && removingAttachmentId === attachment.id}
                          onRemove={() => handleRemoveAttachment(attachment.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function SpeechForm({
  profileId,
  entry,
  onCancel,
  onDone,
}: {
  profileId: string;
  entry?: Entry;
  onCancel: () => void;
  onDone: () => void;
}) {
  const action = entry
    ? updateSpeech.bind(null, entry.id, profileId)
    : createSpeech.bind(null, profileId);

  const { t } = useTranslation();
  const [state, formAction, pending] = useActionState<SpeechFormState, FormData>(action, {});

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  const errorMessage = state.errorCode
    ? t(`editorForms.speeches.errors.${state.errorCode}`)
    : state.error;

  return (
    <form action={formAction} className="rounded-xl border border-teal/30 bg-offwhite p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">
          {entry ? t("editorForms.speeches.editHeading") : t("editorForms.speeches.newHeading")}
        </p>
        <button type="button" onClick={onCancel} className="text-slate hover:text-navy dark:hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {errorMessage && <p className="mt-2 text-xs text-red-600">{errorMessage}</p>}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t("editorForms.speeches.fields.title")} name="title" required defaultValue={entry?.title} />
        <Field label={t("editorForms.speeches.fields.event")} name="event" defaultValue={entry?.event ?? ""} />
        <Field label={t("editorForms.speeches.fields.location")} name="location" defaultValue={entry?.location ?? ""} />
        <Field label={t("editorForms.speeches.fields.date")} name="speech_date" type="date" defaultValue={entry?.speech_date ?? ""} />
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">{t("editorForms.speeches.fields.summary")}</label>
        <textarea
          name="summary"
          rows={2}
          defaultValue={entry?.summary ?? ""}
          className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">{t("editorForms.speeches.fields.fullText")}</label>
        <textarea
          name="full_text"
          rows={4}
          defaultValue={entry?.full_text ?? ""}
          className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      {!entry && (
        <p className="mt-3 text-xs text-slate">
          {t("editorForms.speeches.saveFirstHint")}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-xs font-semibold text-slate hover:bg-mist/60"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-aqoonsi disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {entry ? t("editorForms.speeches.saveChangesButton") : t("editorForms.speeches.addButton")}
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
