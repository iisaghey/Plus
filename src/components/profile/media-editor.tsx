"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  X,
  ImageIcon,
  Star,
  Pencil,
  Search,
  LayoutGrid,
  List,
  Archive,
  ArchiveRestore,
  FileText,
  Music,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  updateMediaItem,
  deleteMediaItem,
  archiveMediaItem,
  restoreMediaItem,
  createMediaFromUpload,
  type MediaFormState,
} from "@/lib/actions/media";
import { uploadPublicFile } from "@/lib/supabase/upload";
import { MultiFileUpload, type UploadedFileMeta } from "@/components/profile/multi-file-upload";
import { FilePreviewCard, type FileKind } from "@/components/profile/file-preview-card";
import { MediaLightbox, type LightboxItem } from "@/components/profile/media-lightbox";
import { ActionIconButton } from "@/components/dashboard/action-icon-button";
import { cn, formatFileSize } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type Entry = Tables<"media">;
type TypeFilter = "all" | "photo" | "video" | "audio" | "document";
type SortBy = "newest" | "oldest" | "type";

const TYPE_ICON: Record<Entry["media_type"], typeof ImageIcon> = {
  photo: ImageIcon,
  video: PlayCircle,
  audio: Music,
  document: FileText,
};

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
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showArchived, setShowArchived] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeEntries = useMemo(() => entries.filter((e) => e.status !== "archived"), [entries]);
  const archivedEntries = useMemo(() => entries.filter((e) => e.status === "archived"), [entries]);
  const baseList = showArchived ? archivedEntries : activeEntries;

  const filtered = useMemo(() => {
    let list = baseList;
    if (typeFilter !== "all") list = list.filter((e) => e.media_type === typeFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((e) =>
        [e.title, e.category, e.location, e.caption]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      sorted.sort((a, b) => a.media_type.localeCompare(b.media_type));
    }
    return sorted;
  }, [baseList, typeFilter, search, sortBy]);

  const lightboxItems: LightboxItem[] = filtered.map((e) => ({
    id: e.id,
    url: e.external_url,
    kind: e.media_type as LightboxItem["kind"],
    title: e.title,
    description: e.caption,
  }));

  async function handleFileUploaded(file: UploadedFileMeta) {
    const result = await createMediaFromUpload(profileId, {
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
      const result = await deleteMediaItem(id, profileId);
      setRemovingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Media deleted");
      router.refresh();
    });
  }

  function handleArchive(id: string) {
    setArchivingId(id);
    startTransition(async () => {
      const result = await archiveMediaItem(id, profileId);
      setArchivingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Media archived");
      router.refresh();
    });
  }

  function handleRestore(id: string) {
    setArchivingId(id);
    startTransition(async () => {
      const result = await restoreMediaItem(id, profileId);
      setArchivingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Media restored");
      router.refresh();
    });
  }

  function handleReplace(entry: Entry, file: File) {
    setReplacingId(entry.id);
    startTransition(async () => {
      try {
        const uploaded = await uploadPublicFile("profile-media", profileId, file);
        const formData = new FormData();
        formData.set("title", entry.title ?? "");
        formData.set("category", entry.category ?? "");
        formData.set("media_type", entry.media_type);
        formData.set("event_date", entry.event_date ?? "");
        formData.set("location", entry.location ?? "");
        formData.set("caption", entry.caption ?? "");
        formData.set("external_url", uploaded.url ?? "");
        if (entry.is_featured) formData.set("is_featured", "on");
        await updateMediaItem(entry.id, profileId, {}, formData);
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-teal" />
            <h2 className="font-heading text-base font-bold text-navy dark:text-white">
              Media &amp; Gallery
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate">
            Photos, videos, audio, and documents for the public profile gallery.
          </p>
        </div>
        {archivedEntries.length > 0 && (
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              showArchived ? "bg-navy text-white" : "bg-mist/60 text-slate hover:text-navy dark:hover:text-white"
            )}
          >
            <Archive className="h-3.5 w-3.5" />
            Archived ({archivedEntries.length})
          </button>
        )}
      </div>

      {!locked && (
        <div className="mt-4">
          <MultiFileUpload
            bucket="profile-media"
            folderId={profileId}
            accept="image/*,video/*,audio/*,application/pdf,.doc,.docx"
            label="Upload Photos, Videos, Audio & Documents"
            onFileUploaded={handleFileUploaded}
          />
        </div>
      )}

      {activeEntries.length + archivedEntries.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex h-9 min-w-[160px] flex-1 items-center gap-2 rounded-lg border border-mist px-3">
            <Search className="h-3.5 w-3.5 shrink-0 text-slate" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, category, location…"
              className="w-full bg-transparent text-xs text-ink placeholder:text-slate focus:outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="h-9 rounded-lg border border-mist bg-white px-2 text-xs text-navy focus:border-teal focus:outline-none dark:bg-offwhite dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="h-9 rounded-lg border border-mist bg-white px-2 text-xs text-navy focus:border-teal focus:outline-none dark:bg-offwhite dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="type">By Type</option>
          </select>
          <div className="flex rounded-lg border border-mist p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                viewMode === "grid" ? "bg-teal text-white" : "text-slate hover:text-navy dark:hover:text-white"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                viewMode === "list" ? "bg-teal text-white" : "text-slate hover:text-navy dark:hover:text-white"
              )}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate">
          {baseList.length === 0
            ? showArchived
              ? "No archived media."
              : "No media added yet."
            : "No media matches your search."}
        </p>
      ) : editingId ? null : viewMode === "grid" ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((entry, i) => (
            <FilePreviewCard
              key={entry.id}
              url={entry.external_url}
              fileName={entry.file_name ?? entry.title}
              fileSize={formatFileSize(entry.file_size)}
              kind={entry.media_type as FileKind}
              removing={
                pending &&
                (removingId === entry.id || archivingId === entry.id || replacingId === entry.id)
              }
              onRemove={() => handleRemove(entry.id)}
              onReplace={locked || showArchived ? undefined : (file) => handleReplace(entry, file)}
              onPreviewClick={
                entry.media_type === "photo" || entry.media_type === "video"
                  ? () => setLightboxIndex(i)
                  : undefined
              }
            >
              <div className="mt-1.5 flex items-center justify-between gap-1">
                {entry.is_featured && <Star className="h-3 w-3 shrink-0 fill-gold text-gold" />}
                {!locked && (
                  <div className="ml-auto flex items-center gap-2">
                    {showArchived ? (
                      <button
                        type="button"
                        onClick={() => handleRestore(entry.id)}
                        disabled={pending}
                        className="flex items-center gap-1 text-[11px] font-semibold text-teal hover:underline disabled:opacity-50"
                      >
                        <ArchiveRestore className="h-3 w-3" />
                        Restore
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingId(entry.id)}
                          disabled={pending}
                          className="flex items-center gap-1 text-[11px] font-semibold text-teal hover:underline disabled:opacity-50"
                        >
                          <Pencil className="h-3 w-3" />
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchive(entry.id)}
                          disabled={pending}
                          title="Archive"
                          className="text-slate hover:text-navy disabled:opacity-50 dark:hover:text-white"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </FilePreviewCard>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {filtered.map((entry, i) => {
            const TypeIcon = TYPE_ICON[entry.media_type] ?? FileText;
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-xl border border-mist p-2.5"
              >
                <button
                  type="button"
                  onClick={() =>
                    entry.media_type === "photo" || entry.media_type === "video"
                      ? setLightboxIndex(i)
                      : undefined
                  }
                  className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mist"
                >
                  {entry.media_type === "photo" && entry.external_url ? (
                    <Image src={entry.external_url} alt="" fill className="object-cover" />
                  ) : (
                    <TypeIcon className="h-5 w-5 text-slate" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy dark:text-white">
                    {entry.title ?? entry.file_name ?? "Untitled"}
                  </p>
                  <p className="truncate text-xs text-slate">
                    {[entry.category, entry.location, formatFileSize(entry.file_size)]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
                {entry.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" />}
                <span className="hidden shrink-0 text-xs text-slate sm:inline">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
                {!locked && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    {showArchived ? (
                      <ActionIconButton
                        icon={ArchiveRestore}
                        label="Restore"
                        tone="teal"
                        onClick={() => handleRestore(entry.id)}
                        disabled={pending}
                      />
                    ) : (
                      <>
                        <ActionIconButton
                          icon={Pencil}
                          label="Edit details"
                          tone="teal"
                          onClick={() => setEditingId(entry.id)}
                          disabled={pending}
                        />
                        <ActionIconButton
                          icon={Archive}
                          label="Archive"
                          tone="gold"
                          onClick={() => handleArchive(entry.id)}
                          disabled={pending}
                        />
                        <ActionIconButton
                          icon={X}
                          label="Delete"
                          tone="red"
                          onClick={() => handleRemove(entry.id)}
                          disabled={pending}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editingId && (
        <div className="mt-4">
          <MediaMetaForm
            profileId={profileId}
            entry={entries.find((e) => e.id === editingId)!}
            onCancel={() => setEditingId(null)}
            onDone={() => {
              setEditingId(null);
              router.refresh();
            }}
          />
        </div>
      )}

      <MediaLightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}

function MediaMetaForm({
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
  const action = updateMediaItem.bind(null, entry.id, profileId);
  const [state, formAction, pending] = useActionState<MediaFormState, FormData>(action, {});
  const [isFeatured, setIsFeatured] = useState(entry.is_featured);

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
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">Media Details</p>
        <button type="button" onClick={onCancel} className="text-slate hover:text-navy dark:hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}

      <input type="hidden" name="media_type" value={entry.media_type} />
      <input type="hidden" name="external_url" value={entry.external_url ?? ""} />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={entry.title ?? ""} />
        <Field label="Category" name="category" defaultValue={entry.category ?? ""} />
        <Field label="Date" name="event_date" type="date" defaultValue={entry.event_date ?? ""} />
        <Field label="Location" name="location" defaultValue={entry.location ?? ""} placeholder="City, Country" />
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">Description</label>
        <textarea
          name="caption"
          rows={2}
          defaultValue={entry.caption ?? ""}
          className="mt-1.5 w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate">
        <input
          type="checkbox"
          name="is_featured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
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
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</label>
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
