"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, Plane } from "lucide-react";
import { toast } from "sonner";
import {
  createTravelEntry,
  updateTravelEntry,
  deleteTravelEntry,
  type TravelFormState,
} from "@/lib/actions/travel";
import { formatDateRange } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type Entry = Tables<"official_travel">;

export function TravelEditor({
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
      const result = await deleteTravelEntry(id, profileId);
      setDeletingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Travel entry removed");
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
          <Plane className="h-4 w-4 text-teal" />
          <h2 className="font-heading text-base font-bold text-navy">
            Official Travel
          </h2>
        </div>
        {editingId === null && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Trip
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {editingId === "new" && (
          <TravelForm
            profileId={profileId}
            onCancel={() => setEditingId(null)}
            onDone={handleDone}
          />
        )}

        {entries.length === 0 && editingId !== "new" && (
          <p className="py-6 text-center text-sm text-slate">
            No official travel added yet.
          </p>
        )}

        {entries.map((entry) =>
          editingId === entry.id ? (
            <TravelForm
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
                    {[entry.destination_city, entry.destination_country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-xs text-slate">
                    {formatDateRange(entry.start_date, entry.end_date)}
                  </p>
                </div>
                {(entry.purpose || entry.delegation) && (
                  <p className="text-xs text-slate">
                    {[entry.purpose, entry.delegation].filter(Boolean).join(" · ")}
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

function TravelForm({
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
    ? updateTravelEntry.bind(null, entry.id, profileId)
    : createTravelEntry.bind(null, profileId);

  const [state, formAction, pending] = useActionState<TravelFormState, FormData>(
    action,
    {}
  );

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
          {entry ? "Edit Trip" : "New Trip"}
        </p>
        <button type="button" onClick={onCancel} className="text-slate hover:text-navy">
          <X className="h-4 w-4" />
        </button>
      </div>

      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Destination Country"
          name="destination_country"
          required
          defaultValue={entry?.destination_country}
        />
        <Field
          label="Destination City"
          name="destination_city"
          defaultValue={entry?.destination_city ?? ""}
        />
        <Field label="Purpose" name="purpose" defaultValue={entry?.purpose ?? ""} />
        <Field
          label="Delegation"
          name="delegation"
          defaultValue={entry?.delegation ?? ""}
        />
        <Field
          label="Start Date"
          name="start_date"
          type="date"
          defaultValue={entry?.start_date ?? ""}
        />
        <Field
          label="End Date"
          name="end_date"
          type="date"
          defaultValue={entry?.end_date ?? ""}
        />
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
          {entry ? "Save Changes" : "Add Trip"}
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
