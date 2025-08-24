import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MergedChainData } from "@/types/chain"
import { ExternalLink, Copy, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { analytics } from "@/lib/analytics"
import { scoreRpcEndpoint } from '@/lib/rpc-selector'

interface SimplifiedRpcSectionProps {
  chain: MergedChainData
}

export const SimplifiedRpcSection = ({ chain }: SimplifiedRpcSectionProps) => {
  const { toast } = useToast()

  // Sort RPC endpoints using official RPC selection logic
  const sortedRpcEndpoints = useMemo(() => {
    if (!chain.rpc || chain.rpc.length === 0) return []

    return chain.rpc
      .map(rpc => {
        const rpcEndpoint = chain.rpcEndpoints?.find(ep => ep.url === rpc)
        return {
          url: rpc,
          status: rpcEndpoint?.status || 'unknown',
          latency: rpcEndpoint?.latency,
          endpoint: rpcEndpoint,
          score: scoreRpcEndpoint(rpcEndpoint || rpc)
        }
      })
      .sort((a, b) => {
        // First sort by score (higher is better - official RPCs get priority)
        if (a.score !== b.score) {
          return b.score - a.score
        }
        
        // If same score, sort by status: online > slow > offline > unknown
        const statusPriority = {
          'online': 0,
          'slow': 1,
          'offline': 2,
          'unknown': 3
        }
        
        const statusDiff = statusPriority[a.status] - statusPriority[b.status]
        if (statusDiff !== 0) return statusDiff
        
        // If same status, sort by latency (lower is better)
        if (a.latency && b.latency) {
          return a.latency - b.latency
        }
        
        // If one has latency and other doesn't, prioritize the one with latency
        if (a.latency && !b.latency) return -1
        if (!a.latency && b.latency) return 1
        
        // If no latency info, sort alphabetically by URL
        return a.url.localeCompare(b.url)
      })
  }, [chain.rpc, chain.rpcEndpoints])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      
      // Track RPC copy event
      analytics.trackRpcCopy(chain.chainId, text)
      
      toast({
        title: "Copied to Clipboard!",
        description: `${label} has been copied to your clipboard. You can now paste it in your wallet or application.`,
      })
    } catch (error) {
      // Fallback for older browsers or when clipboard API is not available
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        toast({
          title: "Copied to Clipboard!",
          description: `${label} has been copied to your clipboard.`,
        })
      } catch (fallbackError) {
        toast({
          title: "Copy Failed",
          description: "Please copy the RPC URL manually from the address bar.",
          variant: "destructive"
        })
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'slow': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'offline': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge variant="default" className="bg-green-500">Online</Badge>
      case 'slow': return <Badge variant="secondary">Slow</Badge>
      case 'offline': return <Badge variant="destructive">Offline</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Count endpoints by status
  const statusCounts = useMemo(() => {
    const counts = { online: 0, slow: 0, offline: 0, unknown: 0 }
    sortedRpcEndpoints.forEach(endpoint => {
      counts[endpoint.status as keyof typeof counts]++
    })
    return counts
  }, [sortedRpcEndpoints])

  const totalRpcs = chain.rpc.length
  const onlineRpcs = statusCounts.online

  return (
    <div className="space-y-6">
      {/* RPC Summary */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>
            RPC Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Status Summary:</span>
              <div className="flex gap-2">
                {statusCounts.online > 0 && (
                  <Badge variant="default" className="bg-green-500 text-xs">
                    {statusCounts.online} Online
                  </Badge>
                )}
                {statusCounts.slow > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {statusCounts.slow} Slow
                  </Badge>
                )}
                {statusCounts.offline > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {statusCounts.offline} Offline
                  </Badge>
                )}
                {statusCounts.unknown > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {statusCounts.unknown} Unknown
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {onlineRpcs} of {totalRpcs} endpoints are currently available for use
            </p>
          </div>

          {/* RPC List */}
          <div className="space-y-3">
            {sortedRpcEndpoints.map((endpoint, index) => {
              const { url, status, latency, endpoint: rpcEndpoint, score } = endpoint
              
              // Use environment variables for thresholds or fallback to defaults
              const officialScoreThreshold = parseInt(import.meta.env.OFFICIAL_RPC_SCORE_THRESHOLD || '100')
              const recommendedScoreThreshold = parseInt(import.meta.env.RECOMMENDED_RPC_SCORE_THRESHOLD || '50')
              const topRecommendedCount = parseInt(import.meta.env.TOP_RECOMMENDED_RPC_COUNT || '3')
              
              const isOfficial = score >= officialScoreThreshold // Official RPCs get high points
              const isRecommended = index < topRecommendedCount && score > recommendedScoreThreshold // Top 3 with good scores
              
              return (
                <Card 
                  key={index} 
                  className="bg-gradient-card border-border/50 hover:border-border transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(status)}
                        <div className="flex-1 min-w-0">
                          {/* RPC URL */}
                          <div className="font-mono text-sm truncate mb-2">{url}</div>
                          
                          {/* Tags and Status */}
                          <div className="flex flex-wrap gap-2">
                            {isOfficial && (
                              <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                                Official
                              </Badge>
                            )}
                            {isRecommended && !isOfficial && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                            {getStatusBadge(status)}
                          </div>

                          {/* Performance Metrics */}
                          <div className="flex items-center gap-3 mt-2">
                            {latency && (
                              <span className="text-xs text-muted-foreground">
                                {latency}ms latency
                              </span>
                            )}
                            {rpcEndpoint?.reliability && (
                              <span className="text-xs text-muted-foreground">
                                {rpcEndpoint.reliability}% reliable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(url, 'RPC URL')}
                          disabled={status === 'offline'}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          asChild
                          disabled={status === 'offline'}
                        >
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => {
                              // Track external RPC link click
                              analytics.trackEvent({
                                name: 'rpc_external_click',
                                properties: {
                                  chain_id: chain.chainId,
                                  rpc_domain: new URL(url).hostname,
                                  rpc_status: status
                                }
                              })
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Usage Tips */}
          <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">💡 Usage Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Official</strong> endpoints are from trusted providers (Infura, Alchemy, etc.)</li>
              <li>• <strong>Recommended</strong> endpoints are reliable and well-performing</li>
              <li>• Use online endpoints for best performance and reliability</li>
              <li>• Slow endpoints may work but with higher latency</li>
              <li>• Offline endpoints are temporarily unavailable</li>
              <li>• Copy the RPC URL to add to your wallet or dApp configuration</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 