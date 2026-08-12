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
        "flex items-center gap-3 font-accent text-xs font-semibold uppercase tracking-[0.2em]",
        light ? "text-sky" : "text-teal",
        className
      )}
    >
      <span className={cn("h-px w-8", light ? "bg-sky/50" : "bg-teal/40")} />
      {children}
    </div>
  );
}
