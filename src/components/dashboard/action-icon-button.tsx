import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const TONE = {
  teal: "bg-teal/15 text-teal hover:bg-teal hover:text-white",
  sky: "bg-sky/15 text-sky hover:bg-sky hover:text-white",
  gold: "bg-gold/15 text-gold hover:bg-gold hover:text-navy",
  red: "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white",
  navy: "bg-navy/10 text-navy hover:bg-navy hover:text-white dark:bg-white/10 dark:text-white",
} as const;

type CommonProps = {
  icon: LucideIcon;
  label: string;
  tone?: keyof typeof TONE;
  className?: string;
};

export function ActionIconButton({
  icon: Icon,
  label,
  tone = "navy",
  className,
  onClick,
  href,
  newTab,
  disabled,
  type = "button",
}: CommonProps & {
  onClick?: () => void;
  href?: string;
  newTab?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const cls = cn(
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-40",
    TONE[tone],
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        aria-label={label}
        title={label}
        className={cls}
      >
        <Icon className="h-3.5 w-3.5" />
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cls}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
