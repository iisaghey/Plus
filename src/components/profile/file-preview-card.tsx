"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FileText, Music, Trash2, RefreshCcw, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getSignedUrl } from "@/lib/supabase/upload";

export type FileKind = "photo" | "video" | "document" | "audio";

export function FilePreviewCard({
  url,
  path,
  bucket,
  fileName,
  fileSize,
  kind,
  removing,
  onRemove,
  onReplace,
  children,
}: {
  /** Public URL, when the bucket is public. */
  url?: string | null;
  /** Storage path — required to fetch a signed URL on demand when `url` isn't public. */
  path?: string | null;
  bucket?: string;
  fileName: string | null;
  fileSize?: string;
  kind: FileKind;
  removing?: boolean;
  onRemove: () => void;
  onReplace?: (file: File) => void;
  /** Optional extra content rendered below the preview (e.g. a title field). */
  children?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resolving, setResolving] = useState(false);
  const ext = fileName?.split(".").pop()?.toUpperCase();

  async function openPrivateFile() {
    if (!path || !bucket) return;
    setResolving(true);
    try {
      const signedUrl = await getSignedUrl(bucket, path);
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Couldn't open file");
    } finally {
      setResolving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-mist">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-mist">
        {kind === "photo" && url && (
          <Image src={url} alt={fileName ?? ""} fill className="object-cover" />
        )}
        {kind === "video" && url && (
          <video src={url} controls preload="metadata" className="h-full w-full object-cover" />
        )}
        {kind === "audio" && url && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3">
            <Music className="h-6 w-6 text-teal" />
            <audio src={url} controls className="w-full" />
          </div>
        )}
        {(kind === "document" || !url) && (
          <button
            type="button"
            onClick={url ? undefined : openPrivateFile}
            disabled={resolving}
            className="flex flex-col items-center gap-1.5 text-slate disabled:opacity-60"
          >
            {resolving ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <FileText className="h-8 w-8" />
            )}
            {ext && <span className="text-[10px] font-bold">{ext}</span>}
            {!url && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-teal">
                <ExternalLink className="h-2.5 w-2.5" />
                View
              </span>
            )}
          </button>
        )}

        <div className="absolute right-1.5 top-1.5 flex gap-1">
          {onReplace && (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-6 w-6 items-center justify-center rounded bg-white/90 text-navy hover:bg-white"
                aria-label="Replace file"
              >
                <RefreshCcw className="h-3 w-3" />
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onReplace(file);
                  e.target.value = "";
                }}
              />
            </>
          )}
          <button
            type="button"
            onClick={onRemove}
            disabled={removing}
            className="flex h-6 w-6 items-center justify-center rounded bg-white/90 text-red-600 hover:bg-white disabled:opacity-50"
            aria-label="Remove file"
          >
            {removing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
          </button>
        </div>
      </div>

      <div className="p-2.5">
        <p className="truncate text-xs font-semibold text-navy dark:text-white">
          {fileName ?? "Untitled"}
        </p>
        {fileSize && <p className="text-[11px] text-slate">{fileSize}</p>}
        {children}
      </div>
    </div>
  );
}

export function kindFromMimeType(mimeType: string): FileKind {
  if (mimeType.startsWith("image/")) return "photo";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
}
