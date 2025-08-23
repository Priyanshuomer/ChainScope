import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Mail, ExternalLink } from "lucide-react"

export function NetworkPartnershipBanner() {
  return (
    <div className="relative my-8">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-background">
        <CardContent className="text-center py-8 px-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Partner with ChainScope</h3>
              <p className="text-sm text-muted-foreground">
                Join blockchain networks showcased on ChainScope. Get verified status and analytics visibility.
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Real-time Analytics</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Verified Badge</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => window.open('mailto:partnerships@chainscope.co?subject=Network Partnership Inquiry', '_blank')}
              >
                <Mail className="h-3 w-3 mr-2" />
                Start Partnership
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdvertiseWithUsBanner() {
  return (
    <div className="relative my-8">
      <Card className="border-secondary/20 bg-gradient-to-r from-secondary/10 to-background">
        <CardContent className="text-center py-8 px-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Advertise with ChainScope</h3>
              <p className="text-sm text-muted-foreground">
                Connect with Web3 developers, blockchain innovators, and crypto enthusiasts. 
                Position your brand in the decentralized ecosystem and reach our engaged audience.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                <span>Daily Views</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Targeted Audience</span>
              </div>
            </div>
            
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => window.open('mailto:advertising@chainscope.co?subject=Advertising Partnership Inquiry', '_blank')}
            >
              <Mail className="h-3 w-3 mr-2" />
              Get Started
            </Button>
            
            <p className="text-xs text-muted-foreground">
              partnerships@chainscope.co
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}