import { ChainData, ChainFeature, BridgeInfo } from "@/types/chain"
import { expandedFallbackChains } from "@/data/expandedFallbackChains"

// Response interfaces for different API sources
interface ChainListAPIResponse {
  chainId: number
  name: string
  shortName: string
  network: string
  networkId: number
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpc: string[]
  faucets: string[]
  explorers: Array<{
    name: string
    url: string
    standard: string
  }>
  infoURL: string
  status?: string
  icon?: string
  chain?: string
  parent?: {
    type: string
    chain: string
  }
}

interface CoinGeckoResponse {
  id: string
  chain_identifier: number
  name: string
  shortname: string
  native_coin_id: string
}

interface DefiLlamaResponse {
  gecko_id: string
  tvl: number
  tokenSymbol: string
  cmcId: string
  name: string
  chainId: number
}

/**
 * Enhanced Chain List API with multiple reliable sources and robust fallbacks
 */
class ChainListAPI {
  private static instance: ChainListAPI
  private chainsCache: ChainData[] = []
  private cacheTimestamp: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private readonly REQUEST_TIMEOUT = 10000 // 10 seconds
  private readonly MAX_RETRIES = 2

  static getInstance(): ChainListAPI {
    if (!ChainListAPI.instance) {
      ChainListAPI.instance = new ChainListAPI()
    }
    return ChainListAPI.instance
  }

  /**
   * Fetch chains from multiple reliable sources with comprehensive fallback
   */
  async fetchChains(): Promise<ChainData[]> {
    // Return cached data if still valid
    if (this.chainsCache.length > 0 && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`📦 Using cached chain data: ${this.chainsCache.length} chains`)
      }
      return this.chainsCache
    }

    if (import.meta.env.NODE_ENV === 'development') {
      console.log('🚀 Fetching fresh chain data from multiple sources...')
    }

    // Use multiple reliable and working data sources including complete RPC lists
    const dataSources = [
      {
        name: 'ChainList - Complete Data',
        url: 'https://chainid.network/chains.json',
        parser: this.parseChainListResponse.bind(this),
        priority: 1
      },
      {
        name: 'Ethereum Lists - Enhanced Metadata',
        url: 'https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains_mini.json',
        parser: this.parseChainListResponse.bind(this),
        priority: 2
      },
      {
        name: 'GitHub Extra RPCs',
        url: 'https://raw.githubusercontent.com/DefiLlama/chainlist/main/constants/extraRpcs.js',
        parser: this.parseExtraRpcResponse.bind(this),
        priority: 3
      }
    ]

    let allChains: ChainData[] = []
    let successfulSources = 0

    // Try each source with timeout and retries
    for (const source of dataSources) {
      try {
        if (import.meta.env.NODE_ENV === 'development') {
          console.log(`🔄 Trying ${source.name}...`)
        }
        const data = await this.fetchWithTimeout(source.url)
        
        if (data) {
          const parsed = await source.parser(data)
          if (parsed && parsed.length > 0) {
            if (import.meta.env.NODE_ENV === 'development') {
              console.log(`✅ ${source.name}: ${parsed.length} chains loaded`)
            }
            allChains = this.mergeChainSources(allChains, parsed)
            successfulSources++
            
            // If we have enough data from high-priority sources, break early
            const minChainsThreshold = parseInt(import.meta.env.MIN_CHAINS_THRESHOLD || '50')
            if (source.priority <= 2 && allChains.length >= minChainsThreshold) {
              if (import.meta.env.NODE_ENV === 'development') {
                console.log(`🎯 Sufficient data obtained from high-priority source`)
              }
              break
            }
          }
        }
      } catch (error) {
        if (import.meta.env.NODE_ENV === 'development') {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          if (errorMessage.includes('CORS') || errorMessage.includes('blocked')) {
            console.warn(`⚠️ ${source.name} failed due to CORS policy:`, errorMessage)
          } else {
            console.warn(`⚠️ ${source.name} failed:`, errorMessage)
          }
        }
        continue
      }
    }

    // Validate and cache results
    if (allChains.length > 0) {
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`🎉 Successfully loaded ${allChains.length} chains from ${successfulSources} sources`)
      }
      this.chainsCache = this.sortAndValidateChains(allChains)
      this.cacheTimestamp = Date.now()
      return this.chainsCache
    }

    // Emergency fallback to expanded local dataset
    if (import.meta.env.NODE_ENV === 'development') {
      console.warn('⚠️ All external sources failed, using comprehensive fallback dataset')
      console.log(`📦 Fallback dataset: ${expandedFallbackChains.length} verified chains`)
    }
    
    this.chainsCache = [...expandedFallbackChains]
    this.cacheTimestamp = Date.now()
    return this.chainsCache
  }

  /**
   * Fetch with timeout and retry logic
   */
  private async fetchWithTimeout(url: string, retries = this.MAX_RETRIES): Promise<unknown> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT)

        const response = await fetch(url, {
          signal: controller.signal,
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json'
          }
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          if (response.status === 0) {
            throw new Error('CORS error: Request blocked by browser security policy')
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        if (import.meta.env.NODE_ENV === 'development') {
          console.warn(`🔄 Attempt ${attempt}/${retries} failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error')
        }
        
        if (attempt === retries) {
          throw error
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  /**
   * Parse Ethereum Lists single chain response
   */
  private async parseEthereumListResponse(data: unknown): Promise<ChainData[]> {
    if (!data || typeof data !== 'object') return []

    // For single chain responses, wrap in array
    const chainArray = Array.isArray(data) ? data : [data]
    
    return chainArray
      .filter(this.isValidChain)
      .map(this.transformChain.bind(this))
  }

  /**
   * Parse WalletConnect Registry response
   */
  private async parseWalletConnectResponse(data: unknown): Promise<ChainData[]> {
    if (!data || !Array.isArray(data)) return []

    return data
      .filter(chain => chain.chainId && chain.name)
      .map(chain => ({
        chainId: parseInt(chain.chainId.toString()),
        name: chain.name,
        shortName: chain.shortName || chain.name.toLowerCase().replace(/\s+/g, ''),
        network: chain.network || chain.name.toLowerCase().replace(/\s+/g, '-'),
        networkId: parseInt(chain.chainId.toString()),
        nativeCurrency: {
          name: chain.nativeCurrency?.name || 'Unknown',
          symbol: chain.nativeCurrency?.symbol || 'UNKNOWN',
          decimals: chain.nativeCurrency?.decimals || 18
        },
        rpc: Array.isArray(chain.rpc) ? chain.rpc : [],
        faucets: Array.isArray(chain.faucets) ? chain.faucets : [],
        explorers: Array.isArray(chain.explorers) ? chain.explorers : [],
        infoURL: chain.infoURL || '',
        status: 'active',
        verified: true,
        isTestnet: this.detectTestnet(chain),
        chain: chain.shortName || chain.name,
        tags: this.generateTags(chain)
      }))
  }

  /**
   * Parse DefiLlama API response
   */
  private async parseDefiLlamaResponse(data: DefiLlamaResponse[]): Promise<ChainData[]> {
    if (!Array.isArray(data)) return []

    const minTvlThreshold = parseInt(import.meta.env.MIN_TVL_THRESHOLD || '1000000')

    return data
      .filter(chain => chain.chainId && chain.name && chain.chainId > 0)
      .map(chain => ({
        chainId: chain.chainId,
        name: chain.name,
        shortName: chain.tokenSymbol?.toLowerCase() || chain.name.toLowerCase().replace(/\s+/g, ''),
        network: chain.name.toLowerCase().replace(/\s+/g, '-'),
        networkId: chain.chainId,
        nativeCurrency: {
          name: chain.tokenSymbol || 'Unknown',
          symbol: chain.tokenSymbol || 'UNKNOWN',
          decimals: 18
        },
        rpc: [], // Will be populated from other sources
        faucets: [],
        explorers: [],
        infoURL: '',
        status: 'active',
        verified: chain.tvl > minTvlThreshold, // Use dynamic threshold
        isTestnet: false,
        chain: chain.tokenSymbol || chain.name,
        tags: ['mainnet', 'evm-compatible']
      }))
  }

   /**
    * Parse standard ChainList API response
    */
   private async parseChainListResponse(data: ChainListAPIResponse[]): Promise<ChainData[]> {
     if (!Array.isArray(data)) return []

     return data
       .filter(this.isValidChain)
       .map(this.transformChain.bind(this))
   }

   /**
    * Parse Extra RPC response from GitHub
    */
   private async parseExtraRpcResponse(data: unknown): Promise<ChainData[]> {
     try {
       // Parse JavaScript object from the response
       if (typeof data === 'string') {
         // Extract the object from the JS file
         const objectMatch = data.match(/export\s+default\s+(\{[\s\S]*\})/);
         if (!objectMatch) return []
         
         // Safely evaluate the object (simplified for known structure)
         const rpcData = JSON.parse(objectMatch[1].replace(/(\w+):/g, '"$1":').replace(/'/g, '"'))
         
         const chains: ChainData[] = []
         for (const [chainId, rpcList] of Object.entries(rpcData)) {
           const id = parseInt(chainId)
           if (id > 0 && Array.isArray(rpcList)) {
             chains.push({
               chainId: id,
               name: `Chain ${id}`,
               shortName: `chain-${id}`,
               network: `network-${id}`,
               networkId: id,
               nativeCurrency: { name: 'Unknown', symbol: 'UNKNOWN', decimals: 18 },
               rpc: rpcList as string[],
               faucets: [],
               explorers: [],
               infoURL: '',
               status: 'active',
               verified: false,
               isTestnet: id > 1000000,
               chain: `chain-${id}`,
               tags: ['evm-compatible']
             })
           }
         }
         return chains
       }
     } catch (error) {
       console.warn('Failed to parse extra RPC data:', error)
     }
     return []
   }

  /**
   * Parse CoinGecko API response
   */
  private async parseCoinGeckoResponse(data: CoinGeckoResponse[]): Promise<ChainData[]> {
    if (!Array.isArray(data)) return []

    return data
      .filter(platform => platform.chain_identifier && platform.name)
      .map(platform => ({
        chainId: platform.chain_identifier,
        name: platform.name,
        shortName: platform.shortname || platform.name.toLowerCase().replace(/\s+/g, ''),
        network: platform.name.toLowerCase().replace(/\s+/g, '-'),
        networkId: platform.chain_identifier,
        nativeCurrency: {
          name: platform.native_coin_id || 'Unknown',
          symbol: platform.native_coin_id?.toUpperCase() || 'UNKNOWN',
          decimals: 18
        },
        rpc: [],
        faucets: [],
        explorers: [],
        infoURL: '',
        status: 'active',
        verified: true, // CoinGecko platforms are generally verified
        isTestnet: false,
        chain: platform.shortname || platform.name,
        tags: ['mainnet', 'evm-compatible']
      }))
  }

  /**
   * Merge chain data from multiple sources, prioritizing completeness
   */
  private mergeChainSources(existing: ChainData[], newChains: ChainData[]): ChainData[] {
    const chainMap = new Map<number, ChainData>()

    // Add existing chains
    existing.forEach(chain => chainMap.set(chain.chainId, chain))

    // Merge or add new chains
    newChains.forEach(newChain => {
      const existingChain = chainMap.get(newChain.chainId)
      
      if (existingChain) {
        // Merge bridge information
        const mergedBridges = [...(existingChain.bridges || [])]
        if (newChain.bridges) {
          newChain.bridges.forEach(newBridge => {
            const existingBridgeIndex = mergedBridges.findIndex(b => 
              b.name === newBridge.name && b.type === newBridge.type
            )
            if (existingBridgeIndex === -1) {
              mergedBridges.push(newBridge)
            } else {
              // Update existing bridge with more complete information
              mergedBridges[existingBridgeIndex] = {
                ...mergedBridges[existingBridgeIndex],
                chains: [...new Set([...mergedBridges[existingBridgeIndex].chains, ...newBridge.chains])],
                protocols: [...new Set([...mergedBridges[existingBridgeIndex].protocols, ...newBridge.protocols])]
              }
            }
          })
        }

        // Merge parent chain bridge information
        const mergedParent = existingChain.parent || newChain.parent
        if (mergedParent && newChain.parent) {
          mergedParent.bridges = [
            ...(mergedParent.bridges || []),
            ...(newChain.parent.bridges || [])
          ].filter((bridge, index, self) => 
            index === self.findIndex(b => b === bridge)
          )
        }

        // Merge data, preferring more complete information
        chainMap.set(newChain.chainId, {
          ...existingChain,
          ...newChain,
          rpc: [...new Set([...existingChain.rpc, ...newChain.rpc])],
          explorers: newChain.explorers.length > 0 ? newChain.explorers : existingChain.explorers,
          infoURL: newChain.infoURL || existingChain.infoURL,
          icon: newChain.icon || existingChain.icon,
          verified: existingChain.verified || newChain.verified,
          bridges: mergedBridges,
          parent: mergedParent,
          tags: [...new Set([
            ...(existingChain.tags || []), 
            ...(newChain.tags || []),
            ...(mergedBridges.length > 0 ? ['bridged'] : [])
          ])]
        })
      } else {
        chainMap.set(newChain.chainId, newChain)
      }
    })

    return Array.from(chainMap.values())
  }

  /**
   * Sort and validate final chain list
   */
  private sortAndValidateChains(chains: ChainData[]): ChainData[] {
    return chains
      .filter(chain => chain.chainId > 0 && chain.name && chain.name.trim().length > 0)
      .sort((a, b) => {
        // Verified chains first
        if (a.verified !== b.verified) return a.verified ? -1 : 1
        // Mainnet before testnet
        if (a.isTestnet !== b.isTestnet) return a.isTestnet ? 1 : -1
        // Alphabetical by name
        return a.name.localeCompare(b.name)
      })
  }

  /**
   * Transform and validate individual chain data
   */
  private transformChain(chain: ChainListAPIResponse): ChainData {
    // Get bridge information for this chain
    const bridges = this.getBridgeInfo(chain)
    const tags = this.generateTags(chain)
    
    // Enhanced data quality assessment
    const dataQuality = this.assessDataQuality(chain)
    
    // Network maturity assessment
    const maturity = this.assessNetworkMaturity(chain)
    
    // Security assessment
    const security = this.assessSecurity(chain)

    return {
      chainId: chain.chainId,
      name: chain.name.trim(),
      shortName: chain.shortName?.trim() || chain.name.toLowerCase().replace(/\s+/g, ''),
      network: chain.network?.trim() || chain.name.toLowerCase().replace(/\s+/g, '-'),
      networkId: chain.networkId || chain.chainId,
      nativeCurrency: {
        name: chain.nativeCurrency.name.trim(),
        symbol: chain.nativeCurrency.symbol.trim().toUpperCase(),
        decimals: chain.nativeCurrency.decimals || 18
      },
      rpc: Array.isArray(chain.rpc) ? chain.rpc.filter(url => this.isValidRpcUrl(url)) : [],
      faucets: Array.isArray(chain.faucets) ? chain.faucets : [],
      explorers: Array.isArray(chain.explorers) ? chain.explorers : [],
      infoURL: chain.infoURL?.trim() || '',
      status: (chain.status as "active" | "deprecated" | "incubating") || 'active',
      icon: chain.icon?.trim(),
      verified: this.detectVerified(chain),
      isTestnet: this.detectTestnet(chain),
      chain: chain.chain?.trim() || chain.shortName?.trim() || chain.name,
      parent: chain.parent ? {
        type: chain.parent.type as "L2" | "sidechain" | "rollup",
        chain: chain.parent.chain
      } : undefined,
      bridges: bridges,
      tags: [...tags, ...(bridges.length > 0 ? ['bridged'] : [])],
      // Enhanced metadata for comparison
      features: this.generateFeatures(chain),
      ens: this.detectENS(chain),
      redFlags: this.detectRedFlags(chain)
    }
  }

  /**
   * Validate chain data quality
   */
  private isValidChain(chain: unknown): boolean {
    return (
      chain &&
      typeof (chain as any).chainId === 'number' &&
      (chain as any).chainId > 0 &&
      typeof (chain as any).name === 'string' &&
      (chain as any).name.trim().length > 0 &&
      (chain as any).nativeCurrency &&
      typeof (chain as any).nativeCurrency.symbol === 'string' &&
      (chain as any).nativeCurrency.symbol.trim().length > 0
    )
  }

  /**
   * Validate RPC URL format
   */
  private isValidRpcUrl(url: string): boolean {
    try {
      const parsed = new URL(url)
      return ['http:', 'https:', 'wss:', 'ws:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  /**
   * Detect if chain is a testnet
   */
  private detectTestnet(chain: ChainListAPIResponse): boolean {
    const testnetKeywords = ['test', 'sepolia', 'goerli', 'mumbai', 'fuji', 'chapel', 'rinkeby', 'ropsten', 'kovan']
    const name = chain.name.toLowerCase()
    const shortName = chain.shortName?.toLowerCase() || ''
    const network = chain.network?.toLowerCase() || ''
    
    const testnetChainIdThreshold = parseInt(import.meta.env.TESTNET_CHAIN_ID_THRESHOLD || '1000000')
    
    return testnetKeywords.some(keyword => 
      name.includes(keyword) || 
      shortName.includes(keyword) || 
      network.includes(keyword)
    ) || chain.chainId > testnetChainIdThreshold // Use dynamic threshold
  }

  /**
   * Detect if chain is verified/trusted
   */
  private detectVerified(chain: ChainListAPIResponse): boolean {
    // Use environment variable for trusted chain IDs or fallback to common ones
    const trustedChainIdsEnv = import.meta.env.TRUSTED_CHAIN_IDS
    const trustedChainIds = trustedChainIdsEnv 
      ? trustedChainIdsEnv.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [1, 10, 25, 56, 100, 137, 250, 324, 1101, 8453, 42161, 43114, 42220]
    
    const trustedNames = ['ethereum', 'polygon', 'binance', 'avalanche', 'fantom', 'optimism', 'arbitrum', 'base']
    
    if (trustedChainIds.includes(chain.chainId)) return true
    
    const name = chain.name.toLowerCase()
    return trustedNames.some(trusted => name.includes(trusted)) ||
           (chain.explorers && chain.explorers.length > 0) ||
           (chain.infoURL && chain.infoURL.length > 0)
  }

  /**
   * Generate appropriate tags for chain
   */
  private generateTags(chain: ChainListAPIResponse): string[] {
    const tags: string[] = []
    
    if (this.detectTestnet(chain)) {
      tags.push('testnet')
    } else {
      tags.push('mainnet')
    }
    
    if (this.detectVerified(chain)) {
      tags.push('verified')
    }
    
    // Layer detection
    if (chain.parent?.type === 'L2' || chain.parent?.type === 'rollup') {
      tags.push('L2')
    } else {
      tags.push('L1')
    }
    
    if (chain.parent?.type === 'rollup') {
      tags.push('rollup')
    }
    
    tags.push('evm-compatible')
    
    return tags
  }

  /**
   * Generate features for chain
   */
  private generateFeatures(chain: ChainListAPIResponse): ChainFeature[] {
    const features: ChainFeature[] = []
    
    // Basic EVM features
    features.push({
      name: 'EVM Compatible',
      type: 'standard',
      description: 'Ethereum Virtual Machine compatibility',
      supported: true
    })
    
    // RPC features
    if (chain.rpc && chain.rpc.length > 0) {
      features.push({
        name: 'JSON-RPC',
        type: 'standard',
        description: 'JSON-RPC API support',
        supported: true
      })
    }
    
    // Explorer features
    if (chain.explorers && chain.explorers.length > 0) {
      features.push({
        name: 'Block Explorer',
        type: 'standard',
        description: 'Block explorer available',
        supported: true
      })
    }
    
    // Faucet features
    if (chain.faucets && chain.faucets.length > 0) {
      features.push({
        name: 'Testnet Faucet',
        type: 'standard',
        description: 'Testnet faucet available',
        supported: true
      })
    }
    
    // Bridge features
    if (chain.parent) {
      features.push({
        name: 'Native Bridge',
        type: 'custom',
        description: 'Native bridge to parent chain',
        supported: true
      })
    }
    
    return features
  }

  /**
   * Detect ENS support
   */
  private detectENS(chain: ChainListAPIResponse): { registry?: string; resolverAddress?: string } | undefined {
    // Only Ethereum mainnet and some L2s support ENS
    if (chain.chainId === 1) {
      return {
        registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
      }
    }
    
    // Some L2s have ENS support
    const ensSupportedL2s = [10, 137, 42161, 8453] // Optimism, Polygon, Arbitrum, Base
    if (ensSupportedL2s.includes(chain.chainId)) {
      return {
        registry: 'ENS Supported',
        resolverAddress: 'L2 ENS'
      }
    }
    
    return undefined
  }

  /**
   * Detect red flags for chain
   */
  private detectRedFlags(chain: ChainListAPIResponse): string[] {
    const redFlags: string[] = []
    
    // No RPC endpoints
    if (!chain.rpc || chain.rpc.length === 0) {
      redFlags.push('No RPC endpoints available')
    }
    
    // No explorers
    if (!chain.explorers || chain.explorers.length === 0) {
      redFlags.push('No block explorers available')
    }
    
    // No info URL
    if (!chain.infoURL || chain.infoURL.trim() === '') {
      redFlags.push('No official information URL')
    }
    
    // Suspicious chain ID
    if (chain.chainId < 1 || chain.chainId > 999999999) {
      redFlags.push('Suspicious chain ID range')
    }
    
    // No native currency info
    if (!chain.nativeCurrency || !chain.nativeCurrency.symbol) {
      redFlags.push('Missing native currency information')
    }
    
    return redFlags
  }

  /**
   * Assess data quality for chain
   */
  private assessDataQuality(chain: ChainListAPIResponse): {
    score: number
    completeness: number
    accuracy: number
    sources: string[]
  } {
    let score = 0
    let completeness = 0
    let accuracy = 0
    const sources: string[] = []
    
    // Completeness assessment
    if (chain.name && chain.name.trim()) completeness += 20
    if (chain.shortName && chain.shortName.trim()) completeness += 10
    if (chain.nativeCurrency && chain.nativeCurrency.symbol) completeness += 15
    if (chain.rpc && chain.rpc.length > 0) completeness += 20
    if (chain.explorers && chain.explorers.length > 0) completeness += 15
    if (chain.infoURL && chain.infoURL.trim()) completeness += 10
    if (chain.icon && chain.icon.trim()) completeness += 5
    if (chain.faucets && chain.faucets.length > 0) completeness += 5
    
    // Accuracy assessment
    if (this.detectVerified(chain)) accuracy += 30
    if (chain.explorers && chain.explorers.length > 0) accuracy += 25
    if (chain.rpc && chain.rpc.length > 1) accuracy += 20
    if (chain.infoURL && chain.infoURL.includes('http')) accuracy += 15
    if (chain.chainId > 0 && chain.chainId < 1000000) accuracy += 10
    
    // Sources
    if (chain.chainId === 1) sources.push('Ethereum Foundation')
    if (this.detectVerified(chain)) sources.push('Verified Source')
    if (chain.explorers && chain.explorers.length > 0) sources.push('Block Explorer')
    
    score = Math.round((completeness + accuracy) / 2)
    
    return {
      score: Math.min(score, 100),
      completeness: Math.min(completeness, 100),
      accuracy: Math.min(accuracy, 100),
      sources
    }
  }

  /**
   * Assess network maturity
   */
  private assessNetworkMaturity(chain: ChainListAPIResponse): {
    score: number
    age: string
    adoption: string
    development: string
  } {
    let score = 0
    let age = 'Unknown'
    let adoption = 'Low'
    let development = 'Early'
    
    // Age assessment based on chain ID ranges
    if (chain.chainId <= 100) {
      age = 'Early (2015-2020)'
      score += 20
    } else if (chain.chainId <= 1000) {
      age = 'Established (2020-2022)'
      score += 40
    } else if (chain.chainId <= 10000) {
      age = 'Recent (2022-2023)'
      score += 30
    } else {
      age = 'New (2023+)'
      score += 10
    }
    
    // Adoption assessment
    if (this.detectVerified(chain)) {
      adoption = 'High'
      score += 40
    } else if (chain.explorers && chain.explorers.length > 0) {
      adoption = 'Medium'
      score += 25
    } else {
      adoption = 'Low'
      score += 10
    }
    
    // Development assessment
    if (chain.rpc && chain.rpc.length > 2) {
      development = 'Active'
      score += 40
    } else if (chain.rpc && chain.rpc.length > 0) {
      development = 'Developing'
      score += 25
    } else {
      development = 'Early'
      score += 10
    }
    
    return {
      score: Math.min(score, 100),
      age,
      adoption,
      development
    }
  }

  /**
   * Assess security for chain
   */
  private assessSecurity(chain: ChainListAPIResponse): {
    score: number
    consensus: string
    decentralization: string
    audit: string
  } {
    let score = 0
    let consensus = 'Unknown'
    let decentralization = 'Unknown'
    let audit = 'Unknown'
    
    // Consensus assessment
    if (chain.chainId === 1) {
      consensus = 'PoS (Ethereum)'
      score += 40
    } else if (chain.parent) {
      consensus = 'L2 Consensus'
      score += 30
    } else {
      consensus = 'Custom'
      score += 20
    }
    
    // Decentralization assessment
    if (this.detectVerified(chain)) {
      decentralization = 'High'
      score += 40
    } else if (chain.explorers && chain.explorers.length > 0) {
      decentralization = 'Medium'
      score += 25
    } else {
      decentralization = 'Low'
      score += 10
    }
    
    // Audit assessment
    if (chain.chainId === 1) {
      audit = 'Extensively Audited'
      score += 40
    } else if (this.detectVerified(chain)) {
      audit = 'Audited'
      score += 30
    } else {
      audit = 'Unknown'
      score += 10
    }
    
    return {
      score: Math.min(score, 100),
      consensus,
      decentralization,
      audit
    }
  }

  /**
   * Get bridge information for a chain
   */
  private getBridgeInfo(chain: ChainListAPIResponse): BridgeInfo[] {
    const bridges: BridgeInfo[] = []

    // Add native bridges from parent chain info
    if (chain.parent && 'bridges' in chain.parent && Array.isArray(chain.parent.bridges)) {
      bridges.push(...(chain.parent.bridges as string[]).map(url => ({
        name: `${chain.parent?.chain || 'Parent'} Bridge`,
        url,
        type: 'native' as const,
        chains: [chain.chainId],
        protocols: [chain.parent?.type === 'rollup' ? 'rollup' : 'bridge'] // More descriptive protocol type
      })))
    }

    // Add known bridges based on chain type
    if (chain.parent?.type === 'L2' || chain.parent?.type === 'rollup') {
      const parentChain = chain.parent.chain.toLowerCase()
      
      // Ethereum L2 bridges
      if (parentChain === 'ethereum') {
        switch (chain.name.toLowerCase()) {
          case 'arbitrum one':
          case 'arbitrum':
            bridges.push({
              name: 'Arbitrum Bridge',
              url: 'https://bridge.arbitrum.io',
              type: 'native',
              chains: [1, chain.chainId],
              protocols: ['optimistic']
            })
            break
          case 'optimism':
            bridges.push({
              name: 'Optimism Bridge',
              url: 'https://app.optimism.io/bridge',
              type: 'native',
              chains: [1, chain.chainId],
              protocols: ['optimistic']
            })
            break
          case 'base':
            bridges.push({
              name: 'Base Bridge',
              url: 'https://bridge.base.org',
              type: 'native',
              chains: [1, chain.chainId],
              protocols: ['optimistic']
            })
            break
          case 'polygon zkevm':
            bridges.push({
              name: 'Polygon zkEVM Bridge',
              url: 'https://bridge.zkevm-rpc.com',
              type: 'native',
              chains: [1, chain.chainId],
              protocols: ['zk']
            })
            break
        }
      }
    }

    // Add third-party bridges
    if (!this.detectTestnet(chain)) {
      // LayerZero
      bridges.push({
        name: 'LayerZero',
        url: 'https://layerzero.network',
        type: 'third-party',
        chains: [chain.chainId],
        protocols: ['layerzero']
      })

      // Axelar
      bridges.push({
        name: 'Axelar',
        url: 'https://satellite.axelar.network',
        type: 'third-party',
        chains: [chain.chainId],
        protocols: ['axelar']
      })

      // Multichain (if chain is supported)
      if (this.detectVerified(chain)) {
        bridges.push({
          name: 'Multichain',
          url: 'https://app.multichain.org',
          type: 'third-party',
          chains: [chain.chainId],
          protocols: ['multichain']
        })
      }
    }

    return bridges
  }

  /**
   * Search chains with enhanced filtering
   */
  async searchChains(query: string): Promise<ChainData[]> {
    const chains = await this.fetchChains()
    if (!query.trim()) return chains

    const searchTerm = query.toLowerCase().trim()
    
    return chains.filter(chain => {
      return (
        chain.name.toLowerCase().includes(searchTerm) ||
        chain.shortName.toLowerCase().includes(searchTerm) ||
        chain.nativeCurrency.symbol.toLowerCase().includes(searchTerm) ||
        chain.chainId.toString().includes(searchTerm) ||
        chain.network.toLowerCase().includes(searchTerm) ||
        (chain.tags && chain.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      )
    })
  }

  /**
   * Get specific chain by ID
   */
  async getChainById(chainId: number): Promise<ChainData | null> {
    const chains = await this.fetchChains()
    return chains.find(chain => chain.chainId === chainId) || null
  }

  /**
   * Get mainnet chains only
   */
  async getMainnetChains(): Promise<ChainData[]> {
    const chains = await this.fetchChains()
    return chains.filter(chain => !chain.isTestnet)
  }

  /**
   * Get testnet chains only
   */
  async getTestnetChains(): Promise<ChainData[]> {
    const chains = await this.fetchChains()
    return chains.filter(chain => chain.isTestnet)
  }

  /**
   * Get verified chains only
   */
  async getVerifiedChains(): Promise<ChainData[]> {
    const chains = await this.fetchChains()
    return chains.filter(chain => chain.verified)
  }

  /**
   * Clear cache and force refresh
   */
  clearCache(): void {
    this.chainsCache = []
    this.cacheTimestamp = 0
    if (import.meta.env.NODE_ENV === 'development') {
      console.log('🗑️ Chain cache cleared')
    }
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { size: number; age: number; isValid: boolean } {
    const age = Date.now() - this.cacheTimestamp
    return {
      size: this.chainsCache.length,
      age,
      isValid: this.chainsCache.length > 0 && age < this.CACHE_DURATION
    }
  }
}

// Export singleton instance
export const chainListAPI = ChainListAPI.getInstance()