"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, BookOpen, Check } from "lucide-react";
import { toast } from "sonner";
import { saveBiography, type BiographyFormState } from "@/lib/actions/biography";
import { RichTextEditor } from "@/components/profile/rich-text-editor";
import { useTranslation } from "@/i18n/language-provider";
import type { Tables } from "@/types/database.types";

export function BiographyEditor({
  profileId,
  biography,
  locked = false,
}: {
  profileId: string;
  biography: Tables<"biographies"> | null;
  locked?: boolean;
}) {
  const { t } = useTranslation();
  const action = saveBiography.bind(null, profileId);
  const [state, formAction, pending] = useActionState<BiographyFormState, FormData>(
    action,
    {}
  );
  const [justSaved, setJustSaved] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [prevSuccess, setPrevSuccess] = useState(false);

  if (state.success && !prevSuccess) {
    setPrevSuccess(true);
    setJustSaved(true);
  }

  useEffect(() => {
    if (state.success) {
      toast.success(t("editorForms.biography.toasts.saved"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [justSaved]);

  return (
    <div className="rounded-2xl border border-mist p-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-teal" />
        <h2 className="font-heading text-base font-bold text-navy dark:text-white">{t("editorForms.biography.heading")}</h2>
      </div>
      <p className="mt-1 text-xs text-slate">
        {t("editorForms.biography.description")}
      </p>

      <form action={formAction} className="mt-4 space-y-3">
        {state.error && (
          <p className="text-xs text-red-600">{state.error}</p>
        )}

        <fieldset disabled={locked} className="space-y-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            {t("editorForms.biography.summaryLabel")}
            <span className="text-teal"> *</span>
          </label>
          <div className="mt-1.5">
            <RichTextEditor
              key={`summary-${resetKey}`}
              name="summary"
              defaultValue={biography?.summary}
              placeholder={t("editorForms.biography.summaryPlaceholder")}
              minHeight={60}
              disabled={locked}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            {t("editorForms.biography.fullBiographyLabel")}
          </label>
          <div className="mt-1.5">
            <RichTextEditor
              key={`content-${resetKey}`}
              name="content"
              defaultValue={biography?.content}
              placeholder={t("editorForms.biography.fullBiographyPlaceholder")}
              minHeight={220}
              disabled={locked}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setResetKey((k) => k + 1)}
            disabled={pending}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-slate hover:bg-mist/60 disabled:opacity-50"
          >
            {t("editorForms.biography.discardButton")}
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-aqoonsi disabled:opacity-50"
          >
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {justSaved && !pending && <Check className="h-3.5 w-3.5" />}
            {t("editorForms.biography.saveButton")}
          </button>
        </div>
        </fieldset>
      </form>
    </div>
  );
}
