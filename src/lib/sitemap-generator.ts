// src/lib/sitemap-generator.ts

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  images?: { loc: string; title?: string }[];
}

export interface ChainSitemapData {
  chainId: number;
  name: string;
  lastUpdated: string;
}

export class SitemapGenerator {
  public baseUrl: string;
  private staticPages: SitemapUrl[];

  constructor(baseUrl: string = "https://chainscope.dev") {
    this.baseUrl = baseUrl;
    this.staticPages = [
      {
        url: `${baseUrl}/`,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
        images: [{ loc: `${baseUrl}/logo.png`, title: "ChainScope Logo" }]
      },
      {
        url: `${baseUrl}/analytics`,
        changefreq: "hourly",
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        url: `${baseUrl}/search`,
        changefreq: "daily",
        priority: 0.7,
        lastmod: new Date().toISOString()
      }
    ];
  }

  // ✅ Generate static sitemap
  generateStaticSitemap(): string {
    const urls = this.staticPages.map(page => this.generateUrlElement(page)).join("\n");
    return this.wrapInUrlSet(urls);
  }

  // ✅ Generate dynamic chain sitemap
  generateChainSitemap(chains: ChainSitemapData[]): string {
    const urls = chains
      .map(chain => ({
        url: `${this.baseUrl}/chain/${chain.chainId}`,
        changefreq: "weekly" as const,
        priority: 0.6,
        lastmod: chain.lastUpdated,
        images: [{ loc: `${this.baseUrl}/images/chains/${chain.chainId}.png`, title: chain.name }]
      }))
      .map(page => this.generateUrlElement(page))
      .join("\n");

    return this.wrapInUrlSet(urls);
  }

  // ✅ Generate Sitemap Index
  generateSitemapIndex(sitemaps: { url: string; lastmod?: string }[]): string {
    const sitemapElements = sitemaps
      .map(
        sm => `
  <sitemap>
    <loc>${sm.url}</loc>
    ${sm.lastmod ? `<lastmod>${sm.lastmod}</lastmod>` : ""}
  </sitemap>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
  }

  // ✅ Generate RSS Feed for Chains
  generateRSSFeed(chains: ChainSitemapData[]): string {
    const items = chains
      .slice(0, 50)
      .map(
        chain => `
  <item>
    <title>${chain.name} (Chain ID: ${chain.chainId})</title>
    <link>${this.baseUrl}/chain/${chain.chainId}</link>
    <guid>${this.baseUrl}/chain/${chain.chainId}</guid>
    <pubDate>${new Date(chain.lastUpdated).toUTCString()}</pubDate>
    <description>Latest info about ${chain.name} including RPC endpoints, stats, and more.</description>
  </item>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ChainScope - Latest Blockchain Updates</title>
    <link>${this.baseUrl}</link>
    <description>Blockchain network updates, RPC endpoints & stats</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${this.baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
  }

  // ✅ Helper to create a URL entry
  private generateUrlElement(page: SitemapUrl): string {
    const imagesXml = page.images
      ? page.images
          .map(img => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      ${img.title ? `<image:title>${img.title}</image:title>` : ""}
    </image:image>`)
          .join("\n")
      : "";

    return `
  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ""}
    ${page.priority ? `<priority>${page.priority}</priority>` : ""}
    ${imagesXml}
  </url>`;
  }

  // ✅ Wrap content in urlset with namespaces for images and styling
  private wrapInUrlSet(content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${content}
</urlset>`;
  }
}

export const sitemapGenerator = new SitemapGenerator();
