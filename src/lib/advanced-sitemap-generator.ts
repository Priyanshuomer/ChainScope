// Advanced dynamic sitemap generator for ChainScope
// Generates comprehensive sitemaps for all blockchain networks with SEO optimization

import type { MergedChainData } from '../types/chain'

export interface SitemapEntry {
  url: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  images?: Array<{
    loc: string
    title?: string
    caption?: string
  }>
  alternateLanguages?: Array<{
    lang: string
    href: string
  }>
}

export interface SitemapIndex {
  loc: string
  lastmod: string
}

class AdvancedSitemapGenerator {
  private baseUrl: string
  private maxUrlsPerSitemap: number

  constructor(baseUrl: string = 'https://chainscope.app', maxUrlsPerSitemap: number = 50000) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.maxUrlsPerSitemap = maxUrlsPerSitemap
  }

  /**
   * Generate main sitemap index that references all sub-sitemaps
   */
  public generateSitemapIndex(chains: MergedChainData[]): string {
    const now = new Date().toISOString()
    const sitemaps: SitemapIndex[] = []

    // Main static sitemap
    sitemaps.push({
      loc: `${this.baseUrl}/sitemap-static.xml`,
      lastmod: now
    })

    // Calculate number of chain sitemaps needed
    const chainSitemapCount = Math.ceil(chains.length / this.maxUrlsPerSitemap)
    
    for (let i = 0; i < chainSitemapCount; i++) {
      sitemaps.push({
        loc: `${this.baseUrl}/sitemap-chains-${i + 1}.xml`,
        lastmod: now
      })
    }

    // Popular chains sitemap
    sitemaps.push({
      loc: `${this.baseUrl}/sitemap-popular.xml`,
      lastmod: now
    })

    // Category sitemaps
    const categories = ['layer1', 'layer2', 'testnet', 'mainnet', 'evm', 'verified']
    categories.forEach(category => {
      sitemaps.push({
        loc: `${this.baseUrl}/sitemap-${category}.xml`,
        lastmod: now
      })
    })

    return this.generateSitemapIndexXML(sitemaps)
  }

  /**
   * Generate static pages sitemap
   */
  public generateStaticSitemap(): string {
    const now = new Date().toISOString()
    
    // Use environment variable for network count or fallback to dynamic text
    const networkCount = import.meta.env.NETWORK_COUNT || '2000+'
    
    const entries: SitemapEntry[] = [
      {
        url: this.baseUrl,
        lastmod: now,
        changefreq: 'hourly',
        priority: 1.0,
        images: [{
          loc: `${this.baseUrl}/og-image.png`,
          title: 'ChainScope - Blockchain Network Explorer',
          caption: `Discover and connect to ${networkCount} blockchain networks with real-time RPC monitoring`
        }]
      },
      {
        url: `${this.baseUrl}/compare`,
        lastmod: now,
        changefreq: 'daily',
        priority: 0.9
      },
      {
        url: `${this.baseUrl}/trending`,
        lastmod: now,
        changefreq: 'hourly',
        priority: 0.8
      },
      {
        url: `${this.baseUrl}/analytics`,
        lastmod: now,
        changefreq: 'hourly',
        priority: 0.8
      },
      // Legal pages
      {
        url: `${this.baseUrl}/privacy`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: `${this.baseUrl}/terms`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: `${this.baseUrl}/cookies`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: `${this.baseUrl}/disclaimer`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.3
      }
    ]

    return this.generateSitemapXML(entries)
  }

  /**
   * Generate popular chains sitemap with high priority
   */
  public generatePopularChainsSitemap(chains: MergedChainData[]): string {
    // Use environment variable for popular chain IDs or fallback to common ones
    const popularChainIdsEnv = import.meta.env.POPULAR_CHAIN_IDS
    const popularChainIds = popularChainIdsEnv 
      ? popularChainIdsEnv.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [1, 137, 42161, 10, 56, 43114, 8453, 59144, 100, 250, 324, 1101, 42220]
    
    const popularChains = chains.filter(chain => popularChainIds.includes(chain.chainId))
    
    const entries: SitemapEntry[] = popularChains.map(chain => ({
      url: `${this.baseUrl}/chain/${chain.chainId}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: this.getChainPriority(chain),
      images: chain.icon ? [{
        loc: chain.icon.startsWith('http') ? chain.icon : `${this.baseUrl}${chain.icon}`,
        title: `${chain.name} - Chain ID ${chain.chainId}`,
        caption: `${chain.name} blockchain network information, RPC endpoints, and network statistics`
      }] : undefined
    }))

    return this.generateSitemapXML(entries)
  }

  /**
   * Generate category-specific sitemaps
   */
  public generateCategorySitemap(chains: MergedChainData[], category: string): string {
    let filteredChains: MergedChainData[] = []

    switch (category) {
      case 'layer1':
        filteredChains = chains.filter(chain => !chain.parent)
        break
      case 'layer2':
        filteredChains = chains.filter(chain => chain.parent)
        break
      case 'testnet':
        filteredChains = chains.filter(chain => chain.isTestnet)
        break
      case 'mainnet':
        filteredChains = chains.filter(chain => !chain.isTestnet)
        break
      case 'evm':
        filteredChains = chains.filter(chain => 
          chain.features?.some(f => f.name === 'EIP-155') || 
          chain.rpc?.some(rpc => rpc.includes('eth_'))
        )
        break
      case 'verified':
        filteredChains = chains.filter(chain => chain.verified)
        break
      default:
        filteredChains = chains
    }

    const entries: SitemapEntry[] = filteredChains
      .slice(0, this.maxUrlsPerSitemap)
      .map(chain => ({
        url: `${this.baseUrl}/chain/${chain.chainId}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: this.getChainPriority(chain)
      }))

    return this.generateSitemapXML(entries)
  }

  /**
   * Generate paginated chain sitemaps
   */
  public generateChainSitemap(chains: MergedChainData[], page: number = 1): string {
    const start = (page - 1) * this.maxUrlsPerSitemap
    const end = start + this.maxUrlsPerSitemap
    const pageChains = chains.slice(start, end)

    const entries: SitemapEntry[] = pageChains.map(chain => ({
      url: `${this.baseUrl}/chain/${chain.chainId}`,
      lastmod: new Date().toISOString(),
      changefreq: this.getChangeFrequency(chain),
      priority: this.getChainPriority(chain),
      images: chain.icon ? [{
        loc: chain.icon.startsWith('http') ? chain.icon : `${this.baseUrl}${chain.icon}`,
        title: `${chain.name} - Chain ID ${chain.chainId}`,
        caption: `${chain.name} blockchain network information, RPC endpoints, and network statistics`
      }] : undefined
    }))

    return this.generateSitemapXML(entries)
  }

  /**
   * Generate RSS feed for recent updates
   */
public generateRSSFeed(chains: MergedChainData[]): string {
  const recentChains = chains
    .sort((a, b) => ((b.lastUpdated?.getTime() ?? 0) - (a.lastUpdated?.getTime() ?? 0)))
    .slice(0, 50);

  const items = recentChains.map(chain => `
    <item>
      <title>${this.escapeXml(chain.name)} (Chain ID: ${chain.chainId})</title>
      <link>${this.baseUrl}/chain/${chain.chainId}</link>
      <guid>${this.baseUrl}/chain/${chain.chainId}</guid>
      <pubDate>${new Date(chain.lastUpdated || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[
        Latest information about ${this.escapeXml(chain.name)} blockchain network including RPC endpoints and network statistics.
        ${chain.isTestnet ? 'Testnet' : 'Mainnet'} network with ${chain.rpc?.length || 0} RPC endpoints available.
        ${chain.verified ? 'Verified network.' : ''}
      ]]></description>
      <category>Blockchain</category>
      ${chain.parent ? `<category>Layer 2</category>` : '<category>Layer 1</category>'}
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>ChainScope - Latest Blockchain Networks</title>
    <link>${this.baseUrl}</link>
    <description>Latest blockchain networks and RPC endpoint updates from ChainScope</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${this.baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${this.baseUrl}/logo.png</url>
      <title>ChainScope</title>
      <link>${this.baseUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}


  /**
   * Generate News XML sitemap for recent updates (Google News)
   */
public generateNewsSitemap(chains: MergedChainData[]): string {
  const recentChains = chains
    .filter(chain => chain.lastUpdated && chain.lastUpdated.getTime() > Date.now() - (48 * 60 * 60 * 1000)) // Last 48 hours
    .slice(0, 1000); // Google News limit

  const entries = recentChains.map(chain => `
  <url>
    <loc>${this.baseUrl}/chain/${chain.chainId}</loc>
    <news:news>
      <news:publication>
        <news:name>ChainScope</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(chain.lastUpdated!).toISOString()}</news:publication_date>
      <news:title>${this.escapeXml(chain.name)} Network Update</news:title>
      <news:keywords>blockchain, ${chain.name.toLowerCase()}, cryptocurrency, web3</news:keywords>
    </news:news>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${entries}
</urlset>`;
}


  private getChainPriority(chain: MergedChainData): number {
    // High priority chains
    const highPriorityChains = [1, 137, 42161, 10, 8453] // Ethereum, Polygon, Arbitrum, Optimism, Base
    if (highPriorityChains.includes(chain.chainId)) return 0.95

    // Medium-high priority
    const mediumHighChains = [56, 43114, 59144, 100, 250] // BSC, Avalanche, Linea, Gnosis, Fantom
    if (mediumHighChains.includes(chain.chainId)) return 0.85

    // Verified networks get higher priority
    if (chain.verified) return 0.7

    // Layer 2 networks
    if (chain.parent) return 0.6

    // Mainnet networks
    if (!chain.isTestnet) return 0.5

    // Testnet networks
    return 0.3
  }

  private getChangeFrequency(chain: MergedChainData): SitemapEntry['changefreq'] {
    // High activity chains update more frequently
    const highActivityChains = [1, 137, 42161, 10, 56, 43114, 8453]
    if (highActivityChains.includes(chain.chainId)) return 'daily'

    // Verified networks update weekly
    if (chain.verified) return 'weekly'

    // Other networks update monthly
    return 'monthly'
  }

  private generateSitemapXML(entries: SitemapEntry[]): string {
    const urls = entries.map(entry => {
      const images = entry.images?.map(img => `
    <image:image>
      <image:loc>${this.escapeXml(img.loc)}</image:loc>
      ${img.title ? `<image:title>${this.escapeXml(img.title)}</image:title>` : ''}
      ${img.caption ? `<image:caption>${this.escapeXml(img.caption)}</image:caption>` : ''}
    </image:image>`).join('') || ''

      return `
  <url>
    <loc>${this.escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    <mobile:mobile/>${images}
  </url>`
    }).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${urls}
</urlset>`
  }

  private generateSitemapIndexXML(sitemaps: SitemapIndex[]): string {
    const sitemapEntries = sitemaps.map(sitemap => `
  <sitemap>
    <loc>${this.escapeXml(sitemap.loc)}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries}
</sitemapindex>`
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}

export const advancedSitemapGenerator = new AdvancedSitemapGenerator()
export default AdvancedSitemapGenerator