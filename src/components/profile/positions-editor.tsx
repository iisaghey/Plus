"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, Landmark } from "lucide-react";
import { toast } from "sonner";
import {
  createPosition,
  updatePosition,
  deletePosition,
  type PositionFormState,
} from "@/lib/actions/positions";
import { formatDateRange } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type Entry = Tables<"government_positions">;

export function PositionsEditor({
  profileId,
  entries,
}: {
  profileId: string;
  entries: Entry[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deletePosition(id, profileId);
      setDeletingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Position removed");
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
          <Landmark className="h-4 w-4 text-teal" />
          <h2 className="font-heading text-base font-bold text-navy">
            Government Positions
          </h2>
        </div>
        {editingId === null && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Position
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {editingId === "new" && (
          <PositionForm
            profileId={profileId}
            onCancel={() => setEditingId(null)}
            onDone={handleDone}
          />
        )}

        {entries.length === 0 && editingId !== "new" && (
          <p className="py-6 text-center text-sm text-slate">
            No government positions added yet.
          </p>
        )}

        {entries.map((entry) =>
          editingId === entry.id ? (
            <PositionForm
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
                  <p className="text-sm font-semibold text-navy">
                    {entry.position_title}
                  </p>
                  <p className="text-xs text-slate">
                    {formatDateRange(entry.start_date, entry.end_date, entry.is_current)}
                  </p>
                </div>
                {(entry.institution || entry.government_level || entry.country) && (
                  <p className="text-xs text-slate">
                    {[entry.institution, entry.government_level, entry.country]
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate hover:bg-offwhite hover:text-navy"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={pending && deletingId === entry.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label="Delete"
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

function PositionForm({
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
    ? updatePosition.bind(null, entry.id, profileId)
    : createPosition.bind(null, profileId);

  const [state, formAction, pending] = useActionState<PositionFormState, FormData>(
    action,
    {}
  );
  const [isCurrent, setIsCurrent] = useState(entry?.is_current ?? false);

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="rounded-xl border border-teal/30 bg-offwhite p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">
          {entry ? "Edit Position" : "New Position"}
        </p>
        <button type="button" onClick={onCancel} className="text-slate hover:text-navy">
          <X className="h-4 w-4" />
        </button>
      </div>

      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Position Title"
          name="position_title"
          required
          defaultValue={entry?.position_title}
          placeholder="Minister of Foreign Affairs"
        />
        <Field
          label="Institution"
          name="institution"
          defaultValue={entry?.institution ?? ""}
        />
        <Field
          label="Government Level"
          name="government_level"
          placeholder="Federal, Regional, Local..."
          defaultValue={entry?.government_level ?? ""}
        />
        <Field label="Country" name="country" defaultValue={entry?.country ?? ""} />
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-navy">
            <input
              type="checkbox"
              name="is_current"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="h-4 w-4 rounded border-mist text-teal focus:ring-teal"
            />
            Current position
          </label>
        </div>
        <Field
          label="Start Date"
          name="start_date"
          type="date"
          defaultValue={entry?.start_date ?? ""}
        />
        {!isCurrent && (
          <Field
            label="End Date"
            name="end_date"
            type="date"
            defaultValue={entry?.end_date ?? ""}
          />
        )}
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">
          Description
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
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-aqoonsi disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {entry ? "Save Changes" : "Add Position"}
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
