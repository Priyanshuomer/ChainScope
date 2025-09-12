import React, { memo, lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Heart, ExternalLink, Info, Loader2, Wallet, Plus } from "lucide-react"
import { ChainData } from "@/types/chain"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/hooks/useLocalStorage"
import { useNavigate } from "react-router-dom"
import { useAccount } from 'wagmi'
import { useConnect } from 'wagmi'
import { addNetworkToWallet } from '../appkit-config'
import { getWalletRpcEndpoints } from '@/lib/rpc-selector'
import { toast } from "@/hooks/use-toast"

interface OptimizedChainCardProps {
  chain: ChainData
  className?: string
}

const OptimizedChainCard = memo(function OptimizedChainCard({ chain, className }: OptimizedChainCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const navigate = useNavigate()
  
  const handleFavoriteToggle = () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet Required",
        description: "Please connect your wallet to save favorites",
        variant: "default",
      })
      const connector = connectors[0]
      if (connector && connector.ready) {
        connect({ connector })
      }
      return
    }
    
    if (isFavorite(chain.chainId)) {
      removeFromFavorites(chain.chainId)
      toast({
        title: "Removed from Favorites",
        description: `${chain.name} has been removed from your favorites`,
      })
    } else {
      addToFavorites(chain.chainId)
      toast({
        title: "Added to Favorites",
        description: `${chain.name} has been added to your favorites`,
      })
    }
  }

  const handleAddToWallet = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet Required",
        description: "Please connect your wallet to add networks",
        variant: "destructive",
      })
      const connector = connectors[0]
      if (connector && connector.ready) {
        connect({ connector })
      }
      return
    }

    // Get the best RPC endpoints for this chain
    const selectedRpcEndpoints = getWalletRpcEndpoints(chain)
    
    if (selectedRpcEndpoints.length === 0) {
      toast({
        title: "No Valid RPC Endpoints",
        description: "This network has no valid RPC endpoints. Please add the network manually.",
        variant: "destructive",
      })
      return
    }

    try {
      await addNetworkToWallet(chain)
      toast({
        title: "Network Added Successfully!",
        description: `${chain.name} has been added to your wallet with official RPC endpoints.`,
      })
    } catch (error: any) {
      // Handle specific error cases
      if (error.message?.includes('User rejected')) {
        toast({
          title: "Request Cancelled",
          description: "You declined to add the network to your wallet.",
          variant: "destructive",
        })
      } else if (error.message?.includes('already exists') || error.message?.includes('already added')) {
        toast({
          title: "Network Already Added",
          description: `${chain.name} is already in your wallet.`,
        })
      } else if (error.message?.includes('No valid RPC URLs')) {
        toast({
          title: "No Valid RPC Endpoints",
          description: "This network has no valid RPC endpoints. Please add the network manually.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error Adding Network",
          description: error.message || "Failed to add network to wallet. Please try again or add manually.",
          variant: "destructive",
        })
      }
    }
  }

  const getChainIcon = () => {
    if (chain.icon) return chain.icon
    if (chain.logo) return chain.logo
    
    // Fallback icons for common chains
    const name = chain.name.toLowerCase()
    if (name.includes('ethereum')) return 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    if (name.includes('polygon')) return 'https://cryptologos.cc/logos/polygon-matic-logo.png'
    if (name.includes('arbitrum')) return 'https://cryptologos.cc/logos/arbitrum-arb-logo.png'
    if (name.includes('optimism')) return 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png'
    if (name.includes('avalanche')) return 'https://cryptologos.cc/logos/avalanche-avax-logo.png'
    if (name.includes('binance') || name.includes('bsc')) return 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
    
    return '/placeholder.svg'
  }

  return (
    <Card className={cn("premium-card hover:shadow-glow transition-all duration-300 group border-border/50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={getChainIcon()} 
                alt={`${chain.name} logo`}
                className="w-12 h-12 rounded-xl object-cover bg-secondary ring-2 ring-border/50"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg'
                }}
              />
              {chain.verified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <div className="w-2 h-2 bg-background rounded-full"></div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg leading-tight mb-1">
                {chain.name}
              </h3>
              <div className="flex items-center gap-2">
                <StatusBadge variant={chain.isTestnet ? "testnet" : "mainnet"}>
                  {chain.isTestnet ? "Testnet" : "Mainnet"}
                </StatusBadge>
                {chain.verified && (
                  <StatusBadge variant="verified">
                    Verified
                  </StatusBadge>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteToggle}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-primary/10"
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-all duration-200",
                isFavorite(chain.chainId) ? "fill-primary text-primary scale-110" : "text-muted-foreground hover:text-primary"
              )} 
            />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/30 rounded-lg p-3">
          <div>
            <span className="text-muted-foreground text-xs font-medium">Chain ID</span>
            <p className="font-mono text-foreground font-bold text-base">{chain.chainId}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-medium">Currency</span>
            <p className="font-bold text-foreground text-base">{chain.nativeCurrency.symbol}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleAddToWallet}
            className="w-full btn-gradient h-10 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Wallet
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/chain/${chain.chainId}`)}
              className="flex-1 glass-card hover:bg-secondary/50"
            >
              <Info className="h-3 w-3 mr-1" />
              Details
            </Button>
            
            {chain.explorers && chain.explorers.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(chain.explorers[0].url, '_blank')}
                className="flex-1 glass-card hover:bg-secondary/50"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Explorer
              </Button>
            )}
            
            {chain.infoURL && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(chain.infoURL, '_blank')}
                className="flex-1 glass-card hover:bg-secondary/50"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Website
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

export { OptimizedChainCard }