import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="34" height="34" rx="9" fill={light ? "#FFFFFF" : "#0B1F3A"} fillOpacity={light ? 0.08 : 1} />
        <path
          d="M17 6L27 10.5V16.2C27 21.9 22.9 27.2 17 28.9C11.1 27.2 7 21.9 7 16.2V10.5L17 6Z"
          fill={light ? "none" : "#0A6E8A"}
          stroke={light ? "#FFFFFF" : "none"}
          strokeWidth={light ? 1.4 : 0}
        />
        <path
          d="M12.5 17.2L15.6 20.3L21.7 13.8"
          stroke={light ? "#38BDF8" : "#FFFFFF"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          "font-heading text-lg font-bold tracking-tight",
          light ? "text-white" : "text-navy"
        )}
      >
        Aqoonsi<span className="text-teal">Plus</span>
      </span>
    </Link>
  );
}
