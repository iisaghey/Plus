import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        verified: "bg-emerald/10 text-emerald ring-1 ring-emerald/20",
        pending: "bg-gold/10 text-gold ring-1 ring-gold/30",
        navy: "bg-navy/5 text-navy ring-1 ring-navy/10",
        teal: "bg-teal/10 text-teal ring-1 ring-teal/20",
        gold: "bg-gold/10 text-gold ring-1 ring-gold/25",
        neutral: "bg-mist/60 text-slate ring-1 ring-mist",
        "solid-navy": "bg-navy text-white",
      },
      size: {
        sm: "px-2.5 py-1 text-[10px]",
        md: "px-3 py-1.5 text-xs",
      },
    },
    defaultVariants: { variant: "navy", size: "sm" },
  }
);

export function Badge({
  className,
  variant,
  size,
  ...props
}: ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
