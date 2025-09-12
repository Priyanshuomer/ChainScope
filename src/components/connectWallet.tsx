import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useDisconnect } from '@reown/appkit/react'
import { appKitModal } from '../appkit-config'
import { toast } from '@/components/ui/use-toast'

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  // 🔹 Show toast when connected
  useEffect(() => {
    if (isConnected && address) {
      toast({
        title: 'Wallet Connected',
        description: `${address.slice(0, 6)}...${address.slice(-4)} connected successfully.`,
        variant: "success"
      })
    }
  }, [isConnected, address])

  // Open Reown modal
  const openModal = () => {
    appKitModal.open({ view: 'Connect' })
  }

  // Copy address (optional)
  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    toast({
      title: 'Address Copied',
      description: `${address.slice(0, 6)}...${address.slice(-4)} copied to clipboard.`,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  // Disconnect wallet
  const handleDisconnect = async () => {
    try {
      await disconnect()
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
  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        {/* Address button */}
        <button
          // onClick={handleCopy}
          className="
            inline-flex items-center px-3 py-1.5
            bg-primary
            text-black font-semibold rounded-md shadow-md
            transition-transform duration-200 ease-in-out
            hover:scale-105 hover:shadow-lg
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-green-400
          "
          title={'Wallet is Connected !!'}
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>

        {/* Disconnect button */}
        <button
          onClick={handleDisconnect}
          className="
            inline-flex items-center p-1
            text-white 
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-red-400 mr-1
          "
          title="Disconnect Wallet"
        >
          {/* Disconnect Icon */}
        <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-6 h-6 text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15 12H9m3 3v-6m6 12H6a2 2 0 01-2-2V6a2 2 0 012-2h4m9 14v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1"
  />
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M2 12h3m14 0h3m-5 0l-3-3m3 3l-3 3"
  />
</svg>

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
