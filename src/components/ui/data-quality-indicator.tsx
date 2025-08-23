import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { MergedChainData } from "@/types/chain"

interface DataQualityIndicatorProps {
  chain: MergedChainData
}

export function DataQualityIndicator({ chain }: DataQualityIndicatorProps) {
  const calculateQualityScore = (): number => {
    let score = 0
    const maxScore = 10

    // Basic required fields (40% weight)
    if (chain.name) score += 1
    if (chain.chainId) score += 1
    if (chain.rpc && chain.rpc.length > 0) score += 2

    // Enhanced data (60% weight)
    if (chain.icon) score += 1
    if (chain.explorers && chain.explorers.length > 0) score += 1
    if (chain.features && chain.features.length > 0) score += 1
    if (chain.rpcHealth) score += 2
    if (chain.bridges && chain.bridges.length > 0) score += 1

    return (score / maxScore) * 100
  }

  const qualityScore = calculateQualityScore()
  
  const getQualityBadge = () => {
    if (qualityScore >= 80) {
      return (
        <Badge variant="secondary" className="absolute top-2 right-2 bg-success/20 text-success border-success/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      )
    } else if (qualityScore >= 60) {
      return (
        <Badge variant="secondary" className="absolute top-2 right-2 bg-warning/20 text-warning border-warning/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Good
        </Badge>
      )
    } else if (qualityScore >= 40) {
      return (
        <Badge variant="secondary" className="absolute top-2 right-2 bg-muted/50 text-muted-foreground border-muted">
          Basic
        </Badge>
      )
    }
    return null
  }

  // Show quality indicator for all chains but without "Premium" tag
  if (qualityScore >= 80) {
    return (
      <Badge variant="secondary" className="bg-success/20 text-success border-success/30 text-xs">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    )
  } else if (qualityScore >= 60) {
    return (
      <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30 text-xs">
        <AlertCircle className="w-3 h-3 mr-1" />
        Good
      </Badge>
    )
  }
  
  return null
}