export interface ChainFeature {
  name: string
  type: 'eip' | 'standard' | 'custom'
  description?: string
  supported: boolean
}

export interface ParentChain {
  type: 'L2' | 'sidechain' | 'rollup'
  chain: string
  bridges?: string[]
}

export interface BridgeInfo {
  name: string
  url: string
  type: 'native' | 'third-party'
  chains?: number[] // Make optional since we're not using accurate counts
  protocols: string[]
}

export interface EthereumListsMetadata {
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
  explorers: Array<{
    name: string
    url: string
    standard: string
    icon?: string
  }>
  infoURL: string
  status?: "active" | "deprecated" | "incubating"
  icon?: string
  logo?: string
  parent?: ParentChain
  features?: ChainFeature[]
  bridges?: BridgeInfo[]
  slip44?: number
  ens?: {
    registry?: string
    resolverAddress?: string
  }
  redFlags?: string[]
  tags?: string[]
}

export interface ChainData {
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
    icon?: string
  }>
  infoURL: string
  status?: "active" | "deprecated" | "incubating"
  icon?: string
  logo?: string
  isTestnet?: boolean
  verified?: boolean
  rpcEndpoints?: RpcEndpoint[]
  // Enhanced Ethereum-lists metadata
  parent?: ParentChain
  features?: ChainFeature[]
  bridges?: BridgeInfo[]
  slip44?: number
  ens?: {
    registry?: string
    resolverAddress?: string
  }
  redFlags?: string[]
  tags?: string[]
  title?: string
  chain?: string
}

export interface MergedChainData extends ChainData {
  dataSource: 'chainlist' | 'ethereum-lists' | 'merged' | 'fallback'
  lastUpdated: Date
  rpcHealth?: {
    averageLatency?: number
    reliabilityScore?: number
    privacyScore?: number
  }
  // Enhanced assessment data
  dataQuality?: {
    score: number
    completeness: number
    accuracy: number
    sources: string[]
  }
  maturity?: {
    score: number
    age: string
    adoption: string
    development: string
  }
  security?: {
    score: number
    consensus: string
    decentralization: string
    audit: string
  }
}

export interface RpcEndpoint {
  url: string
  status: "online" | "offline" | "slow"
  latency?: number
  reliability?: number
  lastChecked?: Date
  tracking?: 'yes' | 'no' | 'limited' | 'none'
  isOpenSource?: boolean
  score?: number
  isValid?: boolean
  privacy?: 'high' | 'medium' | 'low'
  disableEstimateGas?: boolean
  chunkSize?: number
  callDataLimit?: number
  weight?: number
}

export interface ChainStats {
  totalChains: number
  mainnetChains: number
  testnetChains: number
  verifiedChains: number
  totalRpcs: number
  healthyRpcs: number
  // Enhanced stats for merged data
  l1Chains?: number
  l2Chains?: number
  evmCompatible?: number
  averageLatency?: number
  privacyFriendly?: number
  bridgeSupported?: number
  dataQualityHigh?: number
}

export interface TrendingChain {
  chainId: number
  name: string
  symbol: string
  weeklyGrowth: number
  monthlyUsers: number
  icon?: string
}