import React, { useEffect, useState, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Wifi, 
  Shield,
  Star,
  TrendingUp,
  Users,
  Activity,
  Globe,
  Zap,
  ArrowRight,
  Wallet
} from "lucide-react"
import { Link } from 'react-router-dom'
import { MergedChainData } from '@/types/chain'
import { getSemanticUrl } from '@/lib/url-mapping'
import { useToast } from '@/hooks/use-toast'
import { addNetworkToWallet } from '../appkit-config'
import {ChainIcon} from './ChainIcon';

interface EnhancedChainCardProps {
  chain: MergedChainData
  viewMode?: 'grid' | 'list'
  className?: string
}

export const EnhancedChainCard = memo(({ 
  chain, 
  viewMode = 'grid',
  className = "" 
}: EnhancedChainCardProps) => {
  const { toast } = useToast()

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'offline': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'slow': return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'online': return <Badge variant="default" className="bg-green-500/20 text-green-600">Online</Badge>
      case 'offline': return <Badge variant="destructive">Offline</Badge>
      case 'slow': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Slow</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  // const calculateHealthScore = () => {

  //   // console.log("HEYYYY", chain.rpc);
  //   if (!chain.rpcEndpoints || chain.rpcEndpoints.length === 0) return 0
  //   //  console.log("OM");

    
  //   const onlineEndpoints = chain.rpcEndpoints.filter(rpc => rpc.status === 'online')
  //   // console.log(onlineEndpoints);
  //   return Math.round((onlineEndpoints.length / chain.rpcEndpoints.length) * 100)
  // }




const calculateHealthScore = () => {
  // Check if rpcHealth exists and has at least one defined metric
  if (
    !chain.rpcHealth || (
      chain.rpcHealth.averageLatency === undefined &&
      chain.rpcHealth.reliabilityScore === undefined &&
      chain.rpcHealth.privacyScore === undefined
    )
  ) {
    return 0
  }

  // Destructure with default fallbacks
  const {
    averageLatency = 1000, // high latency = bad by default
    reliabilityScore = 0,
    privacyScore = 0,
  } = chain.rpcHealth

  // Normalize latency to a 0-100 score (lower latency is better)
  const latencyScore = Math.max(0, Math.min(1, (1000 - averageLatency) / 1000)) * 100

  // Weight how important each metric is
  const weights = {
    reliability: 0.5,
    latency: 0.3,
    privacy: 0.2,
  }

  // Compute weighted composite score
  const score =
    reliabilityScore * weights.reliability +
    latencyScore * weights.latency +
    privacyScore * weights.privacy

  // Clamp and round score to 0-100
  return Math.round(Math.max(0, Math.min(100, score)))
}



//   const calculateHealthScore = () => {
//   const totalRpcs = chain.rpcEndpoints?.length || 0
//   const onlineRpcs = chain.rpcEndpoints?.filter(ep => ep.status === 'online').length || 0
//   return totalRpcs > 0 ? Math.round((onlineRpcs / totalRpcs) * 100) : 0
// }



  const healthScore = calculateHealthScore()
  const [isAddingToWallet, setIsAddingToWallet] = useState(false)
  // console.log("health   : ",healthScore);

const getChainIconUrl = (chain) => {
  if (!chain) return null;

  // Direct URLs first
  if (chain.icon?.startsWith("http")) return chain.icon;
  if (chain.logo?.startsWith("http")) return chain.logo;
  if (chain.explorers?.[0]?.icon?.startsWith("http")) return chain.explorers[0].icon;

  // Ethereum-lists slug → official location
  if (chain.icon) {
    // Try .svg first
    return `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/icons/${chain.icon}/logo.svg`;
  }

  return null;
};




  if (viewMode === 'list') {
    return (
      <Card className={`bg-gradient-card border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Chain Icon */}
             <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
  <ChainIcon chain={chain} size={32} />
</div>

              {/* Chain Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold truncate">{chain.name}</h3>
                  {chain.verified && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Shield className="w-4 h-4 text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified network</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Chain ID: {chain.chainId}</span>
                  <span>•</span>
                  <span>{chain.nativeCurrency?.symbol || 'ETH'}</span>
                  {chain.isTestnet && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">Testnet</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-semibold">{chain.rpc?.length || 0}</div>
                <div className="text-xs text-muted-foreground">RPCs</div>
              </div>
              {/* <div className="text-center">
                <div className="text-lg font-semibold">{healthScore}%</div>
                <div className="text-xs text-muted-foreground">Health</div>
              </div> */}
              <div className="text-center">
                <div className="text-lg font-semibold">{chain.explorers?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Explorers</div>
              </div>
            </div>
       <div className="flex items-center space-x-2 ml-6"> 
             <Tooltip>
            <TooltipTrigger asChild>
            <Button
          variant="ghost"
          size="icon"
          onClick={async () => {
            try {
              setIsAddingToWallet(true)
              await addNetworkToWallet(chain)

              toast({
                title: "Network Added Successfully!",
                description: `${chain.name} has been added to your wallet with the best available RPC endpoints.`,
                variant: "success",
              })
            } catch (error: any) {
              if (error.code === 4001 || error.message?.includes("User rejected")) {
                toast({
                  title: "Request Cancelled",
                  description: "You declined to add the network to your wallet.",
                  variant: "destructive",
                })
              } else if (
                error.code === -32602 ||
                error.message?.includes("Invalid network parameters")
              ) {
                toast({
                  title: "Invalid Network Configuration",
                  description:
                    "The network configuration is invalid. Please try again or add manually.",
                  variant: "destructive",
                })
              } else if (
                error.code === -32000 ||
                error.message?.includes("already exists") ||
                error.message?.includes("already added")
              ) {
                toast({
                  title: "Network Added",
                  description: `${chain.name} is already added in your wallet.`,
                  variant: "success",
                })
              } else if (error.message?.includes("No official or reliable RPC endpoints")) {
                toast({
                  title: "No Official RPC Endpoints",
                  description:
                    "For security reasons, we only add networks with verified RPC endpoints to wallets. Please add this network manually using official RPC URLs.",
                  variant: "destructive",
                })
              } 
              // ✅ NEW CASE — no healthy RPCs online
              else if (error.message?.includes("No healthy RPC endpoints responded")) {
                toast({
                  title: "No Healthy RPCs Available",
                  description:
                    "None of the RPC endpoints for this network are currently healthy. Please try again later.",
                  variant: "destructive",
                })
              } 
              else if (error.message?.includes("No Ethereum wallet detected")) {
                toast({
                  title: "Wallet Not Detected",
                  description: "Please install and enable MetaMask or another Web3 wallet.",
                  variant: "destructive",
                })
              } else if (!error.message) {
                toast({
                  title: "Unable to Add Network",
                  description: "Please ensure your wallet is unlocked and try again.",
                  variant: "destructive",
                })
              } else {
                toast({
                  title: "Failed to Add Network",
                  description:
                    error.message ||
                    "Please try again or add the network manually from the details below.",
                  variant: "destructive",
                })
              }
            } finally {
              setIsAddingToWallet(false)
            }
          }}
        >
          <Wallet className="w-5 h-5" />
        </Button>

            </TooltipTrigger>
            <TooltipContent>
              <p>Add Network to Wallet</p>
            </TooltipContent>
          </Tooltip>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={getSemanticUrl(chain.chainId)}>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
        </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gradient-card border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Chain Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
  <ChainIcon chain={chain} size={32} />
</div>

            {/* Chain Info */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate mb-1">{chain.name}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Chain ID: {chain.chainId}</span>
                <span>•</span>
                <span>{chain.nativeCurrency?.symbol || 'ETH'}</span>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col items-end space-y-1">
            {chain.verified && (
              <Tooltip>
                <TooltipTrigger>
                  <Shield className="w-5 h-5 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verified network</p>
                </TooltipContent>
              </Tooltip>
            )}
            {chain.isTestnet && (
              <Badge variant="secondary" className="text-xs">Testnet</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health Score */}
        <div className="space-y-2">
          {/* <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">RPC Health</span>
            <span className="font-medium">{healthScore}%</span>
          </div> */}
          {/* <Progress value={healthScore} className="h-2" /> */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {/* <Wifi className="w-3 h-3" /> */}
            {/* <span>{chain.rpc?.length || 0} endpoints</span> */}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-semibold">{chain.rpc?.length || 0}</div>
            <div className="text-xs text-muted-foreground">RPC Endpoints</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-semibold">{chain.explorers?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Explorers</div>
          </div>
        </div>

        {/* Actions */}

<div className="flex items-center space-x-2">
  <Button className="flex-1" asChild>
    <Link to={getSemanticUrl(chain.chainId)}>
      View Details
      <ArrowRight className="w-4 h-4 ml-2" />
    </Link>
  </Button>

  <Tooltip>
    <TooltipTrigger asChild>
     <Button
  variant="ghost"
  size="icon"
  onClick={async () => {
    try {
      setIsAddingToWallet(true)
      await addNetworkToWallet(chain)

      toast({
        title: "Network Added Successfully!",
        description: `${chain.name} has been added to your wallet with the best available RPC endpoints.`,
        variant: "success",
      })
    } catch (error: any) {
      if (error.code === 4001 || error.message?.includes("User rejected")) {
        toast({
          title: "Request Cancelled",
          description: "You declined to add the network to your wallet.",
          variant: "destructive",
        })
      } else if (
        error.code === -32602 ||
        error.message?.includes("Invalid network parameters")
      ) {
        toast({
          title: "Invalid Network Configuration",
          description:
            "The network configuration is invalid. Please try again or add manually.",
          variant: "destructive",
        })
      } else if (
        error.code === -32000 ||
        error.message?.includes("already exists") ||
        error.message?.includes("already added")
      ) {
        toast({
          title: "Network Added",
          description: `${chain.name} is already added in your wallet.`,
          variant: "success",
        })
      } else if (error.message?.includes("No official or reliable RPC endpoints")) {
        toast({
          title: "No Official RPC Endpoints",
          description:
            "For security reasons, we only add networks with verified RPC endpoints to wallets. Please add this network manually using official RPC URLs.",
          variant: "destructive",
        })
      } 
      // ✅ NEW CASE — no healthy RPCs online
      else if (error.message?.includes("No healthy RPC endpoints responded")) {
        toast({
          title: "No Healthy RPCs Available",
          description:
            "None of the RPC endpoints for this network are currently healthy. Please try again later.",
          variant: "destructive",
        })
      } 
      else if (error.message?.includes("No Ethereum wallet detected")) {
        toast({
          title: "Wallet Not Detected",
          description: "Please install and enable MetaMask or another Web3 wallet.",
          variant: "destructive",
        })
      } else if (!error.message) {
        toast({
          title: "Unable to Add Network",
          description: "Please ensure your wallet is unlocked and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Failed to Add Network",
          description:
            error.message ||
            "Please try again or add the network manually from the details below.",
          variant: "destructive",
        })
      }
    } finally {
      setIsAddingToWallet(false)
    }
  }}
>
  <Wallet className="w-5 h-5" />
</Button>

    </TooltipTrigger>
    <TooltipContent>
      <p>Add Network to Wallet</p>
    </TooltipContent>
  </Tooltip>
</div>

      </CardContent>
    </Card>
  )
})

EnhancedChainCard.displayName = 'EnhancedChainCard'