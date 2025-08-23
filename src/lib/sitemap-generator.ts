// Sitemap generator for ChainScope
// Generates dynamic sitemap for chain pages and static pages

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface ChainSitemapData {
  chainId: number;
  name: string;
  lastUpdated: string;
}

export class SitemapGenerator {
  private baseUrl: string;
  private staticPages: SitemapUrl[];

  constructor(baseUrl: string = 'https://chainscope.dev') {
    this.baseUrl = baseUrl;
    this.staticPages = [
      {
        url: `${baseUrl}/`,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString()
      },
      {
        url: `${baseUrl}/analytics`,
        changefreq: 'hourly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        url: `${baseUrl}/search`,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate sitemap XML for static pages
   */
  generateStaticSitemap(): string {
    const urls = this.staticPages.map(page => this.generateUrlElement(page)).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  /**
   * Generate sitemap XML for chain pages
   */
  generateChainSitemap(chains: ChainSitemapData[]): string {
    const urls = chains.map(chain => ({
      url: `${this.baseUrl}/chain/${chain.chainId}`,
      changefreq: 'weekly' as const,
      priority: 0.6,
      lastmod: chain.lastUpdated
    })).map(page => this.generateUrlElement(page)).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  /**
   * Generate sitemap index for multiple sitemaps
   */
  generateSitemapIndex(sitemaps: { url: string; lastmod?: string }[]): string {
    const sitemapElements = sitemaps.map(sitemap => `
  <sitemap>
    <loc>${sitemap.url}</loc>
    ${sitemap.lastmod ? `<lastmod>${sitemap.lastmod}</lastmod>` : ''}
  </sitemap>`).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
  }

  /**
   * Generate URL element for sitemap
   */
  private generateUrlElement(page: SitemapUrl): string {
    return `
  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`;
  }

  /**
   * Generate RSS feed for recent chain updates
   */
  generateRSSFeed(chains: ChainSitemapData[]): string {
    const items = chains.slice(0, 50).map(chain => `
  <item>
    <title>${chain.name} (Chain ID: ${chain.chainId})</title>
    <link>${this.baseUrl}/chain/${chain.chainId}</link>
    <guid>${this.baseUrl}/chain/${chain.chainId}</guid>
    <pubDate>${new Date(chain.lastUpdated).toUTCString()}</pubDate>
    <description>Latest information about ${chain.name} blockchain network including RPC endpoints and network statistics.</description>
  </item>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ChainScope - Latest Blockchain Networks</title>
    <link>${this.baseUrl}</link>
    <description>Latest blockchain networks and RPC endpoint updates from ChainScope</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${this.baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
  }
}

// Export singleton instance
export const sitemapGenerator = new SitemapGenerator(); 