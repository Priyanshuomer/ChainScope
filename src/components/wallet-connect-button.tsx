import { useAccount, useDisconnect } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="glass-card text-xs px-3"
        >
          <Wallet className="h-3 w-3 mr-1" />
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="glass-card h-8 w-8 p-0"
          onClick={() => disconnect()}
        >
          <LogOut className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="glass-card"
    >
      <Wallet className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </Button>
  )
}
