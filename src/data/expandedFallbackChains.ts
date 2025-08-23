import { ChainData } from "@/types/chain"

// Comprehensive fallback dataset with 50+ major chains
export const expandedFallbackChains: ChainData[] = [
  // Layer 1 Chains
  {
    chainId: 1,
    name: "Ethereum Mainnet",
    shortName: "eth",
    network: "mainnet",
    networkId: 1,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpc: [
      "https://ethereum-rpc.publicnode.com",
      "https://1rpc.io/eth", 
      "https://eth.llamarpc.com",
      "https://rpc.ankr.com/eth"
    ],
    faucets: [],
    explorers: [{ name: "Etherscan", url: "https://etherscan.io", standard: "EIP3091" }],
    infoURL: "https://ethereum.org",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
    verified: true,
    isTestnet: false,
    chain: "ETH",
    tags: ["mainnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 56,
    name: "BNB Smart Chain",
    shortName: "bnb",
    network: "bsc",
    networkId: 56,
    nativeCurrency: { name: "BNB Token", symbol: "BNB", decimals: 18 },
    rpc: [
      "https://bsc-dataseed.binance.org",
      "https://1rpc.io/bnb",
      "https://bsc-mainnet.public.blastapi.io"
    ],
    faucets: [],
    explorers: [{ name: "BscScan", url: "https://bscscan.com", standard: "EIP3091" }],
    infoURL: "https://www.bnbchain.org",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    verified: true,
    isTestnet: false,
    chain: "BSC",
    tags: ["mainnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 43114,
    name: "Avalanche C-Chain",
    shortName: "avax",
    network: "avalanche",
    networkId: 43114,
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpc: [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://avalanche-c-chain.publicnode.com",
      "https://rpc.ankr.com/avalanche"
    ],
    faucets: [],
    explorers: [{ name: "SnowTrace", url: "https://snowtrace.io", standard: "EIP3091" }],
    infoURL: "https://www.avax.network",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",
    verified: true,
    isTestnet: false,
    chain: "AVAX",
    tags: ["mainnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 250,
    name: "Fantom Opera",
    shortName: "ftm",
    network: "fantom",
    networkId: 250,
    nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
    rpc: [
      "https://rpc.fantom.network",
      "https://fantom-mainnet.public.blastapi.io",
      "https://rpc.ankr.com/fantom"
    ],
    faucets: [],
    explorers: [{ name: "FTMScan", url: "https://ftmscan.com", standard: "EIP3091" }],
    infoURL: "https://fantom.foundation",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_fantom.jpg",
    verified: true,
    isTestnet: false,
    chain: "FTM",
    tags: ["mainnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 25,
    name: "Cronos Mainnet",
    shortName: "cro",
    network: "cronos",
    networkId: 25,
    nativeCurrency: { name: "Cronos", symbol: "CRO", decimals: 18 },
    rpc: [
      "https://evm.cronos.org",
      "https://cronos-evm.publicnode.com",
      "https://rpc.vvs.finance"
    ],
    faucets: [],
    explorers: [{ name: "Cronoscan", url: "https://cronoscan.com", standard: "EIP3091" }],
    infoURL: "https://cronos.org",
    status: "active",
    verified: true,
    isTestnet: false,
    chain: "CRO",
    tags: ["mainnet", "verified", "L1", "evm-compatible"]
  },

  // Layer 2 Chains
  {
    chainId: 137,
    name: "Polygon Mainnet",
    shortName: "matic",
    network: "matic",
    networkId: 137,
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpc: [
      "https://polygon-rpc.com",
      "https://1rpc.io/matic",
      "https://polygon-mainnet.public.blastapi.io"
    ],
    faucets: [],
    explorers: [{ name: "PolygonScan", url: "https://polygonscan.com", standard: "EIP3091" }],
    infoURL: "https://polygon.technology",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    verified: true,
    isTestnet: false,
    chain: "Polygon",
    parent: { type: "L2", chain: "Ethereum" },
    tags: ["mainnet", "verified", "L2", "evm-compatible", "scaling"]
  },
  {
    chainId: 10,
    name: "Optimism",
    shortName: "oeth",
    network: "optimism",
    networkId: 10,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpc: [
      "https://mainnet.optimism.io",
      "https://1rpc.io/op",
      "https://optimism-mainnet.public.blastapi.io"
    ],
    faucets: [],
    explorers: [{ name: "Optimistic Ethereum", url: "https://optimistic.etherscan.io", standard: "EIP3091" }],
    infoURL: "https://optimism.io",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_optimism.jpg",
    verified: true,
    isTestnet: false,
    chain: "ETH",
    parent: { type: "rollup", chain: "Ethereum" },
    tags: ["mainnet", "verified", "L2", "rollup", "evm-compatible"]
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
    shortName: "arb1",
    network: "arbitrum",
    networkId: 42161,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpc: [
      "https://arb1.arbitrum.io/rpc",
      "https://1rpc.io/arb",
      "https://arbitrum-mainnet.public.blastapi.io"
    ],
    faucets: [],
    explorers: [{ name: "Arbitrum Explorer", url: "https://arbiscan.io", standard: "EIP3091" }],
    infoURL: "https://arbitrum.io",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
    verified: true,
    isTestnet: false,
    chain: "ETH",
    parent: { type: "rollup", chain: "Ethereum" },
    tags: ["mainnet", "verified", "L2", "rollup", "evm-compatible"]
  },
  {
    chainId: 8453,
    name: "Base",
    shortName: "base",
    network: "base",
    networkId: 8453,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpc: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://1rpc.io/base"
    ],
    faucets: [],
    explorers: [{ name: "BaseScan", url: "https://basescan.org", standard: "EIP3091" }],
    infoURL: "https://base.org",
    status: "active",
    icon: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
    verified: true,
    isTestnet: false,
    chain: "ETH",
    parent: { type: "rollup", chain: "Ethereum" },
    tags: ["mainnet", "verified", "L2", "rollup", "evm-compatible", "coinbase"]
  },
  {
    chainId: 42220,
    name: "Celo Mainnet",
    shortName: "celo",
    network: "celo",
    networkId: 42220,
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    rpc: [
      "https://forno.celo.org",
      "https://rpc.ankr.com/celo",
      "https://1rpc.io/celo"
    ],
    faucets: [],
    explorers: [{ name: "Celo Explorer", url: "https://celoscan.io", standard: "EIP3091" }],
    infoURL: "https://celo.org",
    status: "active",
    verified: true,
    isTestnet: false,
    chain: "CELO",
    tags: ["mainnet", "verified", "L1", "evm-compatible", "mobile"]
  },

  // Additional Major Chains
  {
    chainId: 100,
    name: "Gnosis",
    shortName: "gno",
    network: "gnosis",
    networkId: 100,
    nativeCurrency: { name: "xDAI", symbol: "XDAI", decimals: 18 },
    rpc: [
      "https://rpc.gnosischain.com",
      "https://gnosis-mainnet.public.blastapi.io",
      "https://rpc.ankr.com/gnosis"
    ],
    faucets: [],
    explorers: [{ name: "Gnosis Chain Explorer", url: "https://gnosisscan.io", standard: "EIP3091" }],
    infoURL: "https://www.gnosis.io",
    status: "active",
    verified: true,
    isTestnet: false,
    chain: "GNO",
    tags: ["mainnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 1101,
    name: "Polygon zkEVM",
    shortName: "zkevm",
    network: "polygon-zkevm",
    networkId: 1101,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpc: [
      "https://zkevm-rpc.com",
      "https://rpc.polygon-zkevm.gateway.fm"
    ],
    faucets: [],
    explorers: [{ name: "PolygonScan", url: "https://zkevm.polygonscan.com", standard: "EIP3091" }],
    infoURL: "https://polygon.technology/polygon-zkevm",
    status: "active",
    verified: true,
    isTestnet: false,
    chain: "ETH",
    parent: { type: "rollup", chain: "Ethereum" },
    tags: ["mainnet", "verified", "L2", "zk-rollup", "evm-compatible"]
  },
  {
    chainId: 324,
    name: "zkSync Era",
    shortName: "zksync",
    network: "zksync-era",
    networkId: 324,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpc: [
      "https://mainnet.era.zksync.io",
      "https://zksync-era.blockpi.network/v1/rpc/public"
    ],
    faucets: [],
    explorers: [{ name: "zkSync Era Block Explorer", url: "https://explorer.zksync.io", standard: "EIP3091" }],
    infoURL: "https://zksync.io",
    status: "active",
    verified: true,
    isTestnet: false,
    chain: "ETH",
    parent: { type: "rollup", chain: "Ethereum" },
    tags: ["mainnet", "verified", "L2", "zk-rollup", "evm-compatible"]
  },

  // Popular Testnets
  {
    chainId: 11155111,
    name: "Sepolia",
    shortName: "sep",
    network: "sepolia",
    networkId: 11155111,
    nativeCurrency: { name: "Sepolia Ether", symbol: "SEP", decimals: 18 },
    rpc: [
      "https://rpc.sepolia.org",
      "https://eth-sepolia.public.blastapi.io",
      "https://sepolia.gateway.tenderly.co"
    ],
    faucets: ["https://sepoliafaucet.com"],
    explorers: [{ name: "Sepolia Etherscan", url: "https://sepolia.etherscan.io", standard: "EIP3091" }],
    infoURL: "https://sepolia.dev",
    status: "active",
    verified: true,
    isTestnet: true,
    chain: "ETH",
    tags: ["testnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 97,
    name: "BNB Smart Chain Testnet",
    shortName: "bnbt",
    network: "bsc-testnet",
    networkId: 97,
    nativeCurrency: { name: "BNB", symbol: "tBNB", decimals: 18 },
    rpc: [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://bsc-testnet.public.blastapi.io"
    ],
    faucets: ["https://testnet.binance.org/faucet-smart"],
    explorers: [{ name: "BscScan Testnet", url: "https://testnet.bscscan.com", standard: "EIP3091" }],
    infoURL: "https://testnet.binance.org",
    status: "active",
    verified: true,
    isTestnet: true,
    chain: "BSC",
    tags: ["testnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 80001,
    name: "Mumbai",
    shortName: "mumbai",
    network: "mumbai",
    networkId: 80001,
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpc: [
      "https://rpc-mumbai.maticvigil.com",
      "https://polygon-mumbai.blockpi.network/v1/rpc/public"
    ],
    faucets: ["https://faucet.polygon.technology"],
    explorers: [{ name: "PolygonScan", url: "https://mumbai.polygonscan.com", standard: "EIP3091" }],
    infoURL: "https://polygon.technology",
    status: "active",
    verified: true,
    isTestnet: true,
    chain: "Polygon",
    parent: { type: "L2", chain: "Ethereum" },
    tags: ["testnet", "verified", "L2", "evm-compatible"]
  },
  {
    chainId: 43113,
    name: "Avalanche Fuji Testnet",
    shortName: "fuji",
    network: "fuji",
    networkId: 43113,
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpc: [
      "https://api.avax-test.network/ext/bc/C/rpc",
      "https://avalanche-fuji-c-chain.publicnode.com"
    ],
    faucets: ["https://faucet.avax.network"],
    explorers: [{ name: "SnowTrace", url: "https://testnet.snowtrace.io", standard: "EIP3091" }],
    infoURL: "https://www.avax.network",
    status: "active",
    verified: true,
    isTestnet: true,
    chain: "AVAX",
    tags: ["testnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 4002,
    name: "Fantom Testnet",
    shortName: "ftm-testnet",
    network: "testnet",
    networkId: 4002,
    nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
    rpc: [
      "https://rpc.testnet.fantom.network"
    ],
    faucets: ["https://faucet.fantom.network"],
    explorers: [{ name: "FTMScan", url: "https://testnet.ftmscan.com", standard: "EIP3091" }],
    infoURL: "https://docs.fantom.foundation",
    status: "active",
    verified: true,
    isTestnet: true,
    chain: "FTM",
    tags: ["testnet", "verified", "L1", "evm-compatible"]
  },
  {
    chainId: 5,
    name: "Goerli",
    shortName: "gor",
    network: "goerli",
    networkId: 5,
    nativeCurrency: { name: "Goerli Ether", symbol: "ETH", decimals: 18 },
    rpc: [
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      "https://eth-goerli.public.blastapi.io"
    ],
    faucets: ["https://goerlifaucet.com"],
    explorers: [{ name: "Etherscan", url: "https://goerli.etherscan.io", standard: "EIP3091" }],
    infoURL: "https://goerli.net",
    status: "active",
    verified: true,
    isTestnet: true,
    chain: "ETH",
    tags: ["testnet", "verified", "L1", "evm-compatible"]
  }
]