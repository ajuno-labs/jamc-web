"use client";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = "h-4 w-full", count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bg-gray-200 rounded animate-pulse ${className}`} />
      ))}
    </>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />;
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen p-4 md:p-6 border-0">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-32 bg-gray-200 rounded-lg mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <StatsSkeleton />
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
