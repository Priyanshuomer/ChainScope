import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Zap, AlertCircle, Info } from "lucide-react"
import { MergedChainData } from "@/types/chain"

interface FaucetSectionProps {
  chain: MergedChainData
}

export const FaucetSection = ({ chain }: FaucetSectionProps) => {
  // Only show faucet section for testnet chains
  if (!chain.isTestnet) return null

  // If no faucets available, show a message
  if (!chain.faucets || chain.faucets.length === 0) {
    return (
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Testnet Faucet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-yellow-50/20 border border-yellow-200/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                No faucet information available
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This testnet doesn't have a public faucet listed. You may need to contact the network maintainers for test tokens.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle>Testnet Faucet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info about testnet faucets */}
        <div className="flex items-start gap-3 p-3 bg-blue-50/20 border border-blue-200/30 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">
              Get Test Tokens
            </p>
            <p className="text-blue-700">
              Use the faucet below to get free test tokens for development and testing on this network.
            </p>
          </div>
        </div>

        {/* Faucet Links */}
        <div className="space-y-3">
          {chain.faucets.map((faucetUrl, index) => {
            // Extract a friendly name from the URL
            const url = new URL(faucetUrl)
            const friendlyName = url.hostname.replace('www.', '').split('.')[0]
            const displayName = friendlyName.charAt(0).toUpperCase() + friendlyName.slice(1)

            return (
              <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-border transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{displayName} Faucet</p>
                    <p className="text-xs text-muted-foreground">{url.hostname}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Free Test Tokens
                  </Badge>
                  <Button size="sm" variant="outline" asChild>
                    <a 
                      href={faucetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Faucets provide free test tokens for development purposes</p>
          <p>• Tokens have no real value and are only for testing</p>
          <p>• Some faucets may require authentication or have rate limits</p>
        </div>
      </CardContent>
    </Card>
  )
}
