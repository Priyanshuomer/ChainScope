import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Copy } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast" // shadcn toast

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors, status, error } = useConnect()
  
  const [copied, setCopied] = useState(false)

  // Show error if connection is rejected
  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Rejected",
        description: "You cancelled the wallet connection.",
        variant: "destructive",
      })
    }
  }, [error])

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast({
        title: "Address Copied",
        description: `${address.slice(0, 6)}...${address.slice(-4)} copied to clipboard.`,
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConnect = () => {
    if (connectors.length) {
      connect({ connector: connectors[0] })
      toast({
        title: "Wallet Connecting...",
        description: "Please approve the connection in your wallet.",
      })
    } else {
      toast({
        title: "No Wallet Found",
        description: "Install MetaMask or another wallet to connect.",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected successfully.",
      variant: "destructive"
    })
  }

  if (isConnected) {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs px-3 transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.7)] active:scale-95"
            title="Click to copy address"
            onClick={handleCopy}
          >
            <Wallet className="h-3 w-3 mr-1" />
            {address?.slice(0, 6)}...{address?.slice(-4)}
            <Copy className="h-3 w-3 ml-1" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-red-500 text-white h-8 w-8 p-0 transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-[0_0_12px_rgba(239,68,68,0.7)] active:scale-95 rounded-full"
            onClick={handleDisconnect}
            title="Disconnect wallet"
          >
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
        {copied && (
          <p className="text-xs text-green-500 mt-1 animate-fade-in">Copied!</p>
        )}
      </div>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-[0_0_15px_rgba(59,130,246,0.7)] active:scale-95"
      onClick={handleConnect}
      disabled={status === 'pending'}
      title="Connect wallet"
    >
      <Wallet className="h-4 w-4 mr-2" />
      {status === 'pending' ? 'Connecting...' : (
        <>
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </>
      )}
    </Button>
  )
}
