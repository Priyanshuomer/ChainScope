import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, Loader2, ChevronDown } from "lucide-react"
import { OptimizedChainCard } from "./optimized-chain-card"
import { useFavorites } from "@/hooks/useLocalStorage"
import { useChains } from "@/hooks/useChains"

interface FavoritesModalProps {
  favoriteCount: number
}

export function FavoritesModal({ favoriteCount }: FavoritesModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const { favorites } = useFavorites()
  const { data: chains, isLoading } = useChains()

  const favoriteChains = chains?.filter(chain => favorites.includes(chain.chainId)) || []
  const displayedChains = showAll ? favoriteChains : favoriteChains.slice(0, 2)
  const hasMore = favoriteChains.length > 2

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative glass-card">
          <Heart className="h-4 w-4 text-primary" />
          {favoriteCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-medium">
              {favoriteCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-sf-pro-display">
            <Heart className="h-5 w-5 text-primary" />
            Your Favorite Networks
            <span className="text-sm font-normal text-muted-foreground">
              ({favoriteCount} networks)
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading your favorites...</span>
            </div>
          ) : favoriteChains.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet and start adding networks to your favorites
              </p>
              <Button onClick={() => setIsOpen(false)} className="btn-gradient">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explore Networks
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pr-2">
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {favoriteChains.map((chain) => (
                  <OptimizedChainCard 
                    key={chain.chainId} 
                    chain={chain}
                    className="premium-card hover:scale-[1.02] transition-all duration-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}