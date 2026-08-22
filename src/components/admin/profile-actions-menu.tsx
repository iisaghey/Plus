"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MoreVertical,
  Eye,
  Pencil,
  EyeOff,
  Send,
  Undo2,
  BadgeCheck,
  ShieldOff,
  Archive,
  ArchiveRestore,
  Trash2,
  Flame,
  Loader2,
  Download,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";
import { publishProfile } from "@/lib/actions/workflow";
import {
  hideProfile,
  unhideProfile,
  verifyProfile,
  unverifyProfile,
  archiveProfile,
  restoreArchivedProfile,
  deleteProfile,
  restoreDeletedProfile,
  permanentlyDeleteProfile,
} from "@/lib/actions/profile-lifecycle";
import { getProfileResumeData } from "@/lib/actions/resume";
import { buildResumePdf } from "@/lib/pdf/build-resume-pdf";
import { useTranslation } from "@/i18n/language-provider";

export type ProfileActionState = {
  id: string;
  slug: string;
  status: string;
  workflow_status: string;
  verification_status: string;
  hidden_at: string | null;
  deleted_at: string | null;
};

type Confirm = "delete" | "permanent" | null;

export function ProfileActionsMenu({
  profile,
  canPermanentlyDelete = true,
}: {
  profile: ProfileActionState;
  /** Permanent, irreversible deletion stays Super Admin only. */
  canPermanentlyDelete?: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [pending, startTransition] = useTransition();

  const isDeleted = Boolean(profile.deleted_at);
  const isArchived = profile.status === "archived";
  const isHidden = Boolean(profile.hidden_at);
  const isPublished = profile.workflow_status === "published";
  const isVerified = profile.verification_status === "verified";

  function run(
    label: string,
    action: () => Promise<{ error?: string; success?: boolean }>
  ) {
    setOpen(false);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(label);
      router.refresh();
    });
  }

  function runConfirmed(
    label: string,
    action: () => Promise<{ error?: string; success?: boolean }>
  ) {
    setConfirm(null);
    run(label, action);
  }

  function handleResume(mode: "download" | "print") {
    setOpen(false);
    startTransition(async () => {
      const data = await getProfileResumeData(profile.id);
      if ("error" in data) {
        toast.error(data.error);
        return;
      }
      const doc = buildResumePdf(data);
      if (mode === "download") {
        doc.save(`${profile.slug}-resume.pdf`);
        toast.success(t("admin.profileActionsMenu.resumeDownloaded"));
      } else {
        doc.autoPrint();
        window.open(doc.output("bloburl"), "_blank");
        toast.success(t("admin.profileActionsMenu.openingResumeForPrinting"));
      }
    });
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-label={t("admin.profileActionsMenu.ariaLabel")}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate hover:bg-offwhite hover:text-navy disabled:opacity-50 dark:hover:text-white"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreVertical className="h-4 w-4" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute right-0 z-50 mt-1 w-56 origin-top-right rounded-xl border border-mist bg-white dark:bg-offwhite p-1.5 shadow-xl"
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: DURATION.fast, ease: EASE }}
            >
              <Link
                href={`/profile/${profile.slug}`}
                target="_blank"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy hover:bg-offwhite dark:text-white"
              >
                <Eye className="h-3.5 w-3.5" />
                {t("admin.profileActionsMenu.viewProfile")}
              </Link>
              <Link
                href={`/staff/profiles/${profile.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy hover:bg-offwhite dark:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
                {t("admin.profileActionsMenu.editProfile")}
              </Link>

              <div className="my-1 border-t border-mist" />

              <MenuButton
                icon={Download}
                label={t("admin.profileActionsMenu.downloadResume")}
                onClick={() => handleResume("download")}
              />
              <MenuButton
                icon={Printer}
                label={t("admin.profileActionsMenu.printResume")}
                onClick={() => handleResume("print")}
              />

              <div className="my-1 border-t border-mist" />

              {isDeleted ? (
                <>
                  <MenuButton
                    icon={Undo2}
                    label={t("admin.profileActionsMenu.restoreProfile")}
                    onClick={() =>
                      run(t("admin.profileActionsMenu.profileRestored"), () => restoreDeletedProfile(profile.id))
                    }
                  />
                  {canPermanentlyDelete && (
                    <MenuButton
                      icon={Flame}
                      label={t("admin.profileActionsMenu.permanentlyDeleteProfile")}
                      danger
                      onClick={() => setConfirm("permanent")}
                    />
                  )}
                </>
              ) : (
                <>
                  {isHidden ? (
                    <MenuButton
                      icon={Eye}
                      label={t("admin.profileActionsMenu.unhideProfile")}
                      onClick={() =>
                        run(t("admin.profileActionsMenu.profileUnhidden"), () => unhideProfile(profile.id))
                      }
                    />
                  ) : (
                    <MenuButton
                      icon={EyeOff}
                      label={t("admin.profileActionsMenu.hideProfile")}
                      onClick={() => run(t("admin.profileActionsMenu.profileHidden"), () => hideProfile(profile.id))}
                    />
                  )}

                  {isPublished ? (
                    <MenuButton
                      icon={Undo2}
                      label={t("admin.profileActionsMenu.unpublishProfile")}
                      onClick={() =>
                        run(t("admin.profileActionsMenu.profileUnpublished"), () =>
                          publishProfile(profile.id, false)
                        )
                      }
                    />
                  ) : (
                    <MenuButton
                      icon={Send}
                      label={t("admin.profileActionsMenu.publishProfile")}
                      onClick={() =>
                        run(t("admin.profileActionsMenu.profilePublished"), () => publishProfile(profile.id, true))
                      }
                    />
                  )}

                  {isVerified ? (
                    <MenuButton
                      icon={ShieldOff}
                      label={t("admin.profileActionsMenu.unverifyProfile")}
                      onClick={() =>
                        run(t("admin.profileActionsMenu.profileUnverified"), () => unverifyProfile(profile.id))
                      }
                    />
                  ) : (
                    <MenuButton
                      icon={BadgeCheck}
                      label={t("admin.profileActionsMenu.verifyProfile")}
                      onClick={() =>
                        run(t("admin.profileActionsMenu.profileVerified"), () => verifyProfile(profile.id))
                      }
                    />
                  )}

                  {isArchived ? (
                    <MenuButton
                      icon={ArchiveRestore}
                      label={t("admin.profileActionsMenu.restoreProfile")}
                      onClick={() =>
                        run(t("admin.profileActionsMenu.profileRestored"), () => restoreArchivedProfile(profile.id))
                      }
                    />
                  ) : (
                    <MenuButton
                      icon={Archive}
                      label={t("admin.profileActionsMenu.archiveProfile")}
                      onClick={() =>
                        run(t("admin.profileActionsMenu.profileArchived"), () => archiveProfile(profile.id))
                      }
                    />
                  )}

                  <div className="my-1 border-t border-mist" />

                  <MenuButton
                    icon={Trash2}
                    label={t("admin.profileActionsMenu.deleteProfile")}
                    danger
                    onClick={() => setConfirm("delete")}
                  />
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={confirm === "delete"}
        title={t("admin.profileActionsMenu.deleteConfirmTitle")}
        description={t("admin.profileActionsMenu.deleteConfirmDescription")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onCancel={() => setConfirm(null)}
        onConfirm={() =>
          runConfirmed(t("admin.profileActionsMenu.profileDeleted"), () => deleteProfile(profile.id))
        }
      />
      <ConfirmModal
        open={confirm === "permanent"}
        title={t("admin.profileActionsMenu.permanentDeleteConfirmTitle")}
        description={t("admin.profileActionsMenu.permanentDeleteConfirmDescription")}
        confirmLabel={t("admin.profileActionsMenu.permanentDeleteConfirmLabel")}
        cancelLabel={t("common.cancel")}
        onCancel={() => setConfirm(null)}
        onConfirm={() =>
          runConfirmed(t("admin.profileActionsMenu.profilePermanentlyDeleted"), () =>
            permanentlyDeleteProfile(profile.id)
          )
        }
      />
    </div>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-navy hover:bg-offwhite dark:text-white"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE }}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-offwhite p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: DURATION.base, ease: EASE }}
          >
            <h3 className="font-heading text-base font-bold text-navy dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{description}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate hover:bg-mist/60"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
