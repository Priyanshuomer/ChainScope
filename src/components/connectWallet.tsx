import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useDisconnect } from '@reown/appkit/react'
import { appKitModal } from '../appkit-config'
import { toast } from '@/components/ui/use-toast'
import { LogOut } from 'lucide-react'

export function ConnectWalletButton() {
  const { address, status } = useAccount()
  const { disconnect } = useDisconnect()
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)

  // Sync wagmi address → local address
  useEffect(() => {
    if (status === 'connected' && address) {
      setConnectedAddress(address)
    } else if (status === 'disconnected') {
      setConnectedAddress(null)
    }
  }, [status, address])

  // Open Reown modal
  const openModal = () => {
    appKitModal.open({ view: 'Connect' })
  }

  // Disconnect wallet
  const handleDisconnect = async () => {
    try {
      await disconnect()
      // 🔹 Immediately clear local state so UI updates instantly
      setConnectedAddress(null)

      toast({
        title: 'Disconnected',
        description: 'Your wallet has been disconnected successfully.',
        variant: 'destructive',
      })
    } catch (error) {
      console.error('Failed to disconnect:', error)
      toast({
        title: 'Error',
        description: 'Failed to disconnect the wallet.',
        variant: 'destructive',
      })
    }
  }

  // ✅ If connected — show address + Disconnect
  if (connectedAddress) {
    return (
      <div className="flex items-center space-x-2">
        <button
          className="
            inline-flex items-center px-3 py-1.5
            bg-primary
            text-black font-semibold rounded-md shadow-md
            transition-transform duration-200 ease-in-out
            hover:scale-105 hover:shadow-lg
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-green-400
          "
          title="Wallet is Connected !!"
        >
          {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
        </button>

        <button
          onClick={handleDisconnect}
          className="
            inline-flex items-center p-2
            bg-black rounded
            text-green-500
            hover:text-green-200
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-green-500
            mr-1
          "
          title="Disconnect Wallet"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    )
  }

  // ✅ If not connected — show connect button
  return (
    <button
      onClick={openModal}
      className="
        inline-flex items-center px-3 py-1.5
        bg-primary
        text-black font-semibold rounded-md shadow-md
        transition-transform duration-200 ease-in-out
        hover:scale-105 hover:shadow-lg
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-green-400
      "
      title="Connect Wallet"
    >
      Connect Wallet
    </button>
  )
}
