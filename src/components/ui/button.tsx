import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-teal text-white shadow-sm shadow-teal/20 hover:bg-aqoonsi hover:shadow-md hover:shadow-teal/25",
        navy: "bg-navy text-white hover:bg-royal shadow-sm shadow-navy/20",
        outline:
          "border border-mist bg-white text-navy hover:border-teal hover:text-teal dark:bg-offwhite dark:text-white",
        ghost: "text-navy hover:bg-offwhite dark:text-white",
        "outline-white":
          "border border-white/30 text-white hover:bg-white/10 hover:border-white/60",
        gold: "bg-gold text-navy hover:brightness-95 shadow-sm shadow-gold/20",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-[3.25rem] px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & { href?: undefined };

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
