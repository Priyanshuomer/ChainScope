import React, { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { appKitModal } from '../appkit-config'
import { toast } from '@/components/ui/use-toast' // Your toast hook

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  const openModal = () => {
    appKitModal.open({ view: 'Connect' }) // open Reown modal
  }

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

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: 'Disconnected',
      description: 'Your wallet has been disconnected successfully.',
      variant: 'destructive',
    })
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleCopy}
          className="
            px-4 py-2 bg-green-600 text-white rounded-md shadow-md
            hover:bg-green-700 transition
            focus:outline-none focus:ring-2 focus:ring-green-400
          "
          title="Copy wallet address"
        >
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        <button
          onClick={handleDisconnect}
          className="
            px-3 py-2 bg-red-600 text-white rounded-md shadow-md
            hover:bg-red-700 transition
            focus:outline-none focus:ring-2 focus:ring-red-400
            flex items-center justify-center
          "
          title="Disconnect wallet"
          aria-label="Disconnect wallet"
        >
          {/* Left arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={openModal}
      className="
        inline-flex items-center px-5 py-2 
        bg-gradient-to-r from-green-700 via-green-600 to-green-700 
        text-white font-semibold rounded-md shadow-md 
        transition-transform duration-200 ease-in-out
        hover:scale-105 hover:shadow-lg
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-green-400
      "
      title="Connect Wallet"
    >
      {/* Wallet icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
      </svg>
      Connect Wallet
    </button>
  )
}
