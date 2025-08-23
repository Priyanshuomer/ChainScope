import { RpcEndpoint, ChainData } from '@/types/chain'

// Known official RPC providers and their patterns
const OFFICIAL_RPC_PATTERNS = [
  // Ethereum Foundation
  /^https:\/\/mainnet\.infura\.io\/v3\//,
  /^https:\/\/eth-mainnet\.alchemyapi\.io\/v2\//,
  /^https:\/\/rpc\.ankr\.com\/eth/,
  /^https:\/\/ethereum\.rpc\.thirdweb\.com/,
  
  // Polygon
  /^https:\/\/polygon-rpc\.com/,
  /^https:\/\/rpc-mainnet\.matic\.network/,
  /^https:\/\/rpc-mainnet\.maticvigil\.com/,
  /^https:\/\/polygon\.rpc\.thirdweb\.com/,
  
  // Arbitrum
  /^https:\/\/arb1\.arbitrum\.io\/rpc/,
  /^https:\/\/arbitrum-one\.rpc\.thirdweb\.com/,
  
  // Optimism
  /^https:\/\/mainnet\.optimism\.io/,
  /^https:\/\/optimism\.rpc\.thirdweb\.com/,
  
  // Base
  /^https:\/\/mainnet\.base\.org/,
  /^https:\/\/base\.rpc\.thirdweb\.com/,
  
  // BSC
  /^https:\/\/bsc-dataseed\.binance\.org/,
  /^https:\/\/bsc-dataseed1\.binance\.org/,
  /^https:\/\/bsc-dataseed2\.binance\.org/,
  /^https:\/\/bsc-dataseed3\.binance\.org/,
  /^https:\/\/bsc-dataseed4\.binance\.org/,
  
  // Avalanche
  /^https:\/\/api\.avax\.network\/ext\/bc\/C\/rpc/,
  /^https:\/\/rpc\.ankr\.com\/avalanche/,
  
  // Fantom
  /^https:\/\/rpc\.ftm\.tools/,
  /^https:\/\/rpc\.fantom\.network/,
  
  // Gnosis
  /^https:\/\/rpc\.gnosischain\.com/,
  /^https:\/\/rpc\.gnosis\.gno\.io/,
  
  // Common patterns for official RPCs
  /^https:\/\/.*\.rpc\.thirdweb\.com/,
  /^https:\/\/.*\.infura\.io\/v3\//,
  /^https:\/\/.*\.alchemyapi\.io\/v2\//,
  /^https:\/\/rpc\.ankr\.com\//,
  /^https:\/\/.*\.quicknode\.com/,
  /^https:\/\/.*\.getblock\.io/,
  /^https:\/\/.*\.nodereal\.io/,
  /^https:\/\/.*\.blastapi\.io/,
  /^https:\/\/.*\.publicnode\.com/,
]

// Known reliable RPC providers
const RELIABLE_PROVIDERS = [
  'infura.io',
  'alchemyapi.io',
  'ankr.com',
  'thirdweb.com',
  'quicknode.com',
  'getblock.io',
  'binance.org',
  'avax.network',
  'ftm.tools',
  'gnosischain.com',
  'polygon-rpc.com',
  'arbitrum.io',
  'optimism.io',
  'base.org',
  'rpc.flashbots.net',
  'eth-mainnet.nodereal.io',
  'eth-mainnet.public.blastapi.io',
  'ethereum.publicnode.com'
]

// RPC endpoint scoring function
export const scoreRpcEndpoint = (rpc: RpcEndpoint | string): number => {
  const url = typeof rpc === 'string' ? rpc : rpc.url
  let score = 0

  // Check if it's an official RPC pattern
  const isOfficial = OFFICIAL_RPC_PATTERNS.some(pattern => pattern.test(url))
  if (isOfficial) score += 100

  // Check if it's from a reliable provider
  const isReliableProvider = RELIABLE_PROVIDERS.some(provider => url.includes(provider))
  if (isReliableProvider) score += 50

  // If we have RPC endpoint data, use it for scoring
  if (typeof rpc === 'object') {
    // Online status gets high priority
    if (rpc.status === 'online') score += 75
    else if (rpc.status === 'slow') score += 25
    else if (rpc.status === 'offline') score -= 100

    // Low latency gets bonus points
    if (rpc.latency && rpc.latency < 100) score += 30
    else if (rpc.latency && rpc.latency < 500) score += 15

    // High reliability gets bonus points
    if (rpc.reliability && rpc.reliability > 0.9) score += 25
    else if (rpc.reliability && rpc.reliability > 0.7) score += 10

    // High privacy gets bonus points
    if (rpc.privacy === 'high') score += 20
    else if (rpc.privacy === 'medium') score += 10

    // Open source gets bonus points
    if (rpc.isOpenSource) score += 15

    // No tracking gets bonus points
    if (rpc.tracking === 'no') score += 20
    else if (rpc.tracking === 'limited') score += 10
  }

  // HTTPS gets bonus points
  if (url.startsWith('https://')) score += 10

  // Penalize localhost and private IPs
  if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('192.168.') || url.includes('10.0.')) {
    score -= 1000
  }

  return score
}

// Select the best RPC endpoints for wallet network addition
export const selectBestRpcEndpoints = (chain: ChainData, maxCount: number = 3): string[] => {
  const rpcUrls: Array<{ url: string; score: number; endpoint?: RpcEndpoint }> = []

  // If we have tested RPC endpoints, use them
  if (chain.rpcEndpoints && chain.rpcEndpoints.length > 0) {
    chain.rpcEndpoints.forEach(endpoint => {
      const score = scoreRpcEndpoint(endpoint)
      rpcUrls.push({ url: endpoint.url, score, endpoint })
    })
  }

  // Add untested RPC URLs with basic scoring
  chain.rpc.forEach(url => {
    // Skip if already included from tested endpoints
    if (!rpcUrls.some(rpc => rpc.url === url)) {
      const score = scoreRpcEndpoint(url)
      rpcUrls.push({ url, score })
    }
  })

  // Sort by score (highest first) and filter out offline endpoints
  const sortedRpcUrls = rpcUrls
    .filter(rpc => {
      // If we have endpoint data, only include online endpoints
      if (rpc.endpoint) {
        return rpc.endpoint.status === 'online'
      }
      // For untested URLs, include them but they'll be scored lower
      return true
    })
    .sort((a, b) => b.score - a.score)

  // Return the top N URLs
  return sortedRpcUrls.slice(0, maxCount).map(rpc => rpc.url)
}

// Get the best single RPC endpoint for a chain
export const getBestRpcEndpoint = (chain: ChainData): string | null => {
  // Use wallet-specific logic to ensure only official/reliable RPCs
  const walletRpcUrls = getWalletRpcEndpoints(chain)
  return walletRpcUrls.length > 0 ? walletRpcUrls[0] : null
}

// Validate RPC URL format
export const isValidRpcUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

// Filter and validate RPC URLs
export const filterValidRpcUrls = (urls: string[]): string[] => {
  return urls.filter(url => {
    if (!url || typeof url !== 'string') return false
    if (url.trim() === '') return false
    if (!isValidRpcUrl(url)) return false
    return true
  })
}

// Get RPC endpoints specifically for wallet network addition
// This function prioritizes ONLY official and online RPCs for wallet safety
export const getWalletRpcEndpoints = (chain: ChainData): string[] => {
  
  // Step 1: First check if there's an official RPC in the chain.rpc array
  const officialRpcsFromArray = chain.rpc
    .filter(url => {
      const isOfficial = OFFICIAL_RPC_PATTERNS.some(pattern => pattern.test(url))
      const isHttps = url.startsWith('https://')
      const isNotLocal = !url.includes('localhost') && !url.includes('127.0.0.1')
      const isNotTemplate = !url.includes('{') && !url.includes('}')
      const isNotBlacklisted = !url.includes('infura-key') && !url.includes('project-id=')
      
      return isOfficial && isHttps && isNotLocal && isNotTemplate && isNotBlacklisted
    })

  // If we have rpcEndpoints data, check if any of these official RPCs are online
  if (chain.rpcEndpoints && chain.rpcEndpoints.length > 0) {
    const onlineOfficialRpcs = chain.rpcEndpoints
      .filter(rpc => {
        const isOnline = rpc.status === 'online'
        const isOfficial = officialRpcsFromArray.includes(rpc.url)
        const hasGoodLatency = rpc.latency ? rpc.latency < 2000 : true
        
        return isOnline && isOfficial && hasGoodLatency
      })
      .map(rpc => ({
        url: rpc.url,
        score: scoreRpcEndpoint(rpc) + (rpc.latency ? (2000 - rpc.latency) / 20 : 0)
      }))
      .sort((a, b) => b.score - a.score)
      .map(rpc => rpc.url)

    if (onlineOfficialRpcs.length > 0) {
      return onlineOfficialRpcs
    }
  }

  // If we found official RPCs but couldn't verify their status, use them anyway
  if (officialRpcsFromArray.length > 0) {
    return officialRpcsFromArray.slice(0, 3)
  }

  // Step 2: Check for reliable RPCs in the chain.rpc array
  const reliableRpcsFromArray = chain.rpc
    .filter(url => {
      const isReliable = RELIABLE_PROVIDERS.some(provider => url.includes(provider))
      const isHttps = url.startsWith('https://')
      const isNotLocal = !url.includes('localhost') && !url.includes('127.0.0.1')
      const isNotTemplate = !url.includes('{') && !url.includes('}')
      const isNotBlacklisted = !url.includes('infura-key') && !url.includes('project-id=')
      
      return isReliable && isHttps && isNotLocal && isNotTemplate && isNotBlacklisted
    })

  // If we have rpcEndpoints data, check if any of these reliable RPCs are online
  if (chain.rpcEndpoints && chain.rpcEndpoints.length > 0) {
    const onlineReliableRpcs = chain.rpcEndpoints
      .filter(rpc => {
        const isOnline = rpc.status === 'online'
        const isReliable = reliableRpcsFromArray.includes(rpc.url)
        const hasGoodLatency = rpc.latency ? rpc.latency < 3000 : true
        
        return isOnline && isReliable && hasGoodLatency
      })
      .map(rpc => ({
        url: rpc.url,
        score: scoreRpcEndpoint(rpc) + (rpc.latency ? (3000 - rpc.latency) / 30 : 0)
      }))
      .sort((a, b) => b.score - a.score)
      .map(rpc => rpc.url)

    if (onlineReliableRpcs.length > 0) {
      return onlineReliableRpcs
    }
  }

  // If we found reliable RPCs but couldn't verify their status, use them anyway
  if (reliableRpcsFromArray.length > 0) {
    return reliableRpcsFromArray.slice(0, 3)
  }

  // Step 3: Check for any online RPCs in the chain.rpcEndpoints
  if (chain.rpcEndpoints && chain.rpcEndpoints.length > 0) {
    // First try to find online RPCs that are in the chain.rpc array
    const onlineRpcs = chain.rpcEndpoints
      .filter(rpc => {
        const isOnline = rpc.status === 'online'
        const isInRpcArray = chain.rpc.includes(rpc.url)
        const isHttps = rpc.url.startsWith('https://')
        const isNotLocal = !rpc.url.includes('localhost') && !rpc.url.includes('127.0.0.1')
        const isNotTemplate = !rpc.url.includes('{') && !rpc.url.includes('}')
        const isNotBlacklisted = !rpc.url.includes('infura-key') && !rpc.url.includes('project-id=')
        
        return isOnline && isInRpcArray && isHttps && isNotLocal && isNotTemplate && isNotBlacklisted
      })
      .map(rpc => ({
        url: rpc.url,
        score: scoreRpcEndpoint(rpc) + 
          (rpc.latency ? Math.max(0, (5000 - rpc.latency) / 50) : 0) + // Boost for lower latency
          (rpc.reliability ? rpc.reliability * 30 : 0) // Boost for reliability
      }))
      .sort((a, b) => b.score - a.score)
      .map(rpc => rpc.url)

    if (onlineRpcs.length > 0) {
      return onlineRpcs
    }
  }

  // Step 4: If we still haven't found any RPCs, try any HTTPS RPCs from the chain.rpc array
  const httpsRpcs = chain.rpc
    .filter(url => {
      const isHttps = url.startsWith('https://')
      const isNotLocal = !url.includes('localhost') && !url.includes('127.0.0.1')
      const isNotTemplate = !url.includes('{') && !url.includes('}')
      const isNotBlacklisted = !url.includes('infura-key') && !url.includes('project-id=')
      
      return isHttps && isNotLocal && isNotTemplate && isNotBlacklisted
    })
    .map(url => ({
      url,
      score: scoreRpcEndpoint(url)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.url)

  if (httpsRpcs.length > 0) {
    return httpsRpcs
  }

  // Step 6: No online or official RPCs found - return empty array
  // This ensures we don't add networks with potentially unsafe RPCs to wallets
  return []
}

// Get detailed RPC endpoint information for display
export const getRpcEndpointInfo = (chain: ChainData): { 
  best: string | null, 
  official: string[], 
  total: number,
  online: number 
} => {
  const bestRpc = getBestRpcEndpoint(chain)
  const officialRpcs = chain.rpc.filter(url => 
    OFFICIAL_RPC_PATTERNS.some(pattern => pattern.test(url))
  )
  const onlineCount = chain.rpcEndpoints?.filter(rpc => rpc.status === 'online').length || 0
  
  return {
    best: bestRpc,
    official: officialRpcs,
    total: chain.rpc?.length || 0,
    online: onlineCount
  }
} 