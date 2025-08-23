import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/30", className)}
      {...props}
    />
  )
}

// Enhanced skeleton variants for different content types
function SkeletonCard() {
  return (
    <div className="p-6 bg-gradient-card border border-border/50 rounded-lg space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-gradient-card border border-border/50 rounded-lg">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="p-6 bg-gradient-card border border-border/50 rounded-lg">
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="h-64 bg-muted/20 rounded flex items-end justify-between p-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`w-8 bg-muted/40`} 
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonList, SkeletonChart }
