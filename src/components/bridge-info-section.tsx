import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { BridgeInfo } from "@/types/chain"

interface BridgeInfoSectionProps {
  bridges: BridgeInfo[]
}

export const BridgeInfoSection = ({ bridges }: BridgeInfoSectionProps) => {
  if (!bridges || bridges.length === 0) return null

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle>Cross-Chain Bridge Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bridges.map((bridge, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-border/50 hover:border-border transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Bridge Name */}
                    <div className="text-base font-medium mb-2">
                      {bridge.name}
                    </div>
                    
                    {/* Type badge only */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant={bridge.type === 'native' ? 'default' : 'secondary'}>
                        {bridge.type === 'native' ? 'Native Bridge' : 'Third-Party'}
                      </Badge>
                    </div>

                    {/* Bridge Description - Only show for native bridges since third-party is already indicated by the badge */}
                    {bridge.type === 'native' && (
                      <div className="text-sm text-muted-foreground">
                        Official bridge for this network
                      </div>
                    )}
                  </div>

                  {/* External Link Button */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    asChild
                    className="ml-4"
                  >
                    <a 
                      href={bridge.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
