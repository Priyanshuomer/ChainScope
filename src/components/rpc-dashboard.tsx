import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MergedChainData } from "@/types/chain"
import { Shield, Zap, ExternalLink, GitCompare, Database, Globe, TrendingUp, Clock } from "lucide-react"
import { RpcPerformanceChart } from "./charts/rpc-performance-chart"
import { Progress } from "@/components/ui/progress"

interface RpcDashboardProps {
  chain: MergedChainData
}

export const RpcDashboard = ({ chain }: RpcDashboardProps) => {
  const getRpcStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'slow': return 'bg-yellow-500'  
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPrivacyBadge = (tracking?: string) => {
    switch (tracking) {
      case 'no':
      case 'none': return { label: 'High Privacy', variant: 'default' as const }
      case 'limited': return { label: 'Medium Privacy', variant: 'secondary' as const }
      case 'yes': return { label: 'Low Privacy', variant: 'destructive' as const }
      default: return { label: 'Unknown', variant: 'outline' as const }
    }
  }

  const onlineRpcs = chain.rpcEndpoints?.filter(rpc => rpc.status === 'online').length || 0
  const averageScore = chain.rpcEndpoints?.length ? 
    Math.round(chain.rpcEndpoints.reduce((sum, rpc) => sum + (rpc.score || 0), 0) / chain.rpcEndpoints.length) : 0

  return (
    <div className="space-y-6">
      {/* Enhanced RPC Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Endpoints</p>
                <p className="text-3xl font-bold text-primary">{chain.rpc.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {onlineRpcs} online
                </p>
              </div>
              <Globe className="h-8 w-8 text-primary/60" />
            </div>
            <Progress 
              value={(onlineRpcs / chain.rpc.length) * 100} 
              className="mt-3 h-2"
            />
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reliability</p>
                <p className="text-3xl font-bold text-success">
                  {chain.rpcHealth?.reliabilityScore ? `${chain.rpcHealth.reliabilityScore}%` : 'N/A'}
                </p>
                <p className="text-xs text-success mt-1">
                  {chain.rpcHealth?.reliabilityScore && chain.rpcHealth.reliabilityScore > 90 ? 'Excellent' : 
                   chain.rpcHealth?.reliabilityScore && chain.rpcHealth.reliabilityScore > 70 ? 'Good' : 'Fair'}
                </p>
              </div>
              <Shield className="h-8 w-8 text-success/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Latency</p>
                <p className="text-3xl font-bold text-warning">
                  {chain.rpcHealth?.averageLatency ? `${chain.rpcHealth.averageLatency}ms` : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {chain.rpcHealth?.averageLatency && chain.rpcHealth.averageLatency < 200 ? 'Fast' : 
                   chain.rpcHealth?.averageLatency && chain.rpcHealth.averageLatency < 500 ? 'Normal' : 'Slow'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance Score</p>
                <p className="text-3xl font-bold text-primary">{averageScore}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {averageScore > 80 ? 'Excellent' : averageScore > 60 ? 'Good' : 'Fair'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/60" />
            </div>
            <Progress 
              value={averageScore} 
              className="mt-3 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      {chain.rpcEndpoints && chain.rpcEndpoints.length > 0 && (
        <RpcPerformanceChart rpcEndpoints={chain.rpcEndpoints} />
      )}

      {/* RPC Endpoints List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            RPC Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chain.rpcEndpoints?.map((rpc, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getRpcStatusColor(rpc.status)}`} />
                  <div>
                    <div className="font-mono text-sm">{rpc.url}</div>
                    <div className="text-xs text-muted-foreground">
                      {rpc.latency && `${rpc.latency}ms latency`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPrivacyBadge(rpc.tracking).variant}>
                    {getPrivacyBadge(rpc.tracking).label}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(rpc.url)}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )) || chain.rpc.map((url, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <div className="font-mono text-sm">{url}</div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(url)}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bridge Information */}
      {chain.bridges && chain.bridges.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Bridge Connectivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {chain.bridges.map((bridge, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                  <div className="space-y-1">
                    <div className="font-medium">{bridge.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {bridge.type} • {bridge.chains.length} chains supported
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={bridge.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}