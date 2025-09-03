import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ExternalLink, Wallet, Globe, ArrowRight, Heart } from "lucide-react"
import { ChainData } from "@/types/chain"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { getSemanticUrl } from "@/lib/url-mapping"
import { useFavorites } from "@/hooks/useLocalStorage"
import { useAccount, useConnect } from 'wagmi'
import { addNetworkToWallet } from '@/lib/wallet-config'
import { getWalletRpcEndpoints } from '@/lib/rpc-selector'
import { useToast } from '@/hooks/use-toast'

interface ChainCardProps {
  chain: ChainData
  className?: string
}

export function ChainCard({ chain, className }: ChainCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { toast } = useToast()
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite(chain.chainId)) {
      removeFromFavorites(chain.chainId)
    } else {
      addToFavorites(chain.chainId)
    }
  }

  const handleAddToWallet = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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

    try {
      await addNetworkToWallet(chain)
      toast({
        title: "Network Added Successfully!",
        description: `${chain.name} has been added to your wallet.`,
        variant: "success",
      })
    } catch (error: any) {
      if (error.message?.includes('User rejected')) {
        toast({
          title: "Request Cancelled",
          description: "You declined to add the network to your wallet.",
          variant: "destructive",
        })
      } else if (error.message?.includes('already exists')) {
        toast({
          title: "Network Already Added",
          description: `${chain.name} is already in your wallet.`,
        })
      } else {
        toast({
          title: "Error Adding Network",
          description: error.message || "Failed to add network to wallet.",
          variant: "destructive",
        })
      }
    }
  }

  const getChainIcon = () => {
    if (chain.icon) return chain.icon
    // Fallback to common chain icons based on name
    const iconMap: Record<string, string> = {
      ethereum: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
      polygon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
      binance: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
      avalanche: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",
      arbitrum: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
      base: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
    }
    const key = chain.name.toLowerCase()
    return iconMap[key] || `https://icons.llamao.fi/icons/chains/rsz_${key}.jpg`
  }

  return (
    <Card className={cn(
      "bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer",
      className
    )}>
      <Link to={getSemanticUrl(chain.chainId)} className="block">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={getChainIcon()} 
                alt={`${chain.name} logo`}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23374151'/%3E%3Ctext x='20' y='24' text-anchor='middle' fill='%23e5e7eb' font-family='Arial' font-size='12'%3E%3F%3C/text%3E%3C/svg%3E";
                }}
              />
              {chain.verified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-background rounded-full"></div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {chain.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleFavoriteToggle}
              className="h-8 w-8 p-0 shrink-0"
            >
              <Heart 
                className={`w-4 h-4 ${isFavorite(chain.chainId) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
              />
            </Button>
          </div>
        </CardHeader>
      </Link>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Chain ID:</span>
            <p className="font-mono text-foreground">{chain.chainId} (0x{chain.chainId.toString(16)})</p>
          </div>
          <div>
            <span className="text-muted-foreground">Currency:</span>
            <p className="font-semibold text-foreground">{chain.nativeCurrency.symbol}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddToWallet}
            className="flex-1 border-border hover:border-primary hover:bg-primary/10"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Add to Wallet
          </Button>
          
          <Link to={getSemanticUrl(chain.chainId)} onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="outline" 
              size="icon"
              className="border-border hover:border-primary hover:bg-primary/10"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          
          {chain.explorers && chain.explorers.length > 0 && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(chain.explorers[0].url, '_blank')
              }}
              className="border-border hover:border-primary hover:bg-primary/10"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          
          {chain.infoURL && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(chain.infoURL, '_blank')
              }}
              className="border-border hover:border-primary hover:bg-primary/10"
            >
              <Globe className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}