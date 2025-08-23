import React, { useState, useEffect, useCallback, useRef } from 'react'
import { EnhancedChainCard } from './enhanced-chain-card'
import { MergedChainData } from '@/types/chain'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface InfiniteChainGridProps {
  allChains: MergedChainData[]
  totalCount: number
  initialLoadSize: number
  loadMoreSize: number
  viewMode: 'grid' | 'list'
  isLoading?: boolean
}

export const InfiniteChainGrid: React.FC<InfiniteChainGridProps> = ({
  allChains,
  totalCount,
  initialLoadSize,
  loadMoreSize,
  viewMode,
  isLoading = false
}) => {
  const [displayedChains, setDisplayedChains] = useState<MergedChainData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initialize with initial load
  useEffect(() => {
    const initialChains = allChains.slice(0, initialLoadSize)
    setDisplayedChains(initialChains)
    setCurrentIndex(initialLoadSize)
    setHasMore(initialLoadSize < allChains.length)
  }, [allChains, initialLoadSize])

  // Load more chains function
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextChains = allChains.slice(currentIndex, currentIndex + loadMoreSize)
      setDisplayedChains(prev => [...prev, ...nextChains])
      setCurrentIndex(prev => prev + loadMoreSize)
      setHasMore(currentIndex + loadMoreSize < allChains.length)
      setIsLoadingMore(false)
    }, 300)
  }, [allChains, currentIndex, loadMoreSize, hasMore, isLoadingMore])

  // Intersection Observer for automatic loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore()
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before reaching the end
        threshold: 0.1
      }
    )

    observerRef.current = observer

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, hasMore, isLoadingMore])

  // Reset when allChains changes (e.g., new search/filter)
  useEffect(() => {
    const initialChains = allChains.slice(0, initialLoadSize)
    setDisplayedChains(initialChains)
    setCurrentIndex(initialLoadSize)
    setHasMore(initialLoadSize < allChains.length)
  }, [allChains, initialLoadSize])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (displayedChains.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-12 h-12 text-muted-foreground mx-auto mb-4">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No blockchain networks found</h3>
        <p className="text-muted-foreground mb-4 px-4 sm:px-0">
          Try adjusting your search terms or filters to find the network you're looking for
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {displayedChains.length} of {totalCount} networks
        </span>
        {hasMore && (
          <span>
            Scroll down to load more
          </span>
        )}
      </div>

      {/* Chain Grid/List */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          {displayedChains.map((chain) => (
            <EnhancedChainCard key={chain.chainId} chain={chain} viewMode="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {displayedChains.map((chain) => (
            <EnhancedChainCard key={chain.chainId} chain={chain} viewMode="grid" />
          ))}
        </div>
      )}

      {/* Load More Section */}
      <div ref={loadMoreRef} className="flex justify-center py-6">
        {isLoadingMore ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading more networks...</span>
          </div>
        ) : hasMore ? (
          <Button 
            onClick={loadMore} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            Load More Networks
            <span className="text-xs text-muted-foreground">
              ({Math.min(loadMoreSize, totalCount - displayedChains.length)} more)
            </span>
          </Button>
        ) : (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">All networks loaded</p>
            <p className="text-xs mt-1">
              {totalCount} networks displayed
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
