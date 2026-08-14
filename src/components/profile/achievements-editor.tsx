"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, X, Trophy } from "lucide-react";
import { toast } from "sonner";
import {
  createAchievement,
  updateAchievement,
  deleteAchievement,
  type AchievementFormState,
} from "@/lib/actions/achievements";
import { ImageUploadField } from "@/components/profile/image-upload-field";
import { formatMonthYear } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type Entry = Tables<"achievements">;

export function AchievementsEditor({
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
      const result = await deleteAchievement(id, profileId);
      setDeletingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Achievement removed");
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
          <Trophy className="h-4 w-4 text-gold" />
          <h2 className="font-heading text-base font-bold text-navy">
            Achievements
          </h2>
        </div>
        {editingId === null && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Achievement
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {editingId === "new" && (
          <AchievementForm
            profileId={profileId}
            onCancel={() => setEditingId(null)}
            onDone={handleDone}
          />
        )}

        {entries.length === 0 && editingId !== "new" && (
          <p className="py-6 text-center text-sm text-slate">
            No achievements added yet.
          </p>
        )}

        {entries.map((entry) =>
          editingId === entry.id ? (
            <AchievementForm
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
              <div className="flex min-w-0 gap-3">
                {entry.media_url && (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-mist">
                    <Image
                      src={entry.media_url}
                      alt=""
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-sm font-semibold text-navy">
                      {entry.title}
                    </p>
                    {entry.achievement_date && (
                      <p className="text-xs text-slate">
                        {formatMonthYear(entry.achievement_date)}
                      </p>
                    )}
                  </div>
                  {(entry.issuing_organization || entry.category) && (
                    <p className="text-xs text-slate">
                      {[entry.issuing_organization, entry.category]
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

function AchievementForm({
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
    ? updateAchievement.bind(null, entry.id, profileId)
    : createAchievement.bind(null, profileId);

  const [state, formAction, pending] = useActionState<
    AchievementFormState,
    FormData
  >(action, {});

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
          {entry ? "Edit Achievement" : "New Achievement"}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate hover:text-navy"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {state.error && (
        <p className="mt-2 text-xs text-red-600">{state.error}</p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Title"
          name="title"
          required
          defaultValue={entry?.title}
          placeholder="Regional Diplomacy Award"
        />
        <Field
          label="Category"
          name="category"
          defaultValue={entry?.category ?? ""}
          placeholder="Recognition, Award, Honor..."
        />
        <Field
          label="Issuing Organization"
          name="issuing_organization"
          defaultValue={entry?.issuing_organization ?? ""}
        />
        <Field
          label="Date"
          name="achievement_date"
          type="date"
          defaultValue={entry?.achievement_date ?? ""}
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

      <div className="mt-3">
        <ImageUploadField
          name="media_url"
          label="Photo (optional)"
          defaultValue={entry?.media_url}
          bucket="profile-media"
          profileId={profileId}
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
          {entry ? "Save Changes" : "Add Achievement"}
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
