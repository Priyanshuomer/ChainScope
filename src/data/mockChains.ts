import { ChainData, ChainStats, TrendingChain } from "@/types/chain"

export const mockChains: ChainData[] = [
  {
    chainId: 1,
    name: "Ethereum Mainnet",
    shortName: "eth",
    network: "mainnet",
    networkId: 1,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: [
      "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
      "https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}",
      "https://rpc.ankr.com/eth"
    ],
    faucets: [],
    explorers: [
      {
        name: "Etherscan",
        url: "https://etherscan.io",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://ethereum.org",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
    verified: true,
    isTestnet: false
  },
  {
    chainId: 56,
    name: "BNB Smart Chain Mainnet",
    shortName: "bnb",
    network: "mainnet",
    networkId: 56,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    rpc: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed.binance.org"
    ],
    faucets: [],
    explorers: [
      {
        name: "BscScan",
        url: "https://bscscan.com",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://www.binance.org",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    verified: true,
    isTestnet: false
  },
  {
    chainId: 137,
    name: "Polygon Mainnet",
    shortName: "matic",
    network: "mainnet",
    networkId: 137,
    nativeCurrency: {
      name: "POL",
      symbol: "POL",
      decimals: 18
    },
    rpc: [
      "https://polygon-rpc.com",
      "https://rpc-mainnet.matic.network",
      "https://rpc.ankr.com/polygon"
    ],
    faucets: [],
    explorers: [
      {
        name: "PolygonScan",
        url: "https://polygonscan.com",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://polygon.technology",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    verified: true,
    isTestnet: false
  },
  {
    chainId: 8453,
    name: "Base",
    shortName: "base",
    network: "mainnet",
    networkId: 8453,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://1rpc.io/base"
    ],
    faucets: [],
    explorers: [
      {
        name: "BaseScan",
        url: "https://basescan.org",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://base.org",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
    verified: true,
    isTestnet: false
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
    shortName: "arb1",
    network: "mainnet",
    networkId: 42161,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: [
      "https://arb1.arbitrum.io/rpc",
      "https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}",
      "https://rpc.ankr.com/arbitrum"
    ],
    faucets: [],
    explorers: [
      {
        name: "Arbiscan",
        url: "https://arbiscan.io",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://arbitrum.io",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
    verified: true,
    isTestnet: false
  },
  {
    chainId: 43114,
    name: "Avalanche C-Chain",
    shortName: "avax",
    network: "mainnet", 
    networkId: 43114,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18
    },
    rpc: [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://avalanche-c-chain.publicnode.com",
      "https://rpc.ankr.com/avalanche"
    ],
    faucets: [],
    explorers: [
      {
        name: "SnowTrace",
        url: "https://snowtrace.io",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://www.avax.network",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",
    verified: true,
    isTestnet: false
  },
  {
    chainId: 11155111,
    name: "Sepolia",
    shortName: "sep",
    network: "sepolia",
    networkId: 11155111,
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "SEP",
      decimals: 18
    },
    rpc: [
      "https://sepolia.infura.io/v3/${INFURA_API_KEY}",
      "https://eth-sepolia.public.blastapi.io",
      "https://rpc.sepolia.org"
    ],
    faucets: [
      "https://sepoliafaucet.com",
      "https://www.infura.io/faucet/sepolia"
    ],
    explorers: [
      {
        name: "Sepolia Etherscan",
        url: "https://sepolia.etherscan.io",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://sepolia.dev",
    status: "active",
    verified: true,
    isTestnet: true
  },
  {
    chainId: 97,
    name: "BNB Smart Chain Testnet",
    shortName: "bnbt",
    network: "testnet",
    networkId: 97,
    nativeCurrency: {
      name: "BNB",
      symbol: "tBNB",
      decimals: 18
    },
    rpc: [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545"
    ],
    faucets: [
      "https://testnet.binance.org/faucet-smart"
    ],
    explorers: [
      {
        name: "BscScan Testnet",
        url: "https://testnet.bscscan.com",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://testnet.binance.org",
    status: "active",
    verified: true,
    isTestnet: true
  }
]

export const mockStats: ChainStats = {
  totalChains: 2847,
  mainnetChains: 1243,
  testnetChains: 1604,
  verifiedChains: 856,
  totalRpcs: 8429,
  healthyRpcs: 7834
}

export const mockTrendingChains: TrendingChain[] = [
  {
    chainId: 8453,
    name: "Base",
    symbol: "ETH",
    weeklyGrowth: 45.2,
    monthlyUsers: 234567,
    icon: "https://icons.llamao.fi/icons/chains/rsz_base.jpg"
  },
  {
    chainId: 42161,
    name: "Arbitrum One", 
    symbol: "ETH",
    weeklyGrowth: 23.8,
    monthlyUsers: 567890,
    icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg"
  },
  {
    chainId: 137,
    name: "Polygon",
    symbol: "POL",
    weeklyGrowth: 18.5,
    monthlyUsers: 432109,
    icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg"
  },
  {
    chainId: 43114,
    name: "Avalanche",
    symbol: "AVAX", 
    weeklyGrowth: 12.3,
    monthlyUsers: 198765,
    icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg"
  },
  {
    chainId: 56,
    name: "BNB Chain",
    symbol: "BNB",
    weeklyGrowth: 8.7,
    monthlyUsers: 345678,
    icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg"
  }
]