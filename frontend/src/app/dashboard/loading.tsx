import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">
      {/* Hero skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* KPI skeletons */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[164px] rounded-2xl" />
        ))}
      </div>

      {/* Content skeletons */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Skeleton className="h-[480px] rounded-2xl" />
        <Skeleton className="h-[480px] rounded-2xl" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[340px] rounded-2xl" />
        <Skeleton className="h-[340px] rounded-2xl" />
      </div>
    </div>
  );
}
