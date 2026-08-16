import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="AqoonsiPlus"
        width={34}
        height={34}
        priority
        className="h-[34px] w-[34px] object-contain"
      />
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
