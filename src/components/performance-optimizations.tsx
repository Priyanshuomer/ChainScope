import React, { Suspense, lazy, memo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load heavy components

export const LazyCharts = lazy(() => 
  import("./charts/advanced-rpc-chart").then(module => ({ default: module.AdvancedRpcChart }))
)

// Optimized image component with intersection observer
export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className, 
  fallback = null 
}: { 
  src: string
  alt: string
  className: string
  fallback?: React.ReactNode
}) => {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (imageError) {
    return fallback || (
      <div className={`${className} bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center`}>
        <div className="w-4 h-4 text-primary" />
      </div>
    )
  }

  if (!isInView) {
    return <Skeleton className={className} />
  }

  return (
    <img 
      ref={imgRef}
      src={src} 
      alt={alt}
      className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
      loading="lazy"
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageError(true)}
    />
  )
})

OptimizedImage.displayName = 'OptimizedImage'

// Performance optimized card wrapper
export const PerformanceCard = memo(({ 
  children, 
  className = "",
  ...props 
}: React.ComponentProps<typeof Card>) => {
  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${className}`}
      {...props}
    >
      {children}
    </Card>
  )
})

PerformanceCard.displayName = 'PerformanceCard'

// Loading skeleton for cards
export const CardSkeleton = memo(({ className = "" }: { className?: string }) => (
  <Card className={`animate-pulse ${className}`}>
    <CardContent className="p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </CardContent>
  </Card>
))

CardSkeleton.displayName = 'CardSkeleton'

// Grid skeleton for loading states
export const GridSkeleton = memo(({ 
  count = 6, 
  className = "" 
}: { 
  count?: number
  className?: string 
}) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
))

GridSkeleton.displayName = 'GridSkeleton'

// Debounced input component
export const DebouncedInput = memo(({ 
  value, 
  onChange, 
  delay = 300,
  ...props 
}: {
  value: string
  onChange: (value: string) => void
  delay?: number
} & React.ComponentProps<'input'>) => {
  const [localValue, setLocalValue] = React.useState(value)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue)
    }, delay)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <input
      value={localValue}
      onChange={handleChange}
      {...props}
    />
  )
})

DebouncedInput.displayName = 'DebouncedInput'

// Virtualized list component for large datasets
export const VirtualizedList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 60,
  containerHeight = 400,
  ...props 
}: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemHeight?: number
  containerHeight?: number
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const visibleItemCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length)

  const visibleItems = items.slice(startIndex, endIndex)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

VirtualizedList.displayName = 'VirtualizedList'

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    memoryUsage: 0,
    interactionTime: 0
  })

  const measureRender = React.useCallback((name: string) => {
    const start = performance.now()
    return () => {
      const end = performance.now()
      const renderTime = end - start
      setMetrics(prev => ({ ...prev, renderTime }))
      
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`${name} render time:`, renderTime.toFixed(2), 'ms')
      }
    }
  }, [])

  const measureInteraction = React.useCallback((name: string) => {
    const start = performance.now()
    return () => {
      const end = performance.now()
      const interactionTime = end - start
      setMetrics(prev => ({ ...prev, interactionTime }))
      
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`${name} interaction time:`, interactionTime.toFixed(2), 'ms')
      }
    }
  }, [])

  React.useEffect(() => {
    if ('memory' in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
        }))
      }
      
      updateMemory()
      const interval = setInterval(updateMemory, 5000)
      return () => clearInterval(interval)
    }
  }, [])

  return { metrics, measureRender, measureInteraction }
}

// Error boundary for performance components
export class PerformanceErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.NODE_ENV === 'development') {
      console.error('Performance component error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>
    }

    return this.props.children
  }
} 