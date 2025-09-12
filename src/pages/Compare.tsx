import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getSemanticUrl } from "@/lib/url-mapping"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Search, 
  X, 
  Globe, 
  Shield, 
  Zap, 
  Coins, 
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart3,
  GitCompare,
  Network,
  Cpu,
  Database,
  Lock,
  ExternalLink,
  Activity,
  Users,
  Star,
  Target,
  Gauge,
  Wifi,
  Server,
  Link as LinkIcon,
  Building2,
  Layers,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { SEOHead } from "@/components/seo-head"
import { useMergedChains } from "@/hooks/useChains"
import { analytics } from "@/lib/analytics"
import { MergedChainData } from "@/types/chain"
import { RpcMonitor } from "@/lib/rpc-monitor"

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: allChains = [] } = useMergedChains()
  const [selectedChains, setSelectedChains] = useState<MergedChainData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [performanceData, setPerformanceData] = useState<Record<number, any>>({})
  const [loadingPerformance, setLoadingPerformance] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})


  const [expanded, setExpanded] = useState(false);


  


  // Get chains from URL params
  useEffect(() => {
    const chainIds = searchParams.get('chains')?.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) || []
    const chains = allChains.filter(chain => chainIds.includes(chain.chainId))
    setSelectedChains(chains)
  }, [searchParams, allChains])

  // Track page view
  useEffect(() => {
    analytics.trackPageView('/compare', 'ChainScope - Compare Networks')
  }, [])

  // Fetch performance data for selected chains
  useEffect(() => {
    if (selectedChains.length > 0) {
      fetchPerformanceData()
    }
  }, [selectedChains])

  const fetchPerformanceData = async () => {
    setLoadingPerformance(true)
    const monitor = RpcMonitor.getInstance()
    const data: Record<number, any> = {}

    for (const chain of selectedChains) {
      if (chain.rpc && chain.rpc.length > 0) {
        try {
          const metrics = await monitor.getChainPerformanceMetrics(chain.chainId, chain.rpc)
          data[chain.chainId] = metrics
        } catch (error) {
          console.error(`Failed to fetch performance data for chain ${chain.chainId}:`, error)
        }
      }
    }

    setPerformanceData(data)
    setLoadingPerformance(false)
  }

  const filteredChains = useMemo(() => {
    if (!searchQuery.trim()) return allChains.slice(0, 20)
    
    const query = searchQuery.toLowerCase()
    return allChains.filter(chain => 
      chain.name.toLowerCase().includes(query) ||
      chain.shortName.toLowerCase().includes(query) ||
      chain.chainId.toString().includes(query) ||
      chain.nativeCurrency.symbol.toLowerCase().includes(query)
    ).slice(0, 20)
  }, [allChains, searchQuery])

  const addChain = (chain: MergedChainData) => {
    if (selectedChains.length >= 4) return
    if (selectedChains.find(c => c.chainId === chain.chainId)) return
    
    const newChains = [...selectedChains, chain]
    setSelectedChains(newChains)
    
    // Update URL
    const chainIds = newChains.map(c => c.chainId).join(',')
    setSearchParams({ chains: chainIds })
    
    setShowSearch(false)
    setSearchQuery('')
  }

  const removeChain = (chainId: number) => {
    const newChains = selectedChains.filter(c => c.chainId !== chainId)
    setSelectedChains(newChains)
    
    // Update URL
    const chainIds = newChains.map(c => c.chainId).join(',')
    if (chainIds) {
      setSearchParams({ chains: chainIds })
    } else {
      setSearchParams({})
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive': return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="bg-green-500">Active</Badge>
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPerformanceScore = (metrics: any) => {
    if (!metrics) return 0
    const latencyScore = Math.max(0, 100 - (metrics.averageLatency || 0) / 10)
    const uptimeScore = metrics.averageUptime || 0
    const reliabilityScore = metrics.reliabilityScore || 0
    return Math.round((latencyScore + uptimeScore + reliabilityScore) / 3)
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge variant="default" className="bg-green-500">Excellent</Badge>
    if (score >= 60) return <Badge variant="secondary">Good</Badge>
    return <Badge variant="destructive">Poor</Badge>
  }

  const renderComparisonTable = () => (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden border border-border rounded-lg">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider min-w-[150px] sm:min-w-[200px]">
                  Metric
                </th>
                {selectedChains.map(chain => (
                  <th key={chain.chainId} className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider min-w-[200px] sm:min-w-[250px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {chain.icon && (
                        <img 
                          src={chain.icon} 
                          alt={chain.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <span className="hidden sm:inline">{chain.name}</span>
                      <span className="sm:hidden">{chain.shortName || chain.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
        <tbody className="bg-background divide-y divide-border">
          {/* Basic Information */}
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium bg-muted/30 text-muted-foreground">Chain ID</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="px-3 sm:px-4 py-3 sm:py-4 text-sm">{chain.chainId}</td>
            ))}
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium bg-muted/30 text-muted-foreground">Network Type</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                <Badge variant={chain.isTestnet ? "secondary" : "default"} className="text-xs">
                  {chain.isTestnet ? 'Testnet' : 'Mainnet'}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium bg-muted/30 text-muted-foreground">Status</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(chain.status)}
                  {getStatusBadge(chain.status)}
                </div>
              </td>
            ))}
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium bg-muted/30 text-muted-foreground">Native Currency</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{chain.nativeCurrency.symbol}</span>
                  <span className="text-muted-foreground text-xs hidden sm:inline">({chain.nativeCurrency.decimals} decimals)</span>
                </div>
              </td>
            ))}
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium bg-muted/30 text-muted-foreground">Verification</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                <Badge variant={chain.verified ? "default" : "outline"} className="text-xs">
                  {chain.verified ? 'Verified' : 'Unverified'}
                </Badge>
              </td>
            ))}
          </tr>

          {/* Performance Metrics */}
          <tr className="border-b border-border/50 bg-blue-50/20">
            <td className="p-4 font-medium bg-blue-100/30">Performance Score</td>
            {selectedChains.map(chain => {
              const metrics = performanceData[chain.chainId]
              const score = getPerformanceScore(metrics)
              return (
                <td key={chain.chainId} className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={score} className="h-2" />
                    </div>
                    <span className={`font-bold ${getPerformanceColor(score)}`}>{score}%</span>
                  </div>
                  {getPerformanceBadge(score)}
                </td>
              )
            })}
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">Average Latency</td>
            {selectedChains.map(chain => {
              const metrics = performanceData[chain.chainId]
              return (
                <td key={chain.chainId} className="p-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-500" />
                    <span>{metrics?.averageLatency ? `${metrics.averageLatency}ms` : 'N/A'}</span>
                  </div>
                </td>
              )
            })}
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">Reliability Score</td>
            {selectedChains.map(chain => {
              const metrics = performanceData[chain.chainId]
              return (
                <td key={chain.chainId} className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>{metrics?.reliabilityScore ? `${metrics.reliabilityScore}%` : 'N/A'}</span>
                  </div>
                </td>
              )
            })}
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">RPC Endpoints</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="p-4">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-500" />
                  <span>{chain.rpc?.length || 0} total</span>
                  <span className="text-green-600">
                    ({performanceData[chain.chainId]?.healthyRpcs || 0} healthy)
                  </span>
                </div>
              </td>
            ))}
          </tr>

          {/* Features */}
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">Features</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>{chain.features?.length || 0}</span>
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">Bridges</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="p-4">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-500" />
                  <span>{chain.bridges?.length || 0}</span>
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">Explorers</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="p-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span>{chain.explorers?.length || 0}</span>
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">Faucets</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>{chain.faucets?.length || 0}</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Advanced Features */}
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">ENS Support</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="p-4">
                {chain.ens ? (
                  <Badge variant="default" className="bg-green-500">Supported</Badge>
                ) : (
                  <Badge variant="outline">Not Supported</Badge>
                )}
              </td>
            ))}
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-4 font-medium bg-muted/30">Parent Chain</td>
            {selectedChains.map(chain => (
              <td key={chain.chainId} className="p-4">
                {chain.parent ? (
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <span>{chain.parent.chain}</span>
                    <Badge variant="outline">{chain.parent.type}</Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground">L1 Network</span>
                )}
              </td>
            ))}
          </tr>
           
            <tr className="border-b border-border/50">
  <td className="p-4 font-medium bg-muted/30">Tags</td>
  {selectedChains.map(chain => {
    const visibleTags = expanded ? chain.tags : chain.tags.slice(0, 3);
    return (
      <td key={chain.chainId} className="p-4">
        <div className="flex flex-wrap gap-1 items-center">
          {visibleTags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}

          {chain.tags.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs p-0 h-auto"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : `+${chain.tags.length - 3} more`}
            </Button>
          )}
        </div>
      </td>
    );
  })}
