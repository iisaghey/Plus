import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "font-accent text-xs font-semibold uppercase tracking-[0.2em]",
        light ? "text-sky" : "text-teal",
        className
      )}
    >
      {children}
    </div>
  );
}
