/**
 * Comprehensive URL mapping system for ChainScope
 * Implements semantic URLs based on SEO best practices
 * 
 * Benefits:
 * - Better SEO with keyword-rich URLs
 * - Improved user experience with readable URLs
 * - Enhanced social media sharing
 * - Better search engine understanding
 */

export interface NetworkSlugMapping {
  slug: string
  chainId: number
  name: string
  category: 'mainnet' | 'layer2' | 'testnet' | 'sidechain' | 'rollup'
  priority: number // Higher priority = more important for SEO
}

/**
 * Primary semantic URL mappings for top blockchain networks
 * Following SEO best practices:
 * - Keywords in URLs
 * - Human-readable
 * - Hyphens for separation
 * - Lowercase only
 * - Short but descriptive
 */
export const NETWORK_SLUG_MAPPINGS: NetworkSlugMapping[] = [
  // Tier 1 - Major L1 Networks (Highest SEO Priority)
  { slug: 'ethereum', chainId: 1, name: 'Ethereum Mainnet', category: 'mainnet', priority: 100 },
  { slug: 'bitcoin', chainId: 0, name: 'Bitcoin', category: 'mainnet', priority: 95 }, // Special case
  { slug: 'binance-smart-chain', chainId: 56, name: 'BNB Smart Chain', category: 'mainnet', priority: 90 },
  { slug: 'avalanche', chainId: 43114, name: 'Avalanche C-Chain', category: 'mainnet', priority: 85 },
  { slug: 'solana', chainId: 101, name: 'Solana', category: 'mainnet', priority: 80 },
  
  // Tier 2 - Major L2 Networks (High SEO Priority)
  { slug: 'polygon', chainId: 137, name: 'Polygon Mainnet', category: 'layer2', priority: 95 },
  { slug: 'arbitrum-one', chainId: 42161, name: 'Arbitrum One', category: 'layer2', priority: 90 },
  { slug: 'optimism', chainId: 10, name: 'Optimism', category: 'layer2', priority: 90 },
  { slug: 'base', chainId: 8453, name: 'Base', category: 'layer2', priority: 85 },
  { slug: 'polygon-zkevm', chainId: 1101, name: 'Polygon zkEVM', category: 'layer2', priority: 80 },
  { slug: 'linea', chainId: 59144, name: 'Linea', category: 'layer2', priority: 75 },
  { slug: 'scroll', chainId: 534352, name: 'Scroll', category: 'layer2', priority: 70 },
  { slug: 'zksync-era', chainId: 324, name: 'zkSync Era', category: 'layer2', priority: 75 },
  
  // Tier 3 - Popular Alternative Networks (Medium SEO Priority)
  { slug: 'fantom', chainId: 250, name: 'Fantom Opera', category: 'mainnet', priority: 70 },
  { slug: 'gnosis', chainId: 100, name: 'Gnosis Chain', category: 'sidechain', priority: 65 },
  { slug: 'celo', chainId: 42220, name: 'Celo', category: 'mainnet', priority: 60 },
  { slug: 'moonbeam', chainId: 1284, name: 'Moonbeam', category: 'mainnet', priority: 60 },
  { slug: 'cronos', chainId: 25, name: 'Cronos', category: 'mainnet', priority: 55 },
  { slug: 'aurora', chainId: 1313161554, name: 'Aurora', category: 'mainnet', priority: 55 },
  { slug: 'harmony-one', chainId: 1666600000, name: 'Harmony One', category: 'mainnet', priority: 50 },
  
  // Tier 4 - Testnets (Lower SEO Priority but important for developers)
  { slug: 'ethereum-sepolia', chainId: 11155111, name: 'Sepolia Testnet', category: 'testnet', priority: 30 },
  { slug: 'ethereum-goerli', chainId: 5, name: 'Goerli Testnet', category: 'testnet', priority: 25 },
  { slug: 'polygon-mumbai', chainId: 80001, name: 'Polygon Mumbai', category: 'testnet', priority: 30 },
  { slug: 'arbitrum-goerli', chainId: 421613, name: 'Arbitrum Goerli', category: 'testnet', priority: 25 },
  { slug: 'optimism-goerli', chainId: 420, name: 'Optimism Goerli', category: 'testnet', priority: 25 },
  { slug: 'base-goerli', chainId: 84531, name: 'Base Goerli', category: 'testnet', priority: 25 },
  
  // Additional high-traffic networks
  { slug: 'bsc-testnet', chainId: 97, name: 'BNB Smart Chain Testnet', category: 'testnet', priority: 25 },
  { slug: 'avalanche-fuji', chainId: 43113, name: 'Avalanche Fuji', category: 'testnet', priority: 25 },
  { slug: 'fantom-testnet', chainId: 4002, name: 'Fantom Testnet', category: 'testnet', priority: 20 },
]

