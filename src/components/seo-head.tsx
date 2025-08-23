import React from 'react'
import { Helmet } from 'react-helmet-async'
import { ChainData } from '@/types/chain'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  canonical?: string
  type?: 'website' | 'article' | 'profile'
  chainData?: ChainData
  faqData?: Array<{ question: string; answer: string }>
  breadcrumbs?: Array<{ name: string; url: string }>
}

export const SEOHead = ({ 
  title = 'ChainScope - Discover & Connect to Blockchain Networks',
  description = 'Explore 2,000+ blockchain networks, find working RPC endpoints, and connect to any blockchain with ChainScope. Real-time RPC health monitoring and comprehensive chain analytics.',
  keywords = 'blockchain, RPC endpoints, cryptocurrency, ethereum, polygon, bsc, web3, dapp, blockchain networks, chainlist, ethereum chainlist, Ethereum dev tools, base, arbitrum, avalanche, optimism, RPC health, chain analytics, AI blockchain tools, web3 infrastructure',
  image = '/og-image.png',
  url,
  canonical,
  type = 'website',
  chainData,
  faqData = [],
  breadcrumbs = []
}: SEOHeadProps) => {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const canonicalUrl = canonical || currentUrl;
  const fullTitle = chainData ? `${chainData.name} (Chain ID: ${chainData.chainId}) - ChainScope` : title;
  
  // Dynamic description based on available chain data
  const fullDescription = chainData 
    ? `${chainData.name} (Chain ID: ${chainData.chainId}) - ${chainData.isTestnet ? 'Testnet' : 'Mainnet'} blockchain network. Native currency: ${chainData.nativeCurrency?.symbol || 'Unknown'}. ${chainData.rpc?.length || 0} RPC endpoints available. ${chainData.verified ? 'Verified network.' : ''} ${chainData.parent ? `Layer 2 network built on ${chainData.parent.chain}.` : ''} Explore detailed analytics, RPC health, and connect to ${chainData.name} with ChainScope.`
    : description;
    
  const fullImage = chainData?.icon || image;

  // Generate FAQ schema if FAQ data is provided
  const generateFAQSchema = () => {
    if (faqData.length === 0) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  };

  // Generate breadcrumb schema
  const generateBreadcrumbSchema = () => {
    if (breadcrumbs.length === 0) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  };

  // Generate chain-specific schema
  const generateChainSchema = () => {
    if (!chainData) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": chainData.name,
      "description": fullDescription,
      "applicationCategory": "Blockchain Network",
      "operatingSystem": "Blockchain",
      "softwareVersion": chainData.chainId?.toString(),
      "identifier": chainData.chainId?.toString(),
      "url": canonicalUrl,
      "image": fullImage,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Chain ID",
          "value": chainData.chainId
        },
        {
          "@type": "PropertyValue",
          "name": "Native Currency",
          "value": chainData.nativeCurrency?.symbol || "Unknown"
        },
        {
          "@type": "PropertyValue",
          "name": "Network Type",
          "value": chainData.isTestnet ? "Testnet" : "Mainnet"
        },
        {
          "@type": "PropertyValue",
          "name": "RPC Endpoints",
          "value": chainData.rpc?.length || 0
        },
        {
          "@type": "PropertyValue",
          "name": "Verified",
          "value": chainData.verified ? "Yes" : "No"
        }
      ]
    };
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ChainScope" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@chainscope" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ChainScope" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Structured Data */}
      {chainData && (
        <script type="application/ld+json">
          {JSON.stringify(generateChainSchema())}
        </script>
      )}
      
      {faqData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema())}
        </script>
      )}
      
      {breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema())}
        </script>
      )}
    </Helmet>
  )
}