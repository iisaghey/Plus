"use client";

import { Children, isValidElement, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Save,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

export type WizardStepDef = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Section keys this step covers, used only for the completion checklist tooltip. */
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
  children,
}: {
  steps: WizardStepDef[];
  completionPercent: number;
  previewHref?: string;
  /** Rendered instead of the Next button on the final step (e.g. Submit for Review). */
  reviewSlot?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(steps[0]?.id);
  const [saving, setSaving] = useState(false);

  const activeIndex = steps.findIndex((s) => s.id === activeId);
  const isLast = activeIndex === steps.length - 1;
  const isFirst = activeIndex === 0;

  const stepContent = Children.toArray(children).find(
    (child) => isValidElement(child) && (child.props as { id?: string }).id === activeId
  );

  function goTo(id: string) {
    setActiveId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSaveDraft() {
    setSaving(true);
    router.refresh();
    toast.success("Draft saved");
    setTimeout(() => setSaving(false), 400);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr]">
      {/* Progress + step list */}
      <div>
        <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">
              Profile Completion
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
              const isPast = i < activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goTo(step.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors lg:shrink ${
                    isActive
                      ? "bg-teal/10 text-teal"
                      : "text-slate hover:bg-offwhite hover:text-navy dark:hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      isActive
                        ? "bg-teal text-white"
                        : isPast
                          ? "bg-emerald/15 text-emerald"
                          : "bg-mist text-slate"
                    }`}
                  >
                    {isPast ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
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
              Preview Public Profile
            </Link>
          )}
        </div>
      </div>

      {/* Active step content */}
      <div>
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
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate hover:bg-mist/60 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              Save Draft
            </button>
            {previewHref && (
              <Link
                href={previewHref}
                target="_blank"
                className="flex items-center gap-1.5 rounded-full border border-mist px-4 py-2 text-sm font-semibold text-navy dark:text-white hover:border-teal lg:hidden"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </Link>
            )}
            {isLast ? (
              reviewSlot
            ) : (
              <button
                type="button"
                onClick={() => goTo(steps[activeIndex + 1].id)}
                className="flex items-center gap-1.5 rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white hover:bg-aqoonsi"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-slate lg:text-right">
          Step {activeIndex + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
