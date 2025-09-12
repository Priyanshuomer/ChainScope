import { createConfig, http } from 'wagmi'
import { injected } from '@wagmi/connectors'
import { mainnet, sepolia } from 'wagmi/chains'
import { getWalletRpcEndpoints } from './rpc-selector'

// 1. Get projectId from environment variables
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || import.meta.env.VITE_REOWN_PROJECT_ID || 'demo-project-id'

// 2. Create wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [injected()],
})





// 4. Enhanced utility function to add network to wallet
export const addNetworkToWallet = async (chainData: any) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called in a browser environment')
  }

  // Check if ethereum provider is available
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.')
  }

  // Validate chain data
  if (!chainData.chainId || !chainData.name || !chainData.nativeCurrency) {
    throw new Error('Invalid chain data provided')
  }

  // Use the smart RPC selector to get the best RPC endpoints
  const bestRpcUrls = getWalletRpcEndpoints(chainData)
  
  if (bestRpcUrls.length === 0) {
    throw new Error('No official or reliable RPC endpoints found for this network. For security reasons, we only add networks with verified RPC endpoints to wallets.')
  }

  // Format chainId properly
  let chainIdHex = ''
  try {
    if (typeof chainData.chainId === 'string') {
      if (chainData.chainId.startsWith('0x')) {
        // Already in hex format
        chainIdHex = chainData.chainId
      } else {
        // Convert string number to hex
        chainIdHex = `0x${BigInt(chainData.chainId).toString(16)}`
      }
    } else {
      // Convert number to hex
      chainIdHex = `0x${BigInt(chainData.chainId).toString(16)}`
    }
  } catch (error) {
    throw new Error('Invalid chain ID format. Please report this to ChainScope.')
  }

  // Validate and format native currency
  const nativeCurrency = {
    name: chainData.nativeCurrency.name?.trim() || 'Unknown',
    symbol: chainData.nativeCurrency.symbol?.trim().toUpperCase() || 'ETH',
    decimals: Number(chainData.nativeCurrency.decimals || 18)
  }

  // Validate decimals
  if (isNaN(nativeCurrency.decimals) || nativeCurrency.decimals < 0 || nativeCurrency.decimals > 32) {
    nativeCurrency.decimals = 18
  }

  // Clean and validate RPC URLs
  const cleanRpcUrls = bestRpcUrls.filter(url => {
    try {
      new URL(url)
      return url.startsWith('https://') || url.startsWith('http://')
    } catch {
      return false
    }
  })

  if (cleanRpcUrls.length === 0) {
    throw new Error('No valid RPC URLs found for this network')
  }

  // Clean and validate explorer URLs
  let blockExplorerUrls: string[] | undefined = undefined
  if (chainData.explorers && chainData.explorers.length > 0) {
    const validExplorers = chainData.explorers
      .filter(explorer => explorer?.url)
      .map(explorer => {
        let url = explorer.url
        // Ensure URL ends with trailing slash
        if (!url.endsWith('/')) {
          url += '/'
        }
        return url
      })
      .filter(url => {
        try {
          new URL(url)
          return url.startsWith('https://')
        } catch {
          return false
        }
      })

    if (validExplorers.length > 0) {
      blockExplorerUrls = validExplorers
    }
  }

  // Clean and validate icon URLs
  let iconUrls: string[] | undefined = undefined
  if (chainData.icon) {
    try {
      new URL(chainData.icon)
      if (chainData.icon.startsWith('https://')) {
        iconUrls = [chainData.icon]
      }
    } catch {
      // Invalid icon URL, skip it
    }
  }

  // Prepare network configuration
  const networkConfig = {
    chainId: chainIdHex,
    chainName: chainData.name?.trim() || `Chain ${chainData.chainId}`,
    nativeCurrency,
    rpcUrls: cleanRpcUrls,
    blockExplorerUrls,
    iconUrls,
    // Only include networkId if it's valid and different from chainId
    ...(chainData.networkId && chainData.networkId !== chainData.chainId && {
      networkId: typeof chainData.networkId === 'string' 
        ? parseInt(chainData.networkId, 16)
        : Number(chainData.networkId)
    })
  }

  // Validate the network configuration before trying to add it
  try {
    // Additional validation
    if (!chainIdHex || !chainIdHex.startsWith('0x')) {
      throw new Error('Invalid chain ID format')
    }
    if (!networkConfig.chainName || networkConfig.chainName.trim() === '') {
      throw new Error('Invalid network name')
    }
    if (!networkConfig.nativeCurrency.symbol || networkConfig.nativeCurrency.symbol.trim() === '') {
      throw new Error('Invalid native currency symbol')
    }
    if (!networkConfig.rpcUrls || networkConfig.rpcUrls.length === 0) {
      throw new Error('No valid RPC URLs')
    }
  } catch (validationError) {
    throw new Error(`Network configuration error: ${validationError.message}. Please report this to ChainScope.`)
  }

  try {
    // Check if wallet is connected
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (!accounts || accounts.length === 0) {
      throw new Error('WALLET_NOT_CONNECTED')
    }

    // First, check if the network already exists by trying to switch to it
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      })
      return true // Network exists and switched successfully
    } catch (switchError: any) {
      // If error code is 4902, network doesn't exist - try to add it
      if (switchError.code === 4902 || switchError.code === -32603) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig]
        })
        
        // Verify the network was added by trying to switch to it
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }]
          })
          return true
        } catch (verifyError: any) {
          throw new Error('Failed to verify network addition')
        }
      }
      throw switchError
    }
  } catch (error: any) {
    const errorMessage = error.message?.toLowerCase() || ''
    const errorCode = error.code

    // Special case for wallet not connected
    if (error.message === 'WALLET_NOT_CONNECTED') {
      throw new Error('Please connect your wallet first')
    }

    // Handle user rejections
    if (errorCode === 4001 || errorMessage.includes('reject') || errorMessage.includes('denied')) {
      throw new Error('You declined to add the network')
    }

    // Handle network already exists
    if (errorMessage.includes('already exist') || errorCode === -32603) {
      // throw new Error('This network is heyy already in your wallet')
      return;
    }

    // Handle pending requests
    if (errorCode === -32002 || errorMessage.includes('pending')) {
      throw new Error('Please check your wallet - you have a pending request')
    }

    // Handle invalid parameters
    if (errorCode === -32602 || errorMessage.includes('invalid')) {
      throw new Error('Network configuration error. Please report this to ChainScope.')
    }

    // Handle unsupported networks
    if (errorCode === -32004 || errorMessage.includes('unsupported')) {
      throw new Error('This network is not supported by your wallet')
    }

    // Handle timeout
    if (errorMessage.includes('timeout')) {
      throw new Error('Request timed out. Please check your connection and try again')
    }

    // Handle other errors
    throw new Error(`Failed to add network: ${error.message}. Please try again or report this issue.`)
  }
}

// 5. Export WagmiConfig component from wagmi
export { WagmiConfig } from 'wagmi'