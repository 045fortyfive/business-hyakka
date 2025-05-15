import { Skeleton } from "@/components/ui/skeleton"

interface CategorySkeletonProps {
  count?: number
}

export function CategorySkeleton({ count = 6 }: CategorySkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center p-4">
          <Skeleton className="h-12 w-12 rounded-full mb-3" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
