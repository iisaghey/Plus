"use client";

import { useRef, useState } from "react";
import { QrCode, Download, Printer, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export function ProfileQrCode({
  slug,
  fullName,
}: {
  slug: string;
  fullName: string;
}) {
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
    toast.success("Profile link copied to clipboard");
  }

  function handlePrint() {
    const svg = wrapperRef.current?.innerHTML;
    const printWindow = window.open("", "_blank", "width=420,height=520");
    if (!printWindow || !svg) return;
    printWindow.document.write(`
      <html>
        <head><title>${fullName} — AqoonsiPlus QR</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
          ${svg}
          <p style="margin-top:16px;font-size:14px;color:#0F172A;">Scan to view ${fullName}'s verified profile</p>
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
        aria-label="Show QR code"
      >
        <QrCode className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl bg-white dark:bg-offwhite p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="font-heading text-sm font-bold text-navy dark:text-white">
                Scan to View Verified Profile
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-slate hover:text-navy dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={wrapperRef}
              className="mx-auto mt-4 flex w-fit items-center justify-center rounded-xl border border-mist p-4"
            >
              <QRCodeSVG value={url} size={192} fgColor="#0B1F3A" level="M" />
            </div>

            <p className="mt-3 text-xs text-slate">{fullName}</p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                onClick={handleDownload}
                className="flex flex-col items-center gap-1 rounded-xl border border-mist py-2.5 text-xs font-medium text-navy dark:text-white hover:border-teal hover:text-teal"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1 rounded-xl border border-mist py-2.5 text-xs font-medium text-navy dark:text-white hover:border-teal hover:text-teal"
              >
                <QrCode className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="flex flex-col items-center gap-1 rounded-xl border border-mist py-2.5 text-xs font-medium text-navy dark:text-white hover:border-teal hover:text-teal"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
