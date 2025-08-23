import { ChainData } from "@/types/chain"

export const fallbackChains: ChainData[] = [
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
      "https://ethereum-rpc.publicnode.com",
      "https://1rpc.io/eth",
      "https://eth.llamarpc.com",
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
    isTestnet: false,
    rpcEndpoints: [
      {
        url: "https://ethereum-rpc.publicnode.com",
        status: "online",
        tracking: "none"
      },
      {
        url: "https://1rpc.io/eth",
        status: "online",
        tracking: "none"
      }
    ],
    chain: "ETH",
    tags: ["mainnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 137,
    name: "Polygon Mainnet",
    shortName: "matic",
    network: "matic",
    networkId: 137,
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpc: [
      "https://polygon-rpc.com",
      "https://1rpc.io/matic",
      "https://polygon-mainnet.public.blastapi.io"
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
    isTestnet: false,
    rpcEndpoints: [
      {
        url: "https://polygon-rpc.com",
        status: "online",
        tracking: "none"
      }
    ],
    chain: "Polygon",
    parent: {
      type: "L2",
      chain: "Ethereum"
    },
    tags: ["mainnet", "verified", "L2", "evm-compatible"]
  },
  {
    chainId: 56,
    name: "BNB Smart Chain Mainnet",
    shortName: "bnb",
    network: "bsc",
    networkId: 56,
    nativeCurrency: {
      name: "BNB Token",
      symbol: "BNB",
      decimals: 18
    },
    rpc: [
      "https://bsc-dataseed.binance.org",
      "https://1rpc.io/bnb",
      "https://bsc-mainnet.public.blastapi.io"
    ],
    faucets: [],
    explorers: [
      {
        name: "BscScan",
        url: "https://bscscan.com",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://www.bnbchain.org",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    verified: true,
    isTestnet: false,
    rpcEndpoints: [
      {
        url: "https://bsc-dataseed.binance.org",
        status: "online",
        tracking: "none"
      }
    ],
    chain: "BSC",
    tags: ["mainnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 10,
    name: "Optimism",
    shortName: "oeth",
    network: "optimism",
    networkId: 10,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: [
      "https://mainnet.optimism.io",
      "https://1rpc.io/op",
      "https://optimism-mainnet.public.blastapi.io"
    ],
    faucets: [],
    explorers: [
      {
        name: "Optimistic Ethereum",
        url: "https://optimistic.etherscan.io",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://optimism.io",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_optimism.jpg",
    verified: true,
    isTestnet: false,
    rpcEndpoints: [
      {
        url: "https://mainnet.optimism.io",
        status: "online",
        tracking: "none"
      }
    ],
    chain: "ETH",
    parent: {
      type: "rollup",
      chain: "Ethereum"
    },
    tags: ["mainnet", "verified", "L2", "rollup", "evm-compatible"]
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
    shortName: "arb1",
    network: "arbitrum",
    networkId: 42161,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: [
      "https://arb1.arbitrum.io/rpc",
      "https://1rpc.io/arb",
      "https://arbitrum-mainnet.public.blastapi.io"
    ],
    faucets: [],
    explorers: [
      {
        name: "Arbitrum Explorer",
        url: "https://arbiscan.io",
        standard: "EIP3091"
      }
    ],
    infoURL: "https://arbitrum.io",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
    verified: true,
    isTestnet: false,
    rpcEndpoints: [
      {
        url: "https://arb1.arbitrum.io/rpc",
        status: "online",
        tracking: "none"
      }
    ],
    chain: "ETH",
    parent: {
      type: "rollup",
      chain: "Ethereum"
    },
    tags: ["mainnet", "verified", "L2", "rollup", "evm-compatible"]
  }
]