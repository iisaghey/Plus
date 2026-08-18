import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  total,
  buildHref,
}: {
  page: number;
  pageCount: number;
  total: number;
  buildHref: (page: number) => string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mist px-4 py-3 text-xs text-slate">
      <span>{total} total</span>
      {pageCount > 1 && (
        <div className="flex items-center gap-1">
          <PageLink
            href={buildHref(Math.max(1, page - 1))}
            disabled={page === 1}
            icon={<ChevronLeft className="h-3.5 w-3.5" />}
          />
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildHref(p)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                p === page
                  ? "bg-teal text-white"
                  : "border border-mist hover:border-teal hover:text-teal"
              )}
            >
              {p}
            </Link>
          ))}
          <PageLink
            href={buildHref(Math.min(pageCount, page + 1))}
            disabled={page === pageCount}
            icon={<ChevronRight className="h-3.5 w-3.5" />}
          />
        </div>
      )}
    </div>
  );
}

function PageLink({
  href,
  disabled,
  icon,
}: {
  href: string;
  disabled: boolean;
  icon: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-mist opacity-40">
        {icon}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-mist transition-colors hover:border-teal hover:text-teal"
    >
      {icon}
    </Link>
  );
}
