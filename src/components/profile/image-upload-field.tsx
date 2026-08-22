"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadPublicFile } from "@/lib/supabase/upload";
import { useTranslation } from "@/i18n/language-provider";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function ImageUploadField({
  name,
  label,
  defaultValue,
  bucket,
  profileId,
  shape = "square",
  onUploaded,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  bucket: string;
  profileId: string;
  shape?: "square" | "wide";
  onUploaded?: (url: string) => void;
}) {
  const { t } = useTranslation();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("editorWorkspace.imageUpload.chooseImageError"));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(t("editorWorkspace.imageUpload.maxSizeError"));
      return;
    }

    setUploading(true);
    try {
      const { url: publicUrl } = await uploadPublicFile(bucket, profileId, file);
      setUrl(publicUrl);
      onUploaded?.(publicUrl);
      toast.success(t("editorWorkspace.imageUpload.uploadedToast"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("editorWorkspace.imageUpload.uploadFailedToast"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate">
        {label}
      </label>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1.5 flex items-center gap-3">
        <div
          className={`shrink-0 overflow-hidden rounded-xl bg-mist ${
            shape === "square" ? "h-16 w-16" : "h-16 w-28"
          }`}
        >
          {url && (
            <Image
              src={url}
              alt=""
              width={112}
              height={64}
              className="h-full w-full object-cover"
            />
          )}
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
            {url
              ? t("editorWorkspace.imageUpload.changeImageButton")
              : t("editorWorkspace.imageUpload.uploadImageButton")}
          </button>
          {url && !uploading && (
            <button
              type="button"
              onClick={() => {
                setUrl("");
                onUploaded?.("");
              }}
              className="flex items-center gap-1 text-xs text-slate hover:text-red-600"
            >
              <X className="h-3 w-3" />
              {t("editorWorkspace.imageUpload.remove")}
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}
