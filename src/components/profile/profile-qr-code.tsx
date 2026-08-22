"use client";

import { useRef, useState } from "react";
import { QrCode, Download, Printer, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";
import { useTranslation } from "@/i18n/language-provider";

export function ProfileQrCode({
  slug,
  fullName,
  canManageQr,
}: {
  slug: string;
  fullName: string;
  canManageQr: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/profile/${slug}`
      : `/profile/${slug}`;

  function handleDownload() {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const link = document.createElement("a");
      link.download = `${slug}-qr-code.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${fullName} | AqoonsiPlus`, url });
      } catch {
        // user cancelled
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success(t("profilesPublic.qrCode.linkCopied"));
  }

  function handlePrint() {
    const svg = wrapperRef.current?.innerHTML;
    const printWindow = window.open("", "_blank", "width=420,height=520");
    if (!printWindow || !svg) return;
    const printDocTitle = t("profilesPublic.qrCode.printDocTitle").replace("{name}", fullName);
    const printCaption = t("profilesPublic.qrCode.printCaption").replace("{name}", fullName);
    printWindow.document.write(`
      <html>
        <head><title>${printDocTitle}</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
          ${svg}
          <p style="margin-top:16px;font-size:14px;color:#0F172A;">${printCaption}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-mist text-slate hover:border-teal hover:text-teal"
        aria-label={t("profilesPublic.qrCode.showAriaLabel")}
      >
        <QrCode className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
          >
            <motion.div
              className="w-full max-w-xs rounded-2xl bg-white dark:bg-offwhite p-6 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: DURATION.base, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <p className="font-heading text-sm font-bold text-navy dark:text-white">
                  {t("profilesPublic.qrCode.modalHeading")}
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate hover:text-navy dark:hover:text-white"
                  aria-label={t("common.close")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <motion.div
                ref={wrapperRef}
                className="mx-auto mt-4 flex w-fit items-center justify-center rounded-xl border border-mist p-4"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: DURATION.base, ease: EASE, delay: 0.1 }}
              >
                <QRCodeSVG value={url} size={192} fgColor="#0B1F3A" level="M" />
              </motion.div>

              <p className="mt-3 text-xs text-slate">{fullName}</p>

              <div
                className={`mt-5 grid gap-2 ${canManageQr ? "grid-cols-3" : "grid-cols-1"}`}
              >
                {canManageQr && (
                  <button
                    onClick={handleDownload}
                    className="flex flex-col items-center gap-1 rounded-xl border border-mist py-2.5 text-xs font-medium text-navy dark:text-white hover:border-teal hover:text-teal"
                  >
                    <Download className="h-4 w-4" />
                    {t("profilesPublic.qrCode.download")}
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 rounded-xl border border-mist py-2.5 text-xs font-medium text-navy dark:text-white hover:border-teal hover:text-teal"
                >
                  <QrCode className="h-4 w-4" />
                  {t("profilesPublic.qrCode.share")}
                </button>
                {canManageQr && (
                  <button
                    onClick={handlePrint}
                    className="flex flex-col items-center gap-1 rounded-xl border border-mist py-2.5 text-xs font-medium text-navy dark:text-white hover:border-teal hover:text-teal"
                  >
                    <Printer className="h-4 w-4" />
                    {t("profilesPublic.qrCode.print")}
                  </button>
                )}
              </div>
              {!canManageQr && (
                <p className="mt-3 text-[11px] text-slate">
                  {t("profilesPublic.qrCode.adminOnlyNote")}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
