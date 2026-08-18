import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function Logo({
  light,
  surface = "light",
  className,
}: {
  light?: boolean;
  /** Badge treatment — use "dark" when the surrounding background is already navy/dark, so the icon still contrasts. */
  surface?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl p-1.5 shadow-sm",
          surface === "dark" ? "bg-white/10 ring-1 ring-white/15" : "bg-navy ring-1 ring-white/10"
        )}
      >
        <Image
          src="/logo.png"
          alt="AqoonsiPlus"
          width={34}
          height={34}
          priority
          className="h-full w-full object-contain"
        />
      </span>
      <span
        className={cn(
          "font-heading text-lg font-bold tracking-tight",
          light ? "text-white" : "text-navy dark:text-white"
        )}
      >
        Aqoonsi<span className="text-teal">Plus</span>
      </span>
    </Link>
  );
}
