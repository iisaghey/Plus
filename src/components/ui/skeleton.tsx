import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-mist motion-reduce:animate-none",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonProfileCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist bg-white dark:bg-offwhite">
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="px-5 pb-5">
        <div className="-mt-10 mb-3">
          <Skeleton className="h-20 w-20 rounded-2xl border-4 border-white dark:border-offwhite" />
        </div>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <Skeleton className="mt-3 h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-4/5" />
      </div>
    </div>
  );
}