/**
 * Create reverse mapping for quick lookups
 */
export const CHAIN_ID_TO_SLUG: Record<number, string> = {}
export const SLUG_TO_CHAIN_ID: Record<string, number> = {}
export const SLUG_TO_MAPPING: Record<string, NetworkSlugMapping> = {}

// Initialize mappings
NETWORK_SLUG_MAPPINGS.forEach(mapping => {
  CHAIN_ID_TO_SLUG[mapping.chainId] = mapping.slug
  SLUG_TO_CHAIN_ID[mapping.slug] = mapping.chainId
  SLUG_TO_MAPPING[mapping.slug] = mapping
})

/**
 * Generate semantic URL for a chain
 */
export function getSemanticUrl(chainId: number): string {
  const slug = CHAIN_ID_TO_SLUG[chainId]
  if (slug) {
    return `/network/${slug}`
  }
  // Fallback to chain ID for unmapped networks
  return `/chain/${chainId}`
}

/**
 * Get chain ID from semantic URL slug
 */
export function getChainIdFromSlug(slug: string): number | null {
  return SLUG_TO_CHAIN_ID[slug] || null
}

/**
 * Check if a chain has semantic URL mapping
 */
export function hasSemanticMapping(chainId: number): boolean {
  return chainId in CHAIN_ID_TO_SLUG
}

/**
 * Get all semantic URLs sorted by SEO priority
 */
export function getAllSemanticUrls(): Array<{ url: string; mapping: NetworkSlugMapping }> {
  return NETWORK_SLUG_MAPPINGS
    .sort((a, b) => b.priority - a.priority)
    .map(mapping => ({
      url: `/network/${mapping.slug}`,
      mapping
    }))
}

/**
 * Get semantic URLs by category for sitemap generation
 */
export function getSemanticUrlsByCategory(category: NetworkSlugMapping['category']): string[] {
  return NETWORK_SLUG_MAPPINGS
    .filter(mapping => mapping.category === category)
    .sort((a, b) => b.priority - a.priority)
    .map(mapping => `/network/${mapping.slug}`)
}

/**
 * Generate canonical URL with proper domain
 */
export function getCanonicalUrl(slug: string, domain = 'https://chainscope.app'): string {
  return `${domain}/network/${slug}`
}

/**
 * Generate breadcrumb structure for semantic URLs
 */
export function getBreadcrumbs(slug: string): Array<{ name: string; url: string }> {
  const mapping = SLUG_TO_MAPPING[slug]
  if (!mapping) return []

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Networks', url: '/networks' },
  ]

  // Add category-specific breadcrumb
  switch (mapping.category) {
    case 'mainnet':
      breadcrumbs.push({ name: 'Layer 1 Networks', url: '/layer1-networks' })
      break
    case 'layer2':
      breadcrumbs.push({ name: 'Layer 2 Networks', url: '/layer2-networks' })
      break
    case 'testnet':
      breadcrumbs.push({ name: 'Testnets', url: '/testnets' })
      break
    case 'sidechain':
      breadcrumbs.push({ name: 'Sidechains', url: '/sidechains' })
      break
    case 'rollup':
      breadcrumbs.push({ name: 'Rollups', url: '/rollups' })
      break
  }

  // Add current page
  breadcrumbs.push({ name: mapping.name, url: `/network/${slug}` })

  return breadcrumbs
}

/**
 * Generate URL-friendly slug from chain name
 * For dynamic chain names not in the mapping
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate semantic URL slug
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2 && slug.length <= 50
}

/**
 * Get SEO-optimized meta data for network page
 */
export function getNetworkSEOData(slug: string) {
  const mapping = SLUG_TO_MAPPING[slug]
  if (!mapping) return null

  const categoryDescriptions = {
    mainnet: 'Layer 1 blockchain network',
    layer2: 'Layer 2 scaling solution',
    testnet: 'Testnet for development',
    sidechain: 'Sidechain network',
    rollup: 'Rollup scaling solution'
  }

  return {
    title: `${mapping.name} - Blockchain Network Information | ChainScope`,
    description: `Complete ${mapping.name} network information including RPC endpoints, explorer links, network statistics, and wallet configuration. ${categoryDescriptions[mapping.category]} trusted by developers worldwide.`,
    keywords: [
      mapping.name.toLowerCase(),
      mapping.slug,
      'blockchain',
      'network',
      'rpc',
      'endpoints',
      mapping.category,
      'cryptocurrency',
      'web3',
      'defi',
      'smart contracts'
    ].join(', '),
    canonical: getCanonicalUrl(mapping.slug),
    category: mapping.category,
    priority: mapping.priority
  }
}