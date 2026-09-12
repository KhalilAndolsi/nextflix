import { Skeleton } from "@/components/ui/skeleton";

export function ThumsSlideSkeleton() {
  return (
    <section className="relative px-4 lg:px-14 mt-10 overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-7 w-48 md:h-8" />
        <Skeleton className="size-9 rounded-full" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid gap-2 min-w-0">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HeroSectionSkeleton() {
  return (
    <section className="h-[55vh] max-h-[550px] relative overflow-hidden">
      <Skeleton className="absolute inset-0 size-full rounded-none" />
      <div className="size-full flex flex-col justify-end gap-2.5 md:gap-4 px-4 md:px-14 py-8 relative z-10">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-10 lg:h-14 w-72 lg:w-96 max-w-full" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <div className="flex gap-4 mt-2.5">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </section>
  );
}

export function TopFiveSkeleton() {
  return (
    <section className="relative px-4 lg:px-14 overflow-hidden mt-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex min-w-0 items-end gap-3">
            <Skeleton className="h-14 w-10 shrink-0" />
            <Skeleton className="aspect-[2/3] w-24 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 py-1 grid content-end gap-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BestSectionsSkeleton() {
  return (
    <section className="px-4 lg:px-14 mt-14 flex flex-wrap gap-5">
      <div className="rounded-xl h-[50vh] max-h-[550px] w-[100%] lg:w-auto lg:flex-2 overflow-hidden flex flex-col">
        <div className="py-4 flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
        <div className="w-full flex-1 relative rounded-xl overflow-hidden">
          <Skeleton className="absolute inset-0 size-full rounded-xl" />
          <div className="p-4 h-full flex flex-col items-start justify-end gap-2 relative z-10">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-9 w-64 max-w-full" />
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-sm" />
            <div className="flex gap-4 mt-5">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl h-[50vh] max-h-[550px] w-[100%] md:flex-1 lg:w-auto overflow-hidden flex flex-col min-w-0">
        <div className="py-4 flex items-center justify-between">
          <Skeleton className="h-7 w-36" />
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[56px_1fr] gap-3 items-center min-w-0">
              <Skeleton className="h-20 w-14 rounded-md" />
              <div className="min-w-0 grid gap-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl h-[50vh] max-h-[550px] w-[100%] md:flex-1 lg:w-auto overflow-hidden flex flex-col min-w-0">
        <div className="py-4 flex items-center justify-between">
          <Skeleton className="h-7 w-36" />
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[56px_1fr] gap-3 items-center min-w-0">
              <Skeleton className="h-20 w-14 rounded-md" />
              <div className="min-w-0 grid gap-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BilledCastSkeleton() {
  return (
    <div>
      <p className="mb-4 text-lg font-medium">
        <Skeleton className="h-6 w-40" />
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid gap-1.5 overflow-hidden rounded-xl bg-primary/20 p-2">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AutoSwiperSkeleton({ type = "h" }: { type?: "h" | "v" }) {
  return (
    <div
      className={
        type === "h"
          ? "grid grid-cols-2 xl:grid-cols-4 gap-2.5"
          : "grid grid-cols-3 md:grid-cols-6 xl:grid-cols-8 gap-2.5"
      }>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="grid gap-1.5">
          <Skeleton className="aspect-[2/3] w-full rounded-md" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="p-3 grid gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="h-[72px] w-12 rounded-md shrink-0" />
          <div className="flex-1 py-1 grid gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}