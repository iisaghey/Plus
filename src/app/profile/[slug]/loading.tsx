import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-52 w-full rounded-none sm:h-64" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end">
          <Skeleton className="h-32 w-32 shrink-0 rounded-3xl border-4 border-white dark:border-offwhite sm:h-40 sm:w-40" />
          <div className="space-y-2 pb-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex gap-4 border-b border-mist pb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
