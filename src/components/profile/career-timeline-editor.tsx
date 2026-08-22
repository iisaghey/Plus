"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
  createCareerEntry,
  updateCareerEntry,
  deleteCareerEntry,
  type CareerEntryFormState,
} from "@/lib/actions/career-timeline";
import { formatDateRange } from "@/lib/utils";
import { useTranslation } from "@/i18n/language-provider";
import type { Tables } from "@/types/database.types";

type Entry = Tables<"career_timeline">;

export function CareerTimelineEditor({
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
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteCareerEntry(id, profileId);
      setDeletingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t("editorForms.careerTimeline.toasts.deleted"));
      router.refresh();
    });
  }

  function handleDone() {
    setEditingId(null);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-mist p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-teal" />
          <h2 className="font-heading text-base font-bold text-navy dark:text-white">
            {t("editorForms.careerTimeline.heading")}
          </h2>
        </div>
        {editingId === null && !locked && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/20"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("editorForms.careerTimeline.addButton")}
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {editingId === "new" && (
          <CareerEntryForm
            profileId={profileId}
            onCancel={() => setEditingId(null)}
            onDone={handleDone}
          />
        )}

        {entries.length === 0 && editingId !== "new" && (
          <p className="py-6 text-center text-sm text-slate">
            {t("editorForms.careerTimeline.emptyState")}
          </p>
        )}

        {entries.map((entry) =>
          editingId === entry.id ? (
            <CareerEntryForm
              key={entry.id}
              profileId={profileId}
              entry={entry}
              onCancel={() => setEditingId(null)}
              onDone={handleDone}
            />
          ) : (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-mist p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="text-sm font-semibold text-navy dark:text-white">
                    {entry.title}
                  </p>
                  <p className="text-xs text-slate">
                    {formatDateRange(entry.start_date, entry.end_date, entry.is_current)}
                  </p>
                </div>
                {(entry.organization || entry.location) && (
                  <p className="text-xs text-slate">
                    {[entry.organization, entry.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {entry.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">
                    {entry.description}
                  </p>
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
          )
        )}
      </div>
    </div>
  );
}

function CareerEntryForm({
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
    ? updateCareerEntry.bind(null, entry.id, profileId)
    : createCareerEntry.bind(null, profileId);

  const { t } = useTranslation();
  const [state, formAction, pending] = useActionState<
    CareerEntryFormState,
    FormData
  >(action, {});
  const [isCurrent, setIsCurrent] = useState(entry?.is_current ?? false);

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  const errorMessage = state.errorCode
    ? t(`editorForms.careerTimeline.errors.${state.errorCode}`)
    : state.error;

  return (
    <form
      action={formAction}
      className="rounded-xl border border-teal/30 bg-offwhite p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">
          {entry ? t("editorForms.careerTimeline.editHeading") : t("editorForms.careerTimeline.newHeading")}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate hover:text-navy dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {errorMessage && (
        <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label={t("editorForms.careerTimeline.fields.title")}
          name="title"
          required
          defaultValue={entry?.title}
          placeholder={t("editorForms.careerTimeline.fields.titlePlaceholder")}
        />
        <Field
          label={t("editorForms.careerTimeline.fields.organization")}
          name="organization"
          defaultValue={entry?.organization ?? ""}
        />
        <Field
          label={t("editorForms.careerTimeline.fields.location")}
          name="location"
          defaultValue={entry?.location ?? ""}
        />
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-navy dark:text-white">
            <input
              type="checkbox"
              name="is_current"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="h-4 w-4 rounded border-mist text-teal focus:ring-teal"
            />
            {t("editorForms.careerTimeline.fields.currentPosition")}
          </label>
        </div>
        <Field
          label={t("editorForms.careerTimeline.fields.startDate")}
          name="start_date"
          type="date"
          defaultValue={entry?.start_date ?? ""}
        />
        {!isCurrent && (
          <Field
            label={t("editorForms.careerTimeline.fields.endDate")}
            name="end_date"
            type="date"
            defaultValue={entry?.end_date ?? ""}
          />
        )}
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">
          {t("editorForms.careerTimeline.fields.description")}
        </label>
        <textarea
          name="description"
          rows={2}
          defaultValue={entry?.description ?? ""}
          className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

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
          {entry ? t("editorForms.careerTimeline.saveChangesButton") : t("editorForms.careerTimeline.addButton")}
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
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | null;
  placeholder?: string;
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
        className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
      />
    </div>
  );
}
