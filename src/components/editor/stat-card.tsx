import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT_CLASSES = {
  teal: "bg-teal/10 text-teal",
  gold: "bg-gold/10 text-gold",
  emerald: "bg-emerald/10 text-emerald",
  sky: "bg-sky/10 text-sky",
  navy: "bg-navy/5 text-navy dark:bg-white/5 dark:text-white",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "teal",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: keyof typeof ACCENT_CLASSES;
}) {
  return (
    <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-5">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          ACCENT_CLASSES[accent]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 font-heading text-2xl font-bold text-navy dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate">{label}</p>
    </div>
  );
}