</tr>





                     <tr className="border-b border-border/50">
             <td className="p-4 font-medium bg-muted/30">Red Flags</td>
             {selectedChains.map(chain => (
               <td key={chain.chainId} className="p-4">
                 {chain.redFlags && chain.redFlags.length > 0 ? (
                   <div className="flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4 text-red-500" />
                     <Badge variant="destructive">{chain.redFlags.length}</Badge>
                   </div>
                 ) : (
                   <CheckCircle className="w-4 h-4 text-green-500" />
                 )}
               </td>
             ))}
           </tr>


        </tbody>
      </table>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <SEOHead 
        title="Compare Blockchain Networks - ChainScope"
        description="Compare blockchain networks side by side. Analyze RPC performance, features, and specifications across multiple chains."
        keywords="blockchain comparison, network comparison, RPC performance, chain analysis, ethereum vs polygon, arbitrum comparison"
        type="website"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Networks</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Compare Networks</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Comprehensive side-by-side comparison of blockchain networks
              </p>
            </div>
            
            <Button onClick={() => setShowSearch(!showSearch)} className="w-full sm:w-auto">
              <Search className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Network</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Search Modal */}
        {showSearch && (
          <Card className="mb-6 bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Search className="w-5 h-5 text-primary" />
                Add Network to Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search networks by name, symbol, or chain ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {filteredChains.map((chain) => (
                  <Button
                    key={chain.chainId}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => addChain(chain)}
                    disabled={selectedChains.find(c => c.chainId === chain.chainId) !== undefined}
                  >
                    <div className="flex items-center gap-3">
                      {chain.icon && (
                        <img 
                          src={chain.icon} 
                          alt={chain.name}
                          className="w-6 h-6 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="text-left">
                        <div className="font-medium text-sm sm:text-base">{chain.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {chain.nativeCurrency.symbol} • Chain ID: {chain.chainId}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Content */}
        {selectedChains.length > 0 ? (
          <div className="space-y-6">
            {/* Selected Chains Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-semibold">Selected Networks ({selectedChains.length}/4)</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedChains.map((chain) => (
                    <Badge key={chain.chainId} variant="outline" className="flex items-center gap-1 text-xs sm:text-sm">
                      {chain.icon && (
                        <img 
                          src={chain.icon} 
                          alt={chain.name}
                          className="w-3 h-3 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <span className="hidden sm:inline">{chain.name}</span>
                      <span className="sm:hidden">{chain.shortName || chain.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeChain(chain.chainId)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              {loadingPerformance && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4 animate-spin" />
                  Loading performance data...
                </div>
              )}
            </div>

            {/* Tabs for different comparison views */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                {/* <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger> */}
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-6">
                    {renderComparisonTable()}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {selectedChains.map((chain) => {
                    const metrics = performanceData[chain.chainId]
                    const score = getPerformanceScore(metrics)
                    
                    return (
                      <Card key={chain.chainId} className="bg-gradient-card border-border/50">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            {chain.icon && (
                              <img 
                                src={chain.icon} 
                                alt={chain.name}
                                className="w-8 h-8 rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <CardTitle className="text-lg">{chain.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                Performance Analysis
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Overall Score */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Overall Score</span>
                              <span className={`text-lg font-bold ${getPerformanceColor(score)}`}>
                                {score}%
                              </span>
                            </div>
                            <Progress value={score} className="h-3" />
                            {getPerformanceBadge(score)}
                          </div>

                          {/* Performance Metrics */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Average Latency</span>
                              <span className="text-sm font-medium">
                                {metrics?.averageLatency ? `${metrics.averageLatency}ms` : 'N/A'}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Reliability</span>
                              <span className="text-sm font-medium">
                                {metrics?.reliabilityScore ? `${metrics.reliabilityScore}%` : 'N/A'}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Uptime</span>
                              <span className="text-sm font-medium">
                                {metrics?.averageUptime ? `${metrics.averageUptime}%` : 'N/A'}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Healthy RPCs</span>
                              <span className="text-sm font-medium">
                                {metrics?.healthyRpcs || 0} / {metrics?.totalRpcs || 0}
                              </span>
                            </div>
                          </div>

                          {/* RPC Health Distribution */}
                          {metrics?.performanceData && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">RPC Health</span>
                              </div>
                              <div className="space-y-1">
                                {metrics.performanceData.slice(0, 3).map((rpc: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between text-xs">
                                    <span className="truncate max-w-20">{rpc.url.split('/')[2]}</span>
                                    <Badge 
                                      variant={rpc.status === 'online' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {rpc.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="mt-6">
                <div className="space-y-6">
                  {selectedChains.map((chain) => (
                    <Card key={chain.chainId} className="bg-gradient-card border-border/50">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          {chain.icon && (
                            <img 
                              src={chain.icon} 
                              alt={chain.name}
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-lg">{chain.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Detailed Network Analysis
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={getSemanticUrl(chain.chainId)}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Network Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Network className="w-4 h-4" />
                              Network Information
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Chain ID</span>
                                <span className="text-sm font-medium">{chain.chainId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Network Type</span>
                                <Badge variant={chain.isTestnet ? "secondary" : "default"}>
                                  {chain.isTestnet ? 'Testnet' : 'Mainnet'}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(chain.status)}
                                  {getStatusBadge(chain.status)}
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Verification</span>
                                <Badge variant={chain.verified ? "default" : "outline"}>
                                  {chain.verified ? 'Verified' : 'Unverified'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Coins className="w-4 h-4" />
                              Currency Information
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Symbol</span>
                                <span className="text-sm font-medium">{chain.nativeCurrency.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Name</span>
                                <span className="text-sm font-medium">{chain.nativeCurrency.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Decimals</span>
                                <span className="text-sm font-medium">{chain.nativeCurrency.decimals}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                                                 {/* Features and Capabilities */}
                         <div className="space-y-4">
                           <h4 className="font-semibold flex items-center gap-2">
                             <Sparkles className="w-4 h-4" />
                             Features & Capabilities
                           </h4>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="text-center p-3 bg-muted/30 rounded-lg">
                               <div className="text-2xl font-bold text-primary">{chain.features?.length || 0}</div>
                               <div className="text-xs text-muted-foreground">Features</div>
                             </div>
                             <div className="text-center p-3 bg-muted/30 rounded-lg">
                               <div className="text-2xl font-bold text-blue-500">{chain.bridges?.length || 0}</div>
                               <div className="text-xs text-muted-foreground">Bridges</div>
                             </div>
                             <div className="text-center p-3 bg-muted/30 rounded-lg">
                               <div className="text-2xl font-bold text-green-500">{chain.explorers?.length || 0}</div>
                               <div className="text-xs text-muted-foreground">Explorers</div>
                             </div>
                             <div className="text-center p-3 bg-muted/30 rounded-lg">
                               <div className="text-2xl font-bold text-yellow-500">{chain.faucets?.length || 0}</div>
                               <div className="text-xs text-muted-foreground">Faucets</div>
                             </div>
                           </div>
                         </div>



                        {/* Tags and Categories */}
                        {chain.tags && chain.tags.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Tags & Categories
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {chain.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Red Flags */}
                        {chain.redFlags && chain.redFlags.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              Red Flags ({chain.redFlags.length})
                            </h4>
                            <div className="space-y-2">
                              {chain.redFlags.map((flag, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                                  <AlertTriangle className="w-4 h-4" />
                                  {flag}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* Empty State */
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-12 text-center">
              <GitCompare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Networks Selected</h3>
              <p className="text-muted-foreground mb-6">
                Add up to 4 networks to compare their features, performance, and specifications
              </p>
              <Button onClick={() => setShowSearch(true)}>
                <Search className="w-4 h-4 mr-2" />
                Add Networks
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

export default Compare 