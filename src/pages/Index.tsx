import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { EnhancedChainCard } from "@/components/enhanced-chain-card"
import { AdvancedSearch } from "@/components/advanced-search"
import { NetworkFilters } from "@/components/network-filters"

import { SEOHead } from "@/components/seo-head"
import { InfiniteChainGrid } from "@/components/infinite-chain-grid"
import { useInfiniteChains, useMergedChainStats } from "@/hooks/useChains"

import { MergedChainData } from "@/types/chain"
import { 
  Play, 
  GitCompare, 
  TrendingUp, 
  ArrowRight,
  Grid3X3,
  List,
  Sparkles,
  Search,
  Shield,
  Settings,
  Star,
  Globe,
  BarChart3,
  Mail
} from "lucide-react"
import { analytics } from '@/lib/analytics'
import { chainDataMerger } from '@/lib/chain-data-merger'

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: infiniteData, isLoading, error } = useInfiniteChains({
    searchQuery,
    selectedFilters,
    activeTab
  })
  const { data: stats } = useMergedChainStats()
  
  // Dynamic scoring system based on environment variables
  const calculateChainScore = React.useCallback((chain: MergedChainData) => {
    const popularScore = parseInt(import.meta.env.POPULAR_CHAIN_SCORE || '1000')
    const verifiedScore = parseInt(import.meta.env.VERIFIED_CHAIN_SCORE || '500')
    const rpcMultiplier = parseInt(import.meta.env.RPC_MULTIPLIER || '10')
    const mainnetScore = parseInt(import.meta.env.MAINNET_SCORE || '200')
    const l2Score = parseInt(import.meta.env.L2_SCORE || '100')
    
    let score = 0
    
    // Popular chains get bonus
    const popularChainIds = import.meta.env.POPULAR_CHAIN_IDS 
      ? import.meta.env.POPULAR_CHAIN_IDS.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [1, 137, 42161, 10, 56, 43114, 250, 100, 8453, 59144, 534353, 999]
    
    if (popularChainIds.includes(chain.chainId)) {
      score += popularScore
    }
    
    // Verified chains get bonus
    if (chain.verified) {
      score += verifiedScore
    }
    
    // More RPCs = more popular
    if (chain.rpc) {
      score += chain.rpc.length * rpcMultiplier
    }
    
    // Mainnet over testnet
    if (!chain.isTestnet) {
      score += mainnetScore
    }
    
    // L2 chains get bonus
    if (chain.parent) {
      score += l2Score
    }
    
    return score
  }, [])
  


  // Background RPC health updates after initial load
  useEffect(() => {
    if (infiniteData?.allChains && infiniteData.allChains.length > 0 && !isLoading) {
      // Trigger background RPC health updates for popular chains
      const updateRpcHealth = async () => {
        try {
          await chainDataMerger.updatePopularChainsRpcHealth()
        } catch (error) {
          // Silently fail - this is background work
          if (import.meta.env.NODE_ENV === 'development') {
            console.warn('Background RPC update failed:', error)
          }
        }
      }
      
      // Delay the background update to not interfere with initial load
      const timeoutId = setTimeout(updateRpcHealth, 5000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [infiniteData?.allChains, isLoading])

  const handleSearch = useCallback((query: string, tags: string[] = []) => {
    setSearchQuery(query)
    setSelectedFilters(tags)
  }, [])

  const handleClear = useCallback(() => {
    setSearchQuery('')
    setSelectedFilters([])
  }, [])

  const handleFilterChange = useCallback((filters: string[]) => {
    setSelectedFilters(filters)
  }, [])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  if (isLoading) {
    return (
      <>
        <SEOHead />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-semibold">Loading Blockchain Networks...</h2>
            <p className="text-muted-foreground">Fetching the latest chain data from multiple sources</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <SEOHead />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-destructive border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-semibold text-destructive">Failed to Load Data</h2>
            <p className="text-muted-foreground">Unable to fetch blockchain networks. Please try refreshing the page.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead 
        title="ChainScope - The Ultimate Blockchain Network Explorer & RPC Directory"
        description="Discover 2,000+ blockchain networks with real-time RPC health monitoring. Find working RPC endpoints, compare networks, and connect to any blockchain instantly. The most comprehensive blockchain network directory for developers and users."
        keywords="blockchain networks, RPC endpoints, ethereum RPC, polygon RPC, arbitrum RPC, blockchain explorer, web3 infrastructure, cryptocurrency networks, blockchain directory, RPC health monitoring, network comparison, blockchain analytics, layer 2 networks, testnet networks, verified blockchain networks"
        type="website"
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">#1 Blockchain Network Directory & RPC Explorer</span>
              <span className="sm:hidden">#1 Blockchain Directory</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              ChainScope
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              The definitive platform for discovering, monitoring, and connecting to <span className="text-primary font-semibold">2,000+ blockchain networks</span>. 
              <span className="hidden sm:inline"> Real-time RPC health monitoring, comprehensive network analytics, and instant wallet integration for developers and users worldwide.</span>
              <span className="sm:hidden"> Real-time monitoring and instant wallet integration.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4 sm:px-0">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-primary hover:bg-primary/90" onClick={() => scrollToSection('networks-section')}>
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Explore Blockchain Networks</span>
                <span className="sm:hidden">Explore Networks</span>
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6" asChild>
                <Link to="/compare">
                  <GitCompare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Compare Networks</span>
                  <span className="sm:hidden">Compare</span>
                </Link>
              </Button>
            </div>

            {/* Advertisement Line */}
            <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
              <p className="text-sm text-muted-foreground mb-2">
              Reach our global community of Web3 developers, blockchain enthusiasts, and crypto users.
              </p>
              <a 
                href="mailto:hello@chainscope.app" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                Advertise With Us
              </a>
            </div>


          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section id="analytics-section" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Real-Time Blockchain Network Analytics
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Comprehensive insights into blockchain network performance, RPC endpoint health, and ecosystem trends. 
              <span className="hidden sm:inline"> Monitor network uptime, latency, and reliability across the entire blockchain landscape.</span>
            </p>
          </div>

        </div>
      </section>

      {/* Networks Section */}
      <section id="networks-section" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section */}
          <div className="mb-8 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Find Your Perfect Blockchain Network</h2>
              <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
                Search through thousands of blockchain networks by name, symbol, chain ID, or network type
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <AdvancedSearch
                chains={infiniteData?.allChains || []}
                onSearch={handleSearch}
                onClear={handleClear}
                placeholder="Search blockchain networks by name, symbol, chain ID, or network type..."
                className="mb-4 sm:mb-6"
              />
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                  <NetworkFilters
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                />
                
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Grid view - cards layout</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>List view - compact layout</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          
          {/* Clear Filters and Compare Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              {(searchQuery || selectedFilters.length > 0) && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Clear all filters
                </Button>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link to="/compare">
                    <GitCompare className="w-4 h-4" />
                    <span className="hidden sm:inline">Compare Networks</span>
                    <span className="sm:hidden">Compare</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compare multiple networks side-by-side</p>
              </TooltipContent>
            </Tooltip>
          </div>



          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto sm:h-10 p-1">
              <TabsTrigger value="all" title="View all blockchain networks" className="text-xs sm:text-sm">
                All Networks
              </TabsTrigger>
              <TabsTrigger value="mainnet" title="Production networks for real transactions" className="text-xs sm:text-sm">
                Mainnet
              </TabsTrigger>
              <TabsTrigger value="testnet" title="Test networks for development" className="text-xs sm:text-sm">
                Testnet
              </TabsTrigger>
              <TabsTrigger value="verified" title="Independently validated networks" className="text-xs sm:text-sm hidden sm:block">
                Verified
              </TabsTrigger>
              <TabsTrigger value="trending" title="Popular and trending networks" className="text-xs sm:text-sm hidden sm:block">
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 sm:mt-6">
              {infiniteData && (
                <InfiniteChainGrid
                  allChains={infiniteData.allChains}
                  totalCount={infiniteData.totalCount}
                  initialLoadSize={infiniteData.initialLoadSize}
                  loadMoreSize={infiniteData.loadMoreSize}
                  viewMode={viewMode}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            <TabsContent value="mainnet" className="mt-4 sm:mt-6">
              {infiniteData && (
                <InfiniteChainGrid
                  allChains={infiniteData.allChains}
                  totalCount={infiniteData.totalCount}
                  initialLoadSize={infiniteData.initialLoadSize}
                  loadMoreSize={infiniteData.loadMoreSize}
                  viewMode={viewMode}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            <TabsContent value="testnet" className="mt-4 sm:mt-6">
              {infiniteData && (
                <InfiniteChainGrid
                  allChains={infiniteData.allChains}
                  totalCount={infiniteData.totalCount}
                  initialLoadSize={infiniteData.initialLoadSize}
                  loadMoreSize={infiniteData.loadMoreSize}
                  viewMode={viewMode}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            <TabsContent value="verified" className="mt-4 sm:mt-6">
              {infiniteData && (
                <InfiniteChainGrid
                  allChains={infiniteData.allChains}
                  totalCount={infiniteData.totalCount}
                  initialLoadSize={infiniteData.initialLoadSize}
                  loadMoreSize={infiniteData.loadMoreSize}
                  viewMode={viewMode}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            <TabsContent value="trending" className="mt-4 sm:mt-6">
              {infiniteData && (
                <InfiniteChainGrid
                  allChains={infiniteData.allChains}
                  totalCount={infiniteData.totalCount}
                  initialLoadSize={infiniteData.initialLoadSize}
                  loadMoreSize={infiniteData.loadMoreSize}
                  viewMode={viewMode}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>
          </Tabs>


        </div>
      </section>

      {/* Compare Section */}
      <section id="compare-section" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Compare Blockchain Networks Side-by-Side
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make informed decisions by comparing network specifications, RPC performance, and features across multiple blockchain networks
            </p>
          </div>
              
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Popular Comparisons */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>
                    Popular Network Comparisons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/compare?chains=1,137">
                      <Globe className="w-4 h-4 mr-2" />
                      Ethereum vs Polygon: Layer 1 vs Layer 2
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/compare?chains=1,42161">
                      <Globe className="w-4 h-4 mr-2" />
                      Ethereum vs Arbitrum: Rollup Solutions
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/compare?chains=1,10">
                      <Globe className="w-4 h-4 mr-2" />
                      Ethereum vs Optimism: Optimistic Rollups
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/compare?chains=137,42161">
                      <Globe className="w-4 h-4 mr-2" />
                      Polygon vs Arbitrum: Scaling Solutions
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Compare Tool */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>
                    Custom Network Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select up to 4 blockchain networks to compare their technical specifications, performance metrics, and ecosystem features
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                    <li>• RPC endpoint health and latency analysis</li>
                    <li>• Network specifications and consensus mechanisms</li>
                    <li>• Bridge availability and cross-chain compatibility</li>
                    <li>• Explorer and developer tool ecosystem</li>
                    <li>• Security features and verification status</li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link to="/compare">
                      <GitCompare className="w-4 h-4 mr-2" />
                      Start Comparing Networks
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


    </>
  )
}





export default Index
