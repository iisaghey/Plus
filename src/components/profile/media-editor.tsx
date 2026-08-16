"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, X, ImageIcon, PlayCircle, Star } from "lucide-react";
import { toast } from "sonner";
import {
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
  type MediaFormState,
} from "@/lib/actions/media";
import { ImageUploadField } from "@/components/profile/image-upload-field";
import { formatMonthYear } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type Entry = Tables<"media">;

const MEDIA_TYPES = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video (link)" },
  { value: "article", label: "Article (link)" },
  { value: "other", label: "Other (link)" },
];

export function MediaEditor({
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteMediaItem(id, profileId);
      setDeletingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Media removed");
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
          <ImageIcon className="h-4 w-4 text-teal" />
          <h2 className="font-heading text-base font-bold text-navy dark:text-white">Media</h2>
        </div>
        {editingId === null && !locked && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Media
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {editingId === "new" && (
          <MediaForm
            profileId={profileId}
            onCancel={() => setEditingId(null)}
            onDone={handleDone}
          />
        )}

        {entries.length === 0 && editingId !== "new" && (
          <p className="py-6 text-center text-sm text-slate">
            No media added yet.
          </p>
        )}

        {entries.length > 0 && editingId === null && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-mist"
              >
                {entry.external_url && (
                  <Image
                    src={entry.external_url}
                    alt={entry.title ?? ""}
                    fill
                    className="object-cover"
                  />
                )}
                {entry.media_type !== "photo" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-navy/40">
                    <PlayCircle className="h-7 w-7 text-white" />
                  </div>
                )}
                {entry.is_featured && (
                  <Star className="absolute right-2 top-2 h-4 w-4 fill-gold text-gold" />
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-navy/90 to-transparent p-2">
                  <p className="line-clamp-1 text-[11px] font-medium text-white">
                    {entry.title}
                  </p>
                  <div
                    className={
                      locked
                        ? "flex shrink-0 gap-0.5"
                        : "flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                    }
                  >
                    {!locked && (
                    <button
                      onClick={() => setEditingId(entry.id)}
                      className="flex h-6 w-6 items-center justify-center rounded bg-white/90 text-navy dark:text-white hover:bg-white dark:bg-offwhite"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    )}
                    {!locked && (
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={pending && deletingId === entry.id}
                      className="flex h-6 w-6 items-center justify-center rounded bg-white/90 text-red-600 hover:bg-white dark:bg-offwhite disabled:opacity-50"
                      aria-label="Delete"
                    >
                      {pending && deletingId === entry.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {entries.map((entry) =>
          editingId === entry.id ? (
            <MediaForm
              key={entry.id}
              profileId={profileId}
              entry={entry}
              onCancel={() => setEditingId(null)}
              onDone={handleDone}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

function MediaForm({
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
    ? updateMediaItem.bind(null, entry.id, profileId)
    : createMediaItem.bind(null, profileId);

  const [state, formAction, pending] = useActionState<MediaFormState, FormData>(
    action,
    {}
  );
  const [mediaType, setMediaType] = useState(entry?.media_type ?? "photo");

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
          {entry ? "Edit Media" : "New Media"}
        </p>
        <button type="button" onClick={onCancel} className="text-slate hover:text-navy dark:hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={entry?.title ?? ""} />
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            Type
          </label>
          <select
            name="media_type"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-mist bg-white dark:bg-offwhite px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          >
            {MEDIA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Category" name="category" defaultValue={entry?.category ?? ""} />
        <Field
          label="Event Date"
          name="event_date"
          type="date"
          defaultValue={entry?.event_date ?? ""}
        />
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">
          Caption
        </label>
        <textarea
          name="caption"
          rows={2}
          defaultValue={entry?.caption ?? ""}
          className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div className="mt-3">
        {mediaType === "photo" ? (
          <ImageUploadField
            name="external_url"
            label="Photo"
            defaultValue={entry?.external_url}
            bucket="profile-media"
            profileId={profileId}
          />
        ) : (
          <Field
            label="Link URL"
            name="external_url"
            type="url"
            placeholder="https://"
            defaultValue={entry?.external_url ?? ""}
          />
        )}
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate">
        <input
          type="checkbox"
          name="is_featured"
          defaultChecked={entry?.is_featured ?? false}
          className="h-3.5 w-3.5 rounded border-mist text-teal focus:ring-teal"
        />
        Feature on profile
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
          {entry ? "Save Changes" : "Add Media"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
      />
    </div>
  );
}
