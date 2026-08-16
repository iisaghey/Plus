"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { uploadPrivateFile, getSignedUrl } from "@/lib/supabase/upload";

const MAX_SIZE_BYTES = 15 * 1024 * 1024;

export function FileUploadField({
  name,
  label,
  defaultValue,
  bucket,
  profileId,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  bucket: string;
  profileId: string;
}) {
  const [path, setPath] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File must be under 15MB.");
      return;
    }

    setUploading(true);
    try {
      const { path: storedPath } = await uploadPrivateFile(bucket, profileId, file);
      setPath(storedPath);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleView() {
    setViewing(true);
    try {
      const url = await getSignedUrl(bucket, path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open file");
    } finally {
      setViewing(false);
    }
  }

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">
        {label}
      </label>
      <input type="hidden" name={name} value={path} />
      <div className="mt-1.5 flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-mist">
          <FileText className="h-6 w-6 text-slate" />
        </div>
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-navy dark:text-white hover:border-teal disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {path ? "Replace" : "Upload"} File
          </button>
          <div className="flex items-center gap-2">
            {path && !uploading && (
              <button
                type="button"
                onClick={handleView}
                disabled={viewing}
                className="flex items-center gap-1 text-xs text-teal hover:underline disabled:opacity-50"
              >
                {viewing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
                View
              </button>
            )}
            {path && !uploading && (
              <button
                type="button"
                onClick={() => setPath("")}
                className="flex items-center gap-1 text-xs text-slate hover:text-red-600"
              >
                <X className="h-3 w-3" />
                Remove
              </button>
            )}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}
