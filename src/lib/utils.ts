import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMonthYear(date: string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  isCurrent?: boolean
) {
  const startLabel = formatMonthYear(start);
  if (isCurrent) return `${startLabel} — Present`;
  const endLabel = formatMonthYear(end);
  return endLabel ? `${startLabel} — ${endLabel}` : startLabel;
}
