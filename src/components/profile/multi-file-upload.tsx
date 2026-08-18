"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadPublicFile, uploadPrivateFile } from "@/lib/supabase/upload";
import { formatFileSize } from "@/lib/utils";

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB — video/audio need more room than a photo

export type UploadedFileMeta = {
  /** Public URL — absent when the bucket is private; use `path` + a signed URL instead. */
  url: string | null;
  path: string;
  name: string;
  size: number;
  mimeType: string;
};

type PendingFile = {
  id: string;
  file: File;
  progress: "uploading" | "done" | "error";
  error?: string;
};

export function MultiFileUpload({
  bucket,
  folderId,
  accept,
  label = "Upload Files",
  hint,
  isPrivate = false,
  onFileUploaded,
}: {
  bucket: string;
  folderId: string;
  accept?: string;
  label?: string;
  hint?: string;
  /** Use for buckets that aren't publicly readable (e.g. profile-documents) — skips generating a public URL. */
  isPrivate?: boolean;
  onFileUploaded: (file: UploadedFileMeta) => void | Promise<void>;
}) {
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const entries: PendingFile[] = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      progress: "uploading",
    }));
    setPending((prev) => [...prev, ...entries]);

    for (const entry of entries) {
      if (entry.file.size > MAX_SIZE_BYTES) {
        setPending((prev) =>
          prev.map((p) =>
            p.id === entry.id ? { ...p, progress: "error", error: "File is over 50MB" } : p
          )
        );
        toast.error(`${entry.file.name} is over 50MB.`);
        continue;
      }
      try {
        const result = isPrivate
          ? await uploadPrivateFile(bucket, folderId, entry.file)
          : await uploadPublicFile(bucket, folderId, entry.file);
        await onFileUploaded({
          url: result.url,
          path: result.path,
          name: entry.file.name,
          size: entry.file.size,
          mimeType: entry.file.type || "application/octet-stream",
        });
        setPending((prev) => prev.filter((p) => p.id !== entry.id));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setPending((prev) =>
          prev.map((p) => (p.id === entry.id ? { ...p, progress: "error", error: message } : p))
        );
        toast.error(`${entry.file.name}: ${message}`);
      }
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragging
            ? "border-teal bg-teal/5"
            : "border-mist hover:border-teal/50 hover:bg-offwhite"
        }`}
      >
        <UploadCloud className={`h-7 w-7 ${dragging ? "text-teal" : "text-slate"}`} />
        <p className="text-sm font-semibold text-navy dark:text-white">{label}</p>
        <p className="text-xs text-slate">
          {hint ?? "Drag and drop, or click to browse — you can select multiple files"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
      </div>

      {pending.length > 0 && (
        <div className="mt-3 space-y-2">
          {pending.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-lg border border-mist px-3 py-2 text-xs"
            >
              {entry.progress === "uploading" && (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-teal" />
              )}
              {entry.progress === "error" && (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />
              )}
              <span className="min-w-0 flex-1 truncate text-navy dark:text-white">
                {entry.file.name}
              </span>
              <span className="shrink-0 text-slate">{formatFileSize(entry.file.size)}</span>
              {entry.progress === "error" && (
                <span className="shrink-0 text-red-600">{entry.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
