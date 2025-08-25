// src/scripts/generate-sitemap.ts
import path from "path";
import { mkdir } from "node:fs/promises";
import { sitemapGenerator, ChainSitemapData } from "../lib/sitemap-generator";

async function generateAndSaveSitemap() {
  console.log("🚀 Starting sitemap generation...");

  // Example dynamic chain data (replace with API fetch)
  const chains: ChainSitemapData[] = [
    { chainId: 1, name: "Ethereum", lastUpdated: "2025-08-20T12:00:00Z" },
    { chainId: 2, name: "Bitcoin", lastUpdated: "2025-08-22T16:00:00Z" },
    { chainId: 137, name: "Polygon", lastUpdated: "2025-08-24T18:30:00Z" }
  ];

  try {
    const publicDir = path.resolve("./public");
    await mkdir(publicDir, { recursive: true });
    console.log(`✅ Ensured output directory exists: ${publicDir}`);

    // 1️⃣ Generate static sitemap
    const staticSitemap = sitemapGenerator.generateStaticSitemap();
    const staticFile = path.join(publicDir, "sitemap-static.xml");
    await Bun.write(staticFile, staticSitemap);
    console.log(`📄 Static sitemap saved: ${staticFile}`);

    // 2️⃣ Generate chain sitemap
    const chainSitemap = sitemapGenerator.generateChainSitemap(chains);
    const chainFile = path.join(publicDir, "sitemap-chains.xml");
    await Bun.write(chainFile, chainSitemap);
    console.log(`📄 Chain sitemap saved: ${chainFile}`);

    // 3️⃣ Generate RSS feed
    const rssFeed = sitemapGenerator.generateRSSFeed(chains);
    const rssFile = path.join(publicDir, "rss.xml");
    await Bun.write(rssFile, rssFeed);
    console.log(`📄 RSS feed saved: ${rssFile}`);

    // 4️⃣ Generate sitemap index
    const sitemapIndex = sitemapGenerator.generateSitemapIndex([
      { url: `${sitemapGenerator.baseUrl}/sitemap-static.xml`, lastmod: new Date().toISOString() },
      { url: `${sitemapGenerator.baseUrl}/sitemap-chains.xml`, lastmod: new Date().toISOString() }
    ]);
    const indexFile = path.join(publicDir, "sitemap.xml");
    await Bun.write(indexFile, sitemapIndex);
    console.log(`📄 Sitemap index saved: ${indexFile}`);

    console.log("✅ All sitemaps generated successfully!");
  } catch (error) {
    console.error("❌ Error generating sitemaps:", error);
  }
}

generateAndSaveSitemap();
