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

  // Uncomment to enable copy functionality
  // const handleCopy = () => {
  //   if (!address) return
  //   navigator.clipboard.writeText(address)
  //   setCopied(true)
  //   toast({
  //     title: 'Address Copied',
  //     description: `${address.slice(0, 6)}...${address.slice(-4)} copied to clipboard.`,
  //   })
  //   setTimeout(() => setCopied(false), 2000)
  // }

  // Uncomment to enable disconnect functionality
  // const handleDisconnect = () => {
  //   disconnect()
  //   toast({
  //     title: 'Disconnected',
  //     description: 'Your wallet has been disconnected successfully.',
  //     variant: 'destructive',
  //   })
  // }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
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
          title="Connected wallet"
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        {/* Add a disconnect button if desired */}
        {/* <button onClick={handleDisconnect} className="text-xs text-red-600 ml-2">Disconnect</button> */}
      </div>
    )
  }

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
      {/* Wallet icon SVG (optional) */}
      Connect Wallet
    </button>
  )
}
