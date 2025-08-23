import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MergedChainData } from "@/types/chain"
import { useMergedChains } from "@/hooks/useChains"
import { GitCompare, ExternalLink, Shield, Zap, Database, Globe } from "lucide-react"

interface ChainComparisonProps {
  preselectedChains?: MergedChainData[]
}

export const ChainComparison = ({ preselectedChains = [] }: ChainComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedChains, setSelectedChains] = useState<MergedChainData[]>(preselectedChains.slice(0, 2))
  const { data: allChains } = useMergedChains()

  const handleChainSelect = (chainId: string, index: number) => {
    const chain = allChains?.find(c => c.chainId.toString() === chainId)
    if (chain) {
      const newSelected = [...selectedChains]
      newSelected[index] = chain
      setSelectedChains(newSelected)
    }
  }

  const getComparisonValue = (chain: MergedChainData, key: string) => {
    switch (key) {
      case 'layer':
        return chain.parent ? 'L2' : 'L1'
      case 'parentChain':
        return chain.parent?.chain || 'N/A'
      case 'privacy': {
        const privacyScore = chain.rpcHealth?.privacyScore
        if (!privacyScore) return 'Unknown'
        if (privacyScore > 80) return 'High'
        if (privacyScore > 60) return 'Medium'
        return 'Low'
      }
      case 'rpcCount':
        return chain.rpc.length.toString()
      case 'avgLatency':
        return chain.rpcHealth?.averageLatency ? `${chain.rpcHealth.averageLatency}ms` : 'Unknown'
      case 'reliability':
        return chain.rpcHealth?.reliabilityScore ? `${chain.rpcHealth.reliabilityScore}%` : 'Unknown'
      case 'features':
        return chain.features?.length || 0
      case 'bridges':
        return chain.bridges?.length || 0
      case 'explorers':
        return chain.explorers?.length || 0
      default:
        return 'N/A'
    }
  }

  const comparisonFields = [
    { key: 'chainId', label: 'Chain ID', icon: Database },
    { key: 'layer', label: 'Layer Type', icon: GitCompare },
    { key: 'parentChain', label: 'Parent Chain', icon: GitCompare },
    { key: 'nativeCurrency', label: 'Native Token', icon: Database },
    { key: 'privacy', label: 'Privacy Score', icon: Shield },
    { key: 'rpcCount', label: 'RPC Endpoints', icon: Globe },
    { key: 'avgLatency', label: 'Avg Latency', icon: Zap },
    { key: 'reliability', label: 'Reliability', icon: Shield },
    { key: 'features', label: 'Features', icon: Database },
    { key: 'bridges', label: 'Bridges', icon: GitCompare },
    { key: 'explorers', label: 'Explorers', icon: ExternalLink }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="glass-card hidden md:flex">
          <GitCompare className="h-4 w-4 mr-2" />
          Compare Chains
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mobile-safe-area">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Chain Comparison
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Chain Selection */}
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">Chain {index + 1}</label>
                <Select
                  value={selectedChains[index]?.chainId.toString() || ''}
                  onValueChange={(value) => handleChainSelect(value, index)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {allChains?.map((chain) => (
                      <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                        {chain.name} ({chain.chainId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {selectedChains.length === 2 && (
            <div className="space-y-4">
              {/* Chain Headers */}
              <div className="grid grid-cols-3 gap-4">
                <div></div>
                {selectedChains.map((chain, index) => (
                  <Card key={index} className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {chain.icon && (
                          <img src={chain.icon} alt={chain.name} className="w-6 h-6 rounded-full" />
                        )}
                        {chain.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={chain.parent ? "secondary" : "default"}>
                          {chain.parent ? 'L2' : 'L1'}
                        </Badge>
                        {chain.verified && <Badge variant="outline">Verified</Badge>}
                        {chain.isTestnet && <Badge variant="destructive">Testnet</Badge>}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Comparison Rows */}
              <div className="space-y-1">
                {comparisonFields.map((field) => (
                  <div key={field.key} className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-gradient-card/50">
                    <div className="flex items-center gap-2 font-medium">
                      <field.icon className="h-4 w-4 text-muted-foreground" />
                      {field.label}
                    </div>
                    {selectedChains.map((chain, index) => (
                      <div key={index} className="text-sm">
                        {field.key === 'nativeCurrency' ? (
                          <div>
                            <span className="font-medium">{chain.nativeCurrency.symbol}</span>
                            <span className="text-muted-foreground ml-1">({chain.nativeCurrency.name})</span>
                          </div>
                        ) : (
                          getComparisonValue(chain, field.key)
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Feature Comparison */}
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">Feature Support</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedChains.map((chain, index) => (
                    <Card key={index} className="glass-card">
                      <CardHeader>
                        <CardTitle className="text-base">{chain.name} Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {chain.features?.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature.name}
                            </Badge>
                          )) || <span className="text-muted-foreground text-sm">No features listed</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* RPC Performance */}
              <div className="space-y-3">
                <h3 className="font-semibold">RPC Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedChains.map((chain, index) => (
                    <Card key={index} className="glass-card">
                      <CardHeader>
                        <CardTitle className="text-base">{chain.name} RPCs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Endpoints:</span>
                          <span className="font-medium">{chain.rpc.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Privacy Score:</span>
                          <span className="font-medium">
                            {chain.rpcHealth?.privacyScore ? `${chain.rpcHealth.privacyScore}%` : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Reliability:</span>
                          <span className="font-medium">
                            {chain.rpcHealth?.reliabilityScore ? `${chain.rpcHealth.reliabilityScore}%` : 'Unknown'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}