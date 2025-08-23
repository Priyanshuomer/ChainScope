import { ChainData, MergedChainData, EthereumListsMetadata, RpcEndpoint, ChainFeature, BridgeInfo } from "@/types/chain"
import { ethereumListsAPI } from "./ethereum-lists-api"
import { chainListAPI } from "./api"
import { RpcMonitor } from "./rpc-monitor"

export class ChainDataMerger {
  private static instance: ChainDataMerger
  
  static getInstance(): ChainDataMerger {
    if (!ChainDataMerger.instance) {
      ChainDataMerger.instance = new ChainDataMerger()
    }
    return ChainDataMerger.instance
  }

  private constructor() {}

  async fetchMergedChains(): Promise<MergedChainData[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Starting chain data merge process...')
      }
      
      // Fetch data from both sources with graceful fallbacks
      const [chainListData, ethereumListsMetadata] = await Promise.allSettled([
        chainListAPI.fetchChains(),
        // CRITICAL FIX: Skip heavy metadata fetching in development to prevent resource exhaustion
        process.env.NODE_ENV === 'development' ? Promise.resolve(new Map()) : this.fetchAllEthereumListsMetadata()
      ])

      const chains = chainListData.status === 'fulfilled' ? chainListData.value : []
      const metadata = ethereumListsMetadata.status === 'fulfilled' ? ethereumListsMetadata.value : new Map()

      if (chainListData.status === 'rejected') {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ ChainList API failed:', chainListData.reason)
        }
      }
      
      if (ethereumListsMetadata.status === 'rejected') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Ethereum Lists API failed, proceeding without enhanced metadata:', ethereumListsMetadata.reason)
        }
      }

      // Development mode optimization message
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Skipped heavy metadata fetching to prevent resource exhaustion')
      }

      // Validate chains data with immediate fallback
      if (!Array.isArray(chains) || chains.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ No valid chain data from APIs, using built-in fallback...')
        }
        
        // Import fallback chains with error handling
        try {
          const { fallbackChains } = await import('@/data/fallbackChains')
          
          if (!fallbackChains || fallbackChains.length === 0) {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ Fallback chains are empty!')
            }
            return this.getMinimalFallbackChains()
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Emergency fallback loaded: ${fallbackChains.length} chains`)
          }
          
          // Convert fallback chains to merged format quickly
          const emergencyMerged: MergedChainData[] = fallbackChains.map(chain => ({
            ...chain,
            dataSource: 'fallback' as const,
            lastUpdated: new Date(),
            rpcEndpoints: chain.rpc.map(url => ({
              url,
              status: 'offline' as const,
              tracking: 'none' as const,
              latency: undefined,
              lastChecked: new Date(),
              reliability: undefined,
              score: undefined,
              isValid: true
            })),
            rpcHealth: undefined // Don't provide mock health data
          }))
          
          return emergencyMerged
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Failed to load fallback chains:', error)
          }
          return this.getMinimalFallbackChains()
        }
      }

      // Don't show backend processing details to users in production
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Processing ${chains.length} chains with ${metadata.size} metadata entries`)
      }

      // Process chains quickly for initial load WITHOUT RPC testing
      const mergedChains: MergedChainData[] = []
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 Creating basic merged chains for fast initial load...`)
      }
      
      // Process all chains quickly without RPC testing for initial load
      for (const chain of chains) {
        try {
          const chainMetadata = metadata.get(chain.chainId)
          const mergedChain = this.createFastMergedChain(chain, chainMetadata)
          mergedChains.push(mergedChain)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ Failed to merge data for chain ${chain.chainId}:`, error)
          }
          const fallbackChain = this.createFallbackChain(chain)
          mergedChains.push(fallbackChain)
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Successfully merged data for ${mergedChains.length} chains`)
      }
      
      // Smart sorting: data quality and importance first
      return this.sortChainsByQuality(mergedChains)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Critical error in chain data merger:', error)
      }
      // Return minimal fallback data instead of empty array to prevent app crash
      return this.getMinimalFallbackChains()
    }
  }

  // Fast chain creation without RPC testing for initial load
  private createFastMergedChain(chain: ChainData, metadata?: EthereumListsMetadata | null): MergedChainData {
    return {
      ...chain,
      dataSource: metadata ? 'merged' : 'chainlist',
      lastUpdated: new Date(),
      // Enhanced metadata from ethereum-lists
      ...(metadata && {
        features: this.mergeFeatures(chain.features, metadata.features),
        tags: this.mergeTags(chain.tags, metadata.tags),
        parent: metadata.parent || chain.parent,
        bridges: metadata.bridges || []
      }),
      // Create RPC endpoints without testing for fast load
                  rpcEndpoints: chain.rpc.map(url => ({
              url,
              status: 'offline' as const,
              tracking: this.detectTracking(url),
              latency: undefined,
              lastChecked: new Date(),
              reliability: undefined,
              score: undefined,
              isValid: true
            })),
      rpcHealth: undefined, // Will be populated later
      bridges: metadata?.bridges || this.detectBridges(chain)
    }
  }

  async fetchMergedChainById(chainId: number): Promise<MergedChainData | null> {
    try {
      const [chainResult, metadataResult] = await Promise.allSettled([
        chainListAPI.getChainById(chainId),
        ethereumListsAPI.fetchChainMetadata(chainId)
      ])

      const chainData = chainResult.status === 'fulfilled' ? chainResult.value : null
      const metadata = metadataResult.status === 'fulfilled' ? metadataResult.value : null

      if (metadataResult.status === 'rejected') {
        console.warn(`Failed to fetch enhanced metadata for chain ${chainId}:`, metadataResult.reason)
      }

      if (!chainData) {
        console.warn(`No chain data found for chain ID ${chainId}`)
        return null
      }

      return await this.mergeChainData(chainData, metadata)
    } catch (error) {
      console.error(`Critical error fetching merged data for chain ${chainId}:`, error)
      return null
    }
  }

  private async fetchAllEthereumListsMetadata(): Promise<Map<number, EthereumListsMetadata>> {
    try {
      // Get all chains first to know which metadata to fetch
      const chains = await chainListAPI.fetchChains()
      
      // CRITICAL FIX: Only process popular/verified chains to prevent resource exhaustion
      const maxMetadataChains = parseInt(process.env.MAX_METADATA_CHAINS || '50')
      const maxChainId = parseInt(process.env.MAX_CHAIN_ID || '10000')
      
      const popularChainIds = chains
        .filter(chain => (chain.verified || chain.chainId <= 1000) && chain.chainId <= maxChainId)
        .slice(0, maxMetadataChains)
        .map(c => c.chainId)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Fetching metadata for ${popularChainIds.length} popular chains (out of ${chains.length} total)`)
      }
      
      // Fetch metadata for popular chains only
      return await ethereumListsAPI.fetchMultipleChainMetadata(popularChainIds)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Failed to fetch Ethereum Lists metadata:', error)
      }
      return new Map()
    }
  }

  private async mergeChainData(
    chainData: ChainData, 
    metadata?: EthereumListsMetadata | null
  ): Promise<MergedChainData> {
    // Test RPC endpoints for real-time health data
          const rpcMonitor = RpcMonitor.getInstance()
      const testedRpcEndpoints = await rpcMonitor.testMultipleRpcs(chainData.rpc)
    
    const merged: MergedChainData = {
      ...chainData,
      dataSource: metadata ? 'merged' : 'chainlist',
      lastUpdated: new Date(),
      rpcEndpoints: testedRpcEndpoints,
      rpcHealth: this.calculateRpcHealth(testedRpcEndpoints)
    }

    if (metadata) {
      // Merge enhanced metadata from Ethereum-lists
      merged.title = metadata.title || chainData.name
      merged.parent = metadata.parent || chainData.parent
      merged.features = this.mergeFeatures(chainData.features, metadata.features)
      merged.bridges = metadata.bridges || chainData.bridges
      merged.slip44 = metadata.slip44 || chainData.slip44
      merged.ens = metadata.ens || chainData.ens
      merged.redFlags = metadata.redFlags || chainData.redFlags
      merged.tags = this.mergeTags(chainData.tags, metadata.tags)
      
      // Prefer Ethereum-lists explorers if they have icons
      if (metadata.explorers && metadata.explorers.some(e => e.icon)) {
        merged.explorers = metadata.explorers
      }
      
      // Merge RPC endpoints with enhanced metadata
      merged.rpc = this.mergeRpcUrls(chainData.rpc, metadata.rpc)
    }

    return merged
  }

  private mergeFeatures(
    chainListFeatures?: ChainFeature[], 
    metadataFeatures?: ChainFeature[]
  ): ChainFeature[] | undefined {
    const features = new Map()
    
    // Add ChainList features
    chainListFeatures?.forEach(feature => {
      features.set(feature.name, feature)
    })
    
    // Add/update with Ethereum-lists features
    metadataFeatures?.forEach(feature => {
      features.set(feature.name, feature)
    })
    
    return features.size > 0 ? Array.from(features.values()) : undefined
  }

  private mergeTags(
    chainListTags?: string[], 
    metadataTags?: string[]
  ): string[] | undefined {
    const tags = new Set<string>()
    
    chainListTags?.forEach(tag => tags.add(tag))
    metadataTags?.forEach(tag => tags.add(tag))
    
    return tags.size > 0 ? Array.from(tags) : undefined
  }

  private mergeRpcUrls(chainListRpc: string[], metadataRpc: string[]): string[] {
    const urls = new Set<string>()
    
    chainListRpc.forEach(url => urls.add(url))
    metadataRpc.forEach(url => urls.add(url))
    
    return Array.from(urls)
  }

  private calculateRpcHealth(rpcEndpoints?: RpcEndpoint[]): {
    averageLatency?: number
    reliabilityScore?: number
    privacyScore?: number
  } | undefined {
    if (!rpcEndpoints || rpcEndpoints.length === 0) return undefined

    const validEndpoints = rpcEndpoints.filter(rpc => rpc.latency !== undefined)
    
    if (validEndpoints.length === 0) return undefined

    // Calculate average latency
    const averageLatency = validEndpoints.reduce((sum, rpc) => sum + (rpc.latency || 0), 0) / validEndpoints.length

    // Calculate reliability score (percentage of healthy endpoints)
    const healthyCount = rpcEndpoints.filter(rpc => rpc.status === 'online').length
    const reliabilityScore = (healthyCount / rpcEndpoints.length) * 100

    // Calculate privacy score based on tracking status
    const privacyScores = rpcEndpoints.map(rpc => {
      switch (rpc.tracking) {
        case 'no':
        case 'none': return 100
        case 'limited': return 60
        case 'yes': return 20
        default: return 50
      }
    })
    const privacyScore = privacyScores.length > 0 
      ? privacyScores.reduce((sum, score) => sum + score, 0) / privacyScores.length 
      : undefined

    return {
      averageLatency: Math.round(averageLatency),
      reliabilityScore: Math.round(reliabilityScore),
      privacyScore: privacyScore ? Math.round(privacyScore) : undefined
    }
  }

  async searchMergedChains(query: string): Promise<MergedChainData[]> {
    const mergedChains = await this.fetchMergedChains()
    return this.filterChains(mergedChains, query)
  }

  async getMainnetMergedChains(): Promise<MergedChainData[]> {
    const mergedChains = await this.fetchMergedChains()
    return mergedChains.filter(chain => !chain.isTestnet)
  }

  async getTestnetMergedChains(): Promise<MergedChainData[]> {
    const mergedChains = await this.fetchMergedChains()
    return mergedChains.filter(chain => chain.isTestnet)
  }

  async getL2MergedChains(): Promise<MergedChainData[]> {
    const mergedChains = await this.fetchMergedChains()
    return mergedChains.filter(chain => chain.parent || chain.tags?.includes('L2'))
  }

  async getVerifiedMergedChains(): Promise<MergedChainData[]> {
    const mergedChains = await this.fetchMergedChains()
    return mergedChains.filter(chain => chain.verified)
  }

  private filterChains(chains: MergedChainData[], query: string): MergedChainData[] {
    if (!query.trim()) return chains

    const searchTerm = query.toLowerCase()
    
    return chains.filter(chain => {
      return (
        chain.name.toLowerCase().includes(searchTerm) ||
        chain.shortName.toLowerCase().includes(searchTerm) ||
        chain.nativeCurrency.symbol.toLowerCase().includes(searchTerm) ||
        chain.chainId.toString().includes(searchTerm) ||
        chain.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        chain.title?.toLowerCase().includes(searchTerm)
      )
    })
  }

  // Helper methods for RPC testing and data processing
  private async testRpcSample(rpcUrls: string[]): Promise<RpcEndpoint[]> {
    if (rpcUrls.length === 0) return []
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Testing ${rpcUrls.length} RPC endpoints for chain...`)
    }
    
    try {
      // For chains with many RPCs, test a sample to avoid rate limiting
      const maxTestCount = 5 // Test max 5 RPCs per chain
      const urlsToTest = rpcUrls.length > maxTestCount 
        ? rpcUrls.slice(0, maxTestCount) 
        : rpcUrls
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Testing sample of ${urlsToTest.length} out of ${rpcUrls.length} RPCs`)
      }
      
      const rpcMonitor = RpcMonitor.getInstance()
      const testedResults = await rpcMonitor.testMultipleRpcs(urlsToTest)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ RPC testing completed:`, {
          total: rpcUrls.length,
          tested: testedResults.length,
          online: testedResults.filter(r => r.status === 'online').length,
          offline: testedResults.filter(r => r.status === 'offline').length,
          slow: testedResults.filter(r => r.status === 'slow').length
        })
      }
      
      // If we tested all RPCs, return as is
      if (urlsToTest.length === rpcUrls.length) {
        return testedResults
      }
      
      // Otherwise, expand results for untested RPCs
      return this.expandRpcResults(testedResults, rpcUrls)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('❌ RPC testing failed:', error)
      }
      // Return offline status for all RPCs when testing fails
      return rpcUrls.map(url => ({
        url,
        status: 'offline' as const,
        tracking: this.detectTracking(url),
        latency: undefined,
        lastChecked: new Date(),
        reliability: undefined,
        score: undefined,
        isValid: true
      }))
    }
  }

  private calculateBasicHealth(testedEndpoints: RpcEndpoint[], totalRpcCount: number): {
    averageLatency?: number
    reliabilityScore?: number
    privacyScore?: number
  } {
    if (testedEndpoints.length === 0) {
      return {
        averageLatency: undefined,
        reliabilityScore: 0,
        privacyScore: undefined
      }
    }

    // Calculate average latency from tested endpoints
    const validLatencies = testedEndpoints.filter(rpc => rpc.latency && rpc.latency > 0)
    const averageLatency = validLatencies.length > 0
      ? Math.round(validLatencies.reduce((sum, rpc) => sum + (rpc.latency || 0), 0) / validLatencies.length)
      : undefined

    // Calculate reliability score (extrapolate from sample to total)
    const healthyCount = testedEndpoints.filter(rpc => rpc.status === 'online').length
    const sampleReliability = testedEndpoints.length > 0 ? (healthyCount / testedEndpoints.length) * 100 : 0
    
    // Privacy score based on tracking detection
    const privacyScores = testedEndpoints.map(rpc => this.getPrivacyScore(rpc.tracking))
    const privacyScore = privacyScores.length > 0
      ? Math.round(privacyScores.reduce((sum, score) => sum + score, 0) / privacyScores.length)
      : undefined

    return {
      averageLatency,
      reliabilityScore: Math.round(sampleReliability),
      privacyScore
    }
  }

  private expandRpcResults(testedEndpoints: RpcEndpoint[], allRpcUrls: string[]): RpcEndpoint[] {
    const testedUrls = new Set(testedEndpoints.map(rpc => rpc.url))
    const expandedResults: RpcEndpoint[] = [...testedEndpoints]
    
    // Add untested RPCs with unknown status
    for (const url of allRpcUrls) {
      if (!testedUrls.has(url)) {
        expandedResults.push({
          url,
          status: 'offline' as const, // Don't assume online for untested
          tracking: this.detectTracking(url),
          latency: undefined,
          lastChecked: new Date(),
          reliability: undefined,
          score: undefined,
          isValid: true
        })
      }
    }
    
    return expandedResults
  }

  private detectTracking(url: string): 'none' | 'limited' | 'yes' {
    const lowerUrl = url.toLowerCase()
    
    // Check for common tracking/API key patterns
    if (lowerUrl.includes('infura') || lowerUrl.includes('alchemy') || lowerUrl.includes('moralis')) {
      return 'yes' // These services typically track usage
    }
    
    if (lowerUrl.includes('api') && (lowerUrl.includes('key=') || lowerUrl.includes('apikey'))) {
      return 'limited' // Has API key, limited tracking
    }
    
    if (lowerUrl.includes('localhost') || lowerUrl.includes('127.0.0.1')) {
      return 'none' // Local nodes don't track
    }
    
    // Public endpoints might have limited tracking
    return 'limited'
  }

  private getPrivacyScore(tracking: string): number {
    switch (tracking) {
      case 'none': return 100
      case 'limited': return 60
      case 'yes': return 20
      default: return 50
    }
  }

  private detectBridges(chain: ChainData): BridgeInfo[] {
    // Enhanced bridge detection based on chain data and known ecosystems
    const bridges: BridgeInfo[] = []
    
    // L2 chains typically have bridges to Ethereum
    if (chain.parent?.chain === 'ETH' || chain.tags?.includes('L2') || chain.tags?.includes('rollup')) {
      bridges.push({
        name: 'Native Bridge',
        url: chain.infoURL,
        type: 'native',
        chains: [], // Remove inaccurate chain count
        protocols: ['native']
      })
    }
    
    // Popular chains with known bridge ecosystems
    const bridgeEcosystems: Record<string, Array<{name: string, url: string, protocols: string[]}>> = {
      'polygon': [
        { name: 'Polygon Bridge', url: 'https://wallet.polygon.technology/bridge', protocols: ['native'] },
        { name: 'Hop Protocol', url: 'https://app.hop.exchange', protocols: ['hop'] },
        { name: 'Multichain', url: 'https://app.multichain.org', protocols: ['multichain'] },
        { name: 'Stargate', url: 'https://stargateprotocol.finance', protocols: ['stargate'] }
      ],
      'arbitrum': [
        { name: 'Arbitrum Bridge', url: 'https://bridge.arbitrum.io', protocols: ['native'] },
        { name: 'Hop Protocol', url: 'https://app.hop.exchange', protocols: ['hop'] },
        { name: 'Multichain', url: 'https://app.multichain.org', protocols: ['multichain'] },
        { name: 'Stargate', url: 'https://stargateprotocol.finance', protocols: ['stargate'] }
      ],
      'optimism': [
        { name: 'Optimism Bridge', url: 'https://app.optimism.io/bridge', protocols: ['native'] },
        { name: 'Hop Protocol', url: 'https://app.hop.exchange', protocols: ['hop'] },
        { name: 'Multichain', url: 'https://app.multichain.org', protocols: ['multichain'] },
        { name: 'Stargate', url: 'https://stargateprotocol.finance', protocols: ['stargate'] }
      ],
      'bsc': [
        { name: 'Binance Bridge', url: 'https://www.bnbchain.org/en/bridge', protocols: ['native'] },
        { name: 'Multichain', url: 'https://app.multichain.org', protocols: ['multichain'] },
        { name: 'Stargate', url: 'https://stargateprotocol.finance', protocols: ['stargate'] },
        { name: 'Celer Bridge', url: 'https://cbridge.celer.network', protocols: ['celer'] }
      ],
      'avalanche': [
        { name: 'Avalanche Bridge', url: 'https://bridge.avax.network', protocols: ['native'] },
        { name: 'Multichain', url: 'https://app.multichain.org', protocols: ['multichain'] },
        { name: 'Stargate', url: 'https://stargateprotocol.finance', protocols: ['stargate'] },
        { name: 'Celer Bridge', url: 'https://cbridge.celer.network', protocols: ['celer'] }
      ],
      'fantom': [
        { name: 'Fantom Bridge', url: 'https://bridge.fantom.network', protocols: ['native'] },
        { name: 'Multichain', url: 'https://app.multichain.org', protocols: ['multichain'] },
        { name: 'Stargate', url: 'https://stargateprotocol.finance', protocols: ['stargate'] }
      ],
      'base': [
        { name: 'Base Bridge', url: 'https://bridge.base.org', protocols: ['native'] },
        { name: 'Hop Protocol', url: 'https://app.hop.exchange', protocols: ['hop'] },
        { name: 'Stargate', url: 'https://stargateprotocol.finance', protocols: ['stargate'] }
      ],
      'linea': [
        { name: 'Linea Bridge', url: 'https://bridge.linea.build', protocols: ['native'] },
        { name: 'Hop Protocol', url: 'https://app.hop.exchange', protocols: ['hop'] }
      ],
      'scroll': [
        { name: 'Scroll Bridge', url: 'https://scroll.io/bridge', protocols: ['native'] },
        { name: 'Hop Protocol', url: 'https://app.hop.exchange', protocols: ['hop'] }
      ]
    }
    
    const chainName = chain.name.toLowerCase()
    const shortName = chain.shortName.toLowerCase()
    
    // Check for exact matches first
    for (const [ecosystem, bridgeList] of Object.entries(bridgeEcosystems)) {
      if (chainName.includes(ecosystem) || shortName.includes(ecosystem)) {
        bridgeList.forEach(bridge => {
          bridges.push({
            name: bridge.name,
            url: bridge.url,
            type: 'third-party',
            chains: [], // Remove inaccurate chain count
            protocols: bridge.protocols
          })
        })
        break
      }
    }
    
    // Add generic bridges for chains that might not be in our ecosystem list
    if (bridges.length === 0 && !chain.isTestnet) {
      // Add common third-party bridges
      const genericBridges = [
        { name: 'Multichain', url: 'https://app.multichain.org', protocols: ['multichain'] },
        { name: 'Stargate', url: 'https://stargateprotocol.finance', protocols: ['stargate'] },
        { name: 'Celer Bridge', url: 'https://cbridge.celer.network', protocols: ['celer'] }
      ]
      
      genericBridges.forEach(bridge => {
        bridges.push({
          name: bridge.name,
          url: bridge.url,
          type: 'third-party',
          chains: [], // Remove inaccurate chain count
          protocols: bridge.protocols
        })
      })
    }
    
    return bridges
  }

  private createFallbackChain(chain: ChainData): MergedChainData {
    return {
      ...chain,
      dataSource: 'chainlist',
      lastUpdated: new Date(),
      rpcEndpoints: chain.rpc.map(url => ({
        url,
        status: 'offline' as const,
        tracking: this.detectTracking(url),
        latency: 0,
        lastChecked: new Date(),
        reliability: 0,
        score: 0,
        isValid: false
      })),
      rpcHealth: {
        averageLatency: undefined,
        reliabilityScore: 0,
        privacyScore: undefined
      },
      bridges: []
    }
  }

  private sortChainsByQuality(chains: MergedChainData[]): MergedChainData[] {
    return chains.sort((a, b) => {
      // Primary: verification status (verified first)
      if (a.verified !== b.verified) {
        return a.verified ? -1 : 1
      }
      
      // Secondary: data completeness score
      const aCompleteness = this.calculateDataCompleteness(a)
      const bCompleteness = this.calculateDataCompleteness(b)
      if (aCompleteness !== bCompleteness) {
        return bCompleteness - aCompleteness // Higher completeness first
      }
      
      // Tertiary: mainnet over testnet
      if (a.isTestnet !== b.isTestnet) {
        return a.isTestnet ? 1 : -1
      }
      
      // Quaternary: RPC health (if available)
      const aHealth = a.rpcHealth?.reliabilityScore || 0
      const bHealth = b.rpcHealth?.reliabilityScore || 0
      if (aHealth !== bHealth) {
        return bHealth - aHealth // Higher health first
      }
      
      // Final: alphabetical by name
      return a.name.localeCompare(b.name)
    })
  }

  private calculateDataCompleteness(chain: MergedChainData): number {
    let score = 0
    const maxScore = 10

    // Basic required fields (40% weight)
    if (chain.name) score += 1
    if (chain.chainId) score += 1
    if (chain.rpc && chain.rpc.length > 0) score += 2

    // Enhanced data (60% weight)
    if (chain.icon) score += 1
    if (chain.explorers && chain.explorers.length > 0) score += 1
    if (chain.features && chain.features.length > 0) score += 1
    if (chain.rpcHealth) score += 2
    if (chain.bridges && chain.bridges.length > 0) score += 1

    return (score / maxScore) * 100
  }

  // Minimal fallback chains to prevent app crash
  private getMinimalFallbackChains(): MergedChainData[] {
    return [
      {
        chainId: 1,
        name: 'Ethereum',
        shortName: 'eth',
        network: 'mainnet',
        networkId: 1,
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpc: ['https://ethereum.publicnode.com'],
        faucets: [],
        explorers: [
          {
            name: 'Etherscan',
            url: 'https://etherscan.io',
            standard: 'EIP3091'
          }
        ],
        infoURL: 'https://ethereum.org',
        status: 'active',
        icon: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.png',
        isTestnet: false,
        verified: true,
        dataSource: 'fallback' as const,
        lastUpdated: new Date(),
        rpcEndpoints: [{
          url: 'https://ethereum.publicnode.com',
          status: 'offline' as const,
          tracking: 'none' as const,
          latency: undefined,
          lastChecked: new Date(),
          reliability: undefined,
          score: undefined,
          isValid: true
        }],
        rpcHealth: undefined,
        bridges: [],
        features: [],
        tags: ['ethereum', 'mainnet', 'verified']
      }
    ]
  }

  // Background RPC health update for chains
  async updateRpcHealthForChain(chainId: number): Promise<void> {
    try {
      const chain = await this.fetchMergedChainById(chainId)
      if (!chain) return

      // Test RPC endpoints for this specific chain
      const testedEndpoints = await this.testRpcSample(chain.rpc)
      const rpcHealth = this.calculateRpcHealth(testedEndpoints)

      // Update the chain's RPC data
      chain.rpcEndpoints = this.expandRpcResults(testedEndpoints, chain.rpc)
      chain.rpcHealth = rpcHealth
      chain.lastUpdated = new Date()

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Updated RPC health for chain ${chainId}`)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Failed to update RPC health for chain ${chainId}:`, error)
      }
    }
  }

  // Update RPC health for popular chains in background
  async updatePopularChainsRpcHealth(): Promise<void> {
    // Use environment variable for popular chain IDs or fallback to common ones
    const popularChainIdsEnv = process.env.POPULAR_CHAIN_IDS
    const popularChainIds = popularChainIdsEnv 
      ? popularChainIdsEnv.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [1, 137, 42161, 10, 56, 43114, 250, 100, 1101, 8453] // Ethereum, Polygon, Arbitrum, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Updating RPC health for popular chains...')
    }

    // Update in parallel with limited concurrency
    const batchSize = parseInt(process.env.RPC_UPDATE_BATCH_SIZE || '3')
    for (let i = 0; i < popularChainIds.length; i += batchSize) {
      const batch = popularChainIds.slice(i, i + batchSize)
      await Promise.allSettled(
        batch.map(chainId => this.updateRpcHealthForChain(chainId))
      )
      
      // Small delay between batches to avoid overwhelming
      if (i + batchSize < popularChainIds.length) {
        const delayMs = parseInt(process.env.RPC_UPDATE_DELAY_MS || '1000')
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Popular chains RPC health update completed')
    }
  }

  // Get chains with updated RPC health data
  async getChainsWithRpcHealth(): Promise<MergedChainData[]> {
    const chains = await this.fetchMergedChains()
    
    // Use environment variable for popular chain IDs or fallback to common ones
    const popularChainIdsEnv = process.env.POPULAR_CHAIN_IDS
    const popularChainIds = popularChainIdsEnv 
      ? popularChainIdsEnv.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [1, 137, 42161, 10, 56, 43114, 250, 100, 1101, 8453]
    
    return chains.filter(chain => popularChainIds.includes(chain.chainId))
  }
}

// Helper function to calculate data completeness
function calculateDataCompleteness(chain: MergedChainData): number {
  let score = 0
      const maxScore = 10

  // Basic required fields (40% weight)
  if (chain.name) score += 1
  if (chain.chainId) score += 1
  if (chain.rpc && chain.rpc.length > 0) score += 2

  // Enhanced data (60% weight)
  if (chain.icon) score += 1
  if (chain.explorers && chain.explorers.length > 0) score += 1
  if (chain.features && chain.features.length > 0) score += 1
  if (chain.rpcHealth) score += 2
  if (chain.bridges && chain.bridges.length > 0) score += 1

  return (score / maxScore) * 100
}

export const chainDataMerger = ChainDataMerger.getInstance()