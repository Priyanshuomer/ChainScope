import { EthereumListsMetadata, ChainData, ChainFeature, ParentChain, BridgeInfo } from "@/types/chain"

const ETHEREUM_LISTS_BASE = "https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains"

export interface EthereumListsAPIResponse {
  name: string
  title?: string
  chainId: number
  shortName: string
  chain: string
  network: string
  networkId: number
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpc: string[]
  faucets: string[]
  explorers?: Array<{
    name: string
    url: string
    standard: string
    icon?: string
  }>
  infoURL: string
  status?: "active" | "deprecated" | "incubating"
  icon?: string
  parent?: {
    type: string
    chain: string
    bridges?: Array<{ url: string }>
  }
  features?: Array<{ name: string }>
  slip44?: number
  ens?: {
    registry?: string
  }
  redFlags?: string[]
}

export class EthereumListsAPI {
  private static instance: EthereumListsAPI
  private metadataCache: Map<number, EthereumListsMetadata> = new Map()
  private cacheTimestamp: number = 0
  private readonly CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

  static getInstance(): EthereumListsAPI {
    if (!EthereumListsAPI.instance) {
      EthereumListsAPI.instance = new EthereumListsAPI()
    }
    return EthereumListsAPI.instance
  }

  private constructor() {}

  async fetchChainMetadata(chainId: number): Promise<EthereumListsMetadata | null> {
    // Check cache first
    if (this.metadataCache.has(chainId) && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.metadataCache.get(chainId) || null
    }

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${ETHEREUM_LISTS_BASE}/eip155-${chainId}.json`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ChainScope/1.0'
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 404) {
          // Don't log 404s to reduce console spam
          return null
        }
        if (response.status === 429) {
          console.warn(`Rate limited for chain ${chainId}, skipping...`)
          return null
        }
        throw new Error(`Failed to fetch chain metadata: ${response.statusText}`)
      }

      const apiData: EthereumListsAPIResponse = await response.json()
      const metadata = this.transformMetadata(apiData)
      
      this.metadataCache.set(chainId, metadata)
      this.cacheTimestamp = Date.now()
      
      return metadata
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`Request timeout for chain ${chainId}`)
      } else {
        console.warn(`Error fetching metadata for chain ${chainId}:`, error instanceof Error ? error.message : 'Unknown error')
      }
      return null
    }
  }

  async fetchMultipleChainMetadata(chainIds: number[]): Promise<Map<number, EthereumListsMetadata>> {
    const results = new Map<number, EthereumListsMetadata>()
    
    // CRITICAL FIX: Batch processing with rate limiting to prevent resource exhaustion
    const BATCH_SIZE = 5 // Process only 5 chains at a time
    const DELAY_BETWEEN_BATCHES = 1000 // 1 second delay between batches
    
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log(`🔄 Processing ${chainIds.length} chains in batches of ${BATCH_SIZE}`)
    }
    
    for (let i = 0; i < chainIds.length; i += BATCH_SIZE) {
      const batch = chainIds.slice(i, i + BATCH_SIZE)
      
      // Process current batch
      const batchPromises = batch.map(async (chainId) => {
        const metadata = await this.fetchChainMetadata(chainId)
        if (metadata) {
          results.set(chainId, metadata)
        }
      })

      await Promise.allSettled(batchPromises)
      
      // Add delay between batches to prevent rate limiting
      if (i + BATCH_SIZE < chainIds.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
      }
      
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        console.log(`✅ Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chainIds.length / BATCH_SIZE)}`)
      }
    }
    
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log(`🎉 Successfully fetched metadata for ${results.size}/${chainIds.length} chains`)
    }
    return results
  }

  private transformMetadata = (apiData: EthereumListsAPIResponse): EthereumListsMetadata => {
    return {
      name: apiData.name,
      title: apiData.title,
      chainId: apiData.chainId,
      shortName: apiData.shortName,
      chain: apiData.chain,
      network: apiData.network,
      networkId: apiData.networkId,
      nativeCurrency: apiData.nativeCurrency,
      rpc: apiData.rpc || [],
      faucets: apiData.faucets || [],
      explorers: apiData.explorers || [],
      infoURL: apiData.infoURL || '',
      status: apiData.status,
      icon: apiData.icon,
      parent: apiData.parent ? {
        type: this.normalizeParentType(apiData.parent.type),
        chain: apiData.parent.chain,
        bridges: apiData.parent.bridges?.map(b => b.url)
      } : undefined,
      features: apiData.features?.map(f => ({
        name: f.name,
        type: this.determineFeatureType(f.name),
        supported: true
      })),
      slip44: apiData.slip44,
      ens: apiData.ens,
      redFlags: apiData.redFlags,
      tags: this.generateTags(apiData)
    }
  }

  private normalizeParentType = (type: string): 'L2' | 'sidechain' | 'rollup' => {
    const lower = type.toLowerCase()
    if (lower.includes('l2') || lower.includes('layer 2')) return 'L2'
    if (lower.includes('sidechain')) return 'sidechain'
    if (lower.includes('rollup') || lower.includes('optimistic') || lower.includes('zk')) return 'rollup'
    return 'L2' // default
  }

  private determineFeatureType = (name: string): 'eip' | 'standard' | 'custom' => {
    const lower = name.toLowerCase()
    if (lower.startsWith('eip') || lower.includes('eip-')) return 'eip'
    if (lower.includes('erc') || lower.includes('standard')) return 'standard'
    return 'custom'
  }

  private generateTags = (apiData: EthereumListsAPIResponse): string[] => {
    const tags: string[] = []
    
    // Add network type
    if (this.isTestnet(apiData)) tags.push('testnet')
    else tags.push('mainnet')
    
    // Add layer type
    if (apiData.parent) {
      tags.push('L2')
      tags.push(apiData.parent.type.toLowerCase())
    } else {
      tags.push('L1')
    }
    
    // Add feature tags
    if (apiData.features?.some(f => f.name.toLowerCase().includes('evm'))) {
      tags.push('evm-compatible')
    }
    
    // Add status tags
    if (apiData.status) tags.push(apiData.status)
    
    return tags
  }

  private isTestnet = (apiData: EthereumListsAPIResponse): boolean => {
    const name = apiData.name?.toLowerCase() || ''
    const network = apiData.network?.toLowerCase() || ''
    
    return name.includes('test') || 
           name.includes('sepolia') || 
           name.includes('goerli') || 
           name.includes('rinkeby') || 
           name.includes('kovan') ||
           network.includes('test')
  }

  clearCache(): void {
    this.metadataCache.clear()
    this.cacheTimestamp = 0
  }
}

export const ethereumListsAPI = EthereumListsAPI.getInstance()