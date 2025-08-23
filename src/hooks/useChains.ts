import { useQuery } from '@tanstack/react-query'
import { chainDataMerger } from '@/lib/chain-data-merger'
import { MergedChainData, ChainStats } from '@/types/chain'

// Performance optimization: Add stale time and caching
const STALE_TIME = 5 * 60 * 1000 // 5 minutes
const CACHE_TIME = 10 * 60 * 1000 // 10 minutes

// Infinite scrolling configuration
const INITIAL_LOAD_SIZE = parseInt(process.env.INITIAL_LOAD_SIZE || '40') // Initial load of 40 chains
const LOAD_MORE_SIZE = parseInt(process.env.LOAD_MORE_SIZE || '20') // Load 20 more chains each time

export const useMergedChains = () => {
  return useQuery({
    queryKey: ['merged-chains'],
    queryFn: () => chainDataMerger.fetchMergedChains(),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

// New hook for infinite scrolling with pagination
export const useInfiniteChains = (
  filters: {
    searchQuery?: string
    selectedFilters?: string[]
    activeTab?: string
  } = {}
) => {
  return useQuery({
    queryKey: ['infinite-chains', filters],
    queryFn: async () => {
      const allChains = await chainDataMerger.fetchMergedChains()
      
      // Apply filters
      let filteredChains = allChains

      // Apply search filter
      if (filters.searchQuery?.trim()) {
        const query = filters.searchQuery.toLowerCase()
        filteredChains = filteredChains.filter(chain => 
          chain.name.toLowerCase().includes(query) ||
          chain.nativeCurrency.symbol.toLowerCase().includes(query) ||
          chain.chainId.toString().includes(query) ||
          chain.shortName?.toLowerCase().includes(query)
        )
      }

      // Apply tag filters
      if (filters.selectedFilters && filters.selectedFilters.length > 0) {
        filteredChains = filteredChains.filter(chain => 
          filters.selectedFilters!.every(filter => {
            switch (filter) {
              case 'verified':
                return chain.verified === true
              case 'mainnet':
                return !chain.isTestnet
              case 'testnet':
                return chain.isTestnet === true
              case 'l2':
                return chain.parent !== undefined
              case 'l1':
                return chain.parent === undefined
              case 'evm':
                return chain.features?.some(f => f.name === 'EIP-155') || true
              case 'active':
                return chain.rpc && chain.rpc.length > 0
              case 'ethereum':
                return chain.name.toLowerCase().includes('ethereum') || chain.chainId === 1
              case 'polygon':
                return chain.name.toLowerCase().includes('polygon') || chain.chainId === 137
              case 'arbitrum':
                return chain.name.toLowerCase().includes('arbitrum') || chain.shortName?.toLowerCase().includes('arb')
              case 'optimism':
                return chain.name.toLowerCase().includes('optimism') || chain.shortName?.toLowerCase().includes('op')
              case 'avalanche':
                return chain.name.toLowerCase().includes('avalanche') || chain.name.toLowerCase().includes('avax')
              case 'bsc':
                return chain.name.toLowerCase().includes('bsc') || chain.name.toLowerCase().includes('binance') || chain.chainId === 56
              default:
                return chain.tags?.includes(filter) || false
            }
          })
        )
      }

      // Apply tab-specific filtering
      switch (filters.activeTab) {
        case 'mainnet':
          filteredChains = filteredChains.filter(chain => !chain.isTestnet)
          break
        case 'testnet':
          filteredChains = filteredChains.filter(chain => chain.isTestnet)
          break
        case 'verified':
          filteredChains = filteredChains.filter(chain => chain.verified)
          break
        case 'trending':
          filteredChains = filteredChains
            .filter(chain => chain.rpc && chain.rpc.length > 0)
            .sort((a, b) => {
              if (a.verified && !b.verified) return -1
              if (!a.verified && b.verified) return 1
              if (a.rpc && b.rpc) {
                if (a.rpc.length !== b.rpc.length) return b.rpc.length - a.rpc.length
              }
              return calculateChainScore(b) - calculateChainScore(a)
            })
          break
        default:
          // Sort by popularity for "all" tab
          filteredChains = filteredChains.sort((a, b) => calculateChainScore(b) - calculateChainScore(a))
      }

      return {
        allChains: filteredChains,
        totalCount: filteredChains.length,
        initialLoadSize: INITIAL_LOAD_SIZE,
        loadMoreSize: LOAD_MORE_SIZE
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

// Helper function to calculate chain score for sorting
const calculateChainScore = (chain: MergedChainData) => {
  const popularScore = parseInt(process.env.POPULAR_CHAIN_SCORE || '1000')
  const verifiedScore = parseInt(process.env.VERIFIED_CHAIN_SCORE || '500')
  const rpcMultiplier = parseInt(process.env.RPC_MULTIPLIER || '10')
  const mainnetScore = parseInt(process.env.MAINNET_SCORE || '200')
  const l2Score = parseInt(process.env.L2_SCORE || '100')
  
  let score = 0
  
  // Popular chains get bonus
  const popularChainIds = process.env.POPULAR_CHAIN_IDS 
    ? process.env.POPULAR_CHAIN_IDS.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
    : [1, 137, 42161, 10, 56, 43114, 250, 100, 8453, 59144, 534353, 999]
  
  if (popularChainIds.includes(chain.chainId)) {
    score += popularScore
  }
  
  // Verified chains get bonus
  if (chain.verified) {
    score += verifiedScore
  }
  
  // More RPCs = more popular
  if (chain.rpc) {
    score += chain.rpc.length * rpcMultiplier
  }
  
  // Mainnet over testnet
  if (!chain.isTestnet) {
    score += mainnetScore
  }
  
  // L2 chains get bonus
  if (chain.parent) {
    score += l2Score
  }
  
  return score
}

export const useMergedChainById = (chainId: number) => {
  return useQuery({
    queryKey: ['merged-chain', chainId],
    queryFn: () => chainDataMerger.fetchMergedChainById(chainId),
    enabled: !!chainId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useMergedChainStats = () => {
  return useQuery({
    queryKey: ['merged-chain-stats'],
    queryFn: async () => {
      const chains = await chainDataMerger.fetchMergedChains()
      
      const stats: ChainStats = {
        totalChains: chains.length,
        mainnetChains: chains.filter(chain => !chain.isTestnet).length,
        testnetChains: chains.filter(chain => chain.isTestnet).length,
        verifiedChains: chains.filter(chain => chain.verified).length,
        l2Chains: chains.filter(chain => chain.parent).length,
        totalRpcs: chains.reduce((sum, chain) => sum + (chain.rpc?.length || 0), 0),
        healthyRpcs: chains.reduce((sum, chain) => {
          const healthy = chain.rpcEndpoints?.filter(rpc => rpc.status === 'online').length || 0
          return sum + healthy
        }, 0),
        bridgeSupported: chains.filter(chain => chain.bridges && chain.bridges.length > 0).length,
        evmCompatible: chains.filter(chain => chain.features?.some(f => f.name === 'EIP-155')).length
      }
      
      return stats
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useMainnetChains = () => {
  return useQuery({
    queryKey: ['mainnet-chains'],
    queryFn: () => chainDataMerger.getMainnetMergedChains(),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useTestnetChains = () => {
  return useQuery({
    queryKey: ['testnet-chains'],
    queryFn: () => chainDataMerger.getTestnetMergedChains(),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useL2Chains = () => {
  return useQuery({
    queryKey: ['l2-chains'],
    queryFn: () => chainDataMerger.getL2MergedChains(),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useVerifiedChains = () => {
  return useQuery({
    queryKey: ['verified-chains'],
    queryFn: () => chainDataMerger.getVerifiedMergedChains(),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useChainSearch = (query: string) => {
  return useQuery({
    queryKey: ['chain-search', query],
    queryFn: () => chainDataMerger.searchMergedChains(query),
    enabled: query.length > 0,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}