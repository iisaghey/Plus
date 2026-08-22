"use client";

import { Children, isValidElement, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Eye, Lock, Save } from "lucide-react";
import { motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";
import type { SectionCompleteness } from "@/lib/profile-completeness";
import { useTranslation } from "@/i18n/language-provider";

export type WizardStepDef = {
  id: string;
  label: string;
  icon: ReactNode;
  /** Section keys this step covers — every one must be complete before Next unlocks. */
  sections: string[];
};

export function ProfileWizardStep({ children }: { id: string; children: ReactNode }) {
  return <>{children}</>;
}

export function ProfileWizard({
  steps,
  completionPercent,
  previewHref,
  reviewSlot,
  sectionStatus,
  children,
}: {
  steps: WizardStepDef[];
  completionPercent: number;
  previewHref?: string;
  /** Rendered instead of the Next button on the final step (e.g. Submit for Review). */
  reviewSlot?: ReactNode;
  /** Completeness of every mandatory section — drives step gating and validation messages. */
  sectionStatus: SectionCompleteness[];
  children: ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(steps[0]?.id);
  const [saving, setSaving] = useState(false);

  const activeIndex = steps.findIndex((s) => s.id === activeId);
  const isLast = activeIndex === steps.length - 1;
  const isFirst = activeIndex === 0;

  const statusByKey = new Map<string, SectionCompleteness>(sectionStatus.map((s) => [s.key, s]));
  const stepMissing: SectionCompleteness[][] = steps.map((step) =>
    step.sections
      .map((key) => statusByKey.get(key))
      .filter((s): s is SectionCompleteness => s !== undefined && !s.complete)
  );
  const completeFlags = stepMissing.map((missing) => missing.length === 0);
  const firstIncompleteIndex = completeFlags.findIndex((complete) => !complete);
  const maxReachableIndex = firstIncompleteIndex === -1 ? steps.length - 1 : firstIncompleteIndex;
  const currentMissing = stepMissing[activeIndex] ?? [];

  const stepContent = Children.toArray(children).find(
    (child) => isValidElement(child) && (child.props as { id?: string }).id === activeId
  );

  function goTo(id: string) {
    const targetIndex = steps.findIndex((s) => s.id === id);
    if (targetIndex > maxReachableIndex) {
      toast.error(t("editorWorkspace.wizard.incompleteToast"));
      return;
    }
    setActiveId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSaveDraft() {
    setSaving(true);
    router.refresh();
    toast.success(t("editorWorkspace.wizard.draftSavedToast"));
    setTimeout(() => setSaving(false), 400);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr]">
      {/* Progress + step list */}
      <div>
        <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">
              {t("editorWorkspace.wizard.profileCompletion")}
            </p>
            <p className="text-xs font-bold text-teal">{completionPercent}%</p>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-teal to-gold"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: DURATION.slow, ease: EASE }}
            />
          </div>

          <nav className="mt-5 flex gap-1.5 overflow-x-auto pb-1 lg:mt-6 lg:flex-col lg:overflow-visible lg:pb-0">
            {steps.map((step, i) => {
              const isActive = step.id === activeId;
              const isComplete = completeFlags[i];
              const isLocked = i > maxReachableIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goTo(step.id)}
                  disabled={isLocked}
                  title={isLocked ? t("editorWorkspace.wizard.stepLockedTitle") : undefined}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors lg:shrink ${
                    isLocked
                      ? "cursor-not-allowed text-slate/50"
                      : isActive
                        ? "bg-teal/10 text-teal"
                        : "text-slate hover:bg-offwhite hover:text-navy dark:hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      isActive
                        ? "bg-teal text-white"
                        : isLocked
                          ? "bg-mist text-slate/50"
                          : isComplete
                            ? "bg-emerald/15 text-emerald"
                            : "bg-gold/15 text-gold"
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="h-3 w-3" />
                    ) : isComplete ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="shrink-0">{step.icon}</span>
                  <span className="whitespace-nowrap lg:whitespace-normal">{step.label}</span>
                </button>
              );
            })}
          </nav>

          {previewHref && (
            <Link
              href={previewHref}
              target="_blank"
              className="mt-5 hidden items-center justify-center gap-1.5 rounded-full border border-mist px-4 py-2 text-xs font-semibold text-navy dark:text-white hover:border-teal hover:text-teal lg:flex"
            >
              <Eye className="h-3.5 w-3.5" />
              {t("editorWorkspace.wizard.previewPublicProfile")}
            </Link>
          )}
        </div>
      </div>

      {/* Active step content */}
      <div>
        {currentMissing.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-navy dark:text-white">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="font-semibold">{t("editorWorkspace.wizard.completeSectionHeading")}</p>
              <ul className="mt-1 space-y-0.5">
                {currentMissing.map((section) => (
                  <li key={section.key}>
                    <span className="font-medium">{section.label}</span> — {t("editorWorkspace.wizard.addWord")}{" "}
                    {section.missing.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="space-y-6"
        >
          {stepContent}
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-mist pt-6">
          <button
            type="button"
            onClick={() => !isFirst && goTo(steps[activeIndex - 1].id)}
            disabled={isFirst}
            className="flex items-center gap-1.5 rounded-full border border-mist px-4 py-2 text-sm font-semibold text-navy dark:text-white hover:border-teal disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("editorWorkspace.wizard.back")}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate hover:bg-mist/60 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {t("editorWorkspace.wizard.saveDraft")}
            </button>
            {previewHref && (
              <Link
                href={previewHref}
                target="_blank"
                className="flex items-center gap-1.5 rounded-full border border-mist px-4 py-2 text-sm font-semibold text-navy dark:text-white hover:border-teal lg:hidden"
              >
                <Eye className="h-3.5 w-3.5" />
                {t("editorWorkspace.wizard.preview")}
              </Link>
            )}
            {isLast ? (
              reviewSlot
            ) : (
              <button
                type="button"
                onClick={() => completeFlags[activeIndex] && goTo(steps[activeIndex + 1].id)}
                disabled={!completeFlags[activeIndex]}
                title={
                  completeFlags[activeIndex]
                    ? undefined
                    : t("editorWorkspace.wizard.nextDisabledTitle")
                }
                className="flex items-center gap-1.5 rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white hover:bg-aqoonsi disabled:pointer-events-none disabled:opacity-40"
              >
                {t("editorWorkspace.wizard.next")}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-slate lg:text-right">
          {t("editorWorkspace.wizard.stepProgress")
            .replace("{current}", String(activeIndex + 1))
            .replace("{total}", String(steps.length))}
          {!completeFlags[activeIndex] && ` — ${t("editorWorkspace.wizard.requiredFieldsMissing")}`}
        </p>
      </div>
    </div>
  );
}
