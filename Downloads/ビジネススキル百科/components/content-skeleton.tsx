import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface ContentSkeletonProps {
  count?: number
}

export function ContentSkeleton({ count = 6 }: ContentSkeletonProps) {
  return (
    <div className="flex flex-wrap -ml-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="min-w-0 w-full pl-4 pb-4 sm:w-1/2 lg:w-1/3">
          <Card className="overflow-hidden border bg-white rounded-lg h-full w-full">
            <Skeleton className="h-48 rounded-t-lg" />
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-5 w-full" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
