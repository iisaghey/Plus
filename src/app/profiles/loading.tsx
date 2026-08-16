import { Skeleton, SkeletonProfileCard } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-3 h-8 w-72" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-mist p-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonProfileCard key={i} />
        ))}
      </div>
    </div>
  );
}
