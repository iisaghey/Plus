import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-5">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="mt-4 h-6 w-12" />
            <Skeleton className="mt-2 h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
