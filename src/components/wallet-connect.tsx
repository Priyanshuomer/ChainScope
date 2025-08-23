import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Wallet, Plus, Check, X } from 'lucide-react'
import { addNetworkToWallet } from '@/lib/wallet'
import { useToast } from '@/hooks/use-toast'
import { ChainData } from '@/types/chain'

interface WalletConnectProps {
  chain: ChainData
}

export function WalletConnect({ chain }: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()

  const handleAddToWallet = async () => {
    // Check if wallet is available
    if (!window.ethereum) {
      toast({
        title: "No Wallet Found",
        description: "Please install MetaMask or another Web3 wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await addNetworkToWallet(chain)
      if (success) {
        setIsAdded(true)
        toast({
          title: "Network Added!",
          description: `${chain.name} has been added to your wallet.`,
        })
        setTimeout(() => setIsAdded(false), 3000)
      } else {
        toast({
          title: "Failed to add network",
          description: "Please try again or add manually.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      if (error.message?.includes('rejected') || error.code === 4001) {
        toast({
          title: "Request Rejected",
          description: "You declined to add the network.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Please make sure you have a wallet installed and connected.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <Wallet className="w-4 h-4 mr-2" />
          Add to Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Add {chain.name} to Wallet
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Network Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain ID:</span>
                <span className="font-mono">{chain.chainId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span>{chain.nativeCurrency.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RPCs:</span>
                <span>{chain.rpc.length} endpoints</span>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={handleAddToWallet}
            disabled={isLoading || isAdded}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>Loading...</>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added Successfully!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Network
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            This will add the network configuration to your wallet. Make sure you trust this network.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}