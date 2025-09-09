import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { useMergedChainById } from "@/hooks/useChains"
import { getChainIdFromSlug, getSemanticUrl, hasSemanticMapping, getNetworkSEOData, getBreadcrumbs } from "@/lib/url-mapping"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ConnectWalletButton } from "@/components/connectWallet"
import { 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  AlertTriangle,
  Copy,
  CheckCircle,
  Clock,
  TrendingUp,
  Network,
  Coins,
  Link as LinkIcon,
  Settings,
  Wallet,
  Droplets
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { SEOHead } from "@/components/seo-head"
import { DynamicFAQ } from "@/components/dynamic-faq"
import { SimplifiedRpcSection } from "@/components/simplified-rpc-section"
import { BridgeInfoSection } from "@/components/bridge-info-section"
import { FaucetSection } from "@/components/faucet-section"
import { analytics } from "@/lib/analytics"
import { MergedChainData } from "@/types/chain"
import { getWalletRpcEndpoints, getBestRpcEndpoint } from '@/lib/rpc-selector'
import { addNetworkToWallet } from '@/lib/wallet-config'

const ChainDetail = () => {
  const { chainId, slug } = useParams<{ chainId?: string; slug?: string }>()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [recentlyViewed, setRecentlyViewed] = useState<MergedChainData[]>([])
  const [isAddingToWallet, setIsAddingToWallet] = useState(false)

  // Determine the actual chain ID from either slug or chainId parameter
  const actualChainId = slug ? getChainIdFromSlug(slug) : (chainId ? parseInt(chainId) : 0)
  
  const { data: chain, isLoading, error } = useMergedChainById(actualChainId || 0)

  // Handle redirects from legacy chain ID URLs to semantic URLs
  useEffect(() => {
    if (chainId && !slug && chain) {
      const numericChainId = parseInt(chainId)
      if (hasSemanticMapping(numericChainId)) {
        const semanticUrl = getSemanticUrl(numericChainId)
        // 301 redirect to semantic URL
        navigate(semanticUrl, { replace: true })
        return
      }
    }
  }, [chainId, slug, chain, navigate])

  // Get SEO data for the current network
  const seoData = slug ? getNetworkSEOData(slug) : null

  // Track chain view for analytics
  useEffect(() => {
    if (chain) {
      analytics.trackChainView(chain.chainId, chain.name)
      
      // Add to recently viewed
      setRecentlyViewed(prev => {
        const filtered = prev.filter(c => c.chainId !== chain.chainId)
        return [chain, ...filtered].slice(0, 5)
      })
    }
  }, [chain])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to Clipboard!",
        description: `${label} has been copied to your clipboard. You can now paste it in your wallet or application.`,
      })
    } catch (error) {
      // Fallback for older browsers or when clipboard API is not available
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        toast({
          title: "Copied to Clipboard!",
          description: `${label} has been copied to your clipboard.`,
        })
      } catch (fallbackError) {
        toast({
          title: "Copy Failed",
          description: "Please copy the information manually from the page.",
          variant: "destructive"
        })
      }
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive': return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="bg-green-500">Active</Badge>
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !chain) {
    return (
      <>
        <SEOHead 
          title="Network Not Found - ChainScope"
          description="The requested blockchain network could not be found. Explore our comprehensive directory of 2,000+ blockchain networks with real-time RPC monitoring and analytics."
          type="website"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-destructive border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-semibold text-destructive">Network Not Found</h2>
            <p className="text-muted-foreground">
              The requested blockchain network could not be found in our database. 
              Please check the chain ID or explore our comprehensive network directory.
            </p>
            <Button asChild>
              <Link to="/">Explore All Networks</Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  // Generate FAQ data for this specific chain
  const generateFAQData = (chain: MergedChainData) => {
    const faq = []
    
    faq.push({
      question: `What is ${chain.name} blockchain network?`,
      answer: `${chain.name} is a ${chain.isTestnet ? 'testnet' : 'mainnet'} blockchain network with Chain ID ${chain.chainId}. It uses ${chain.nativeCurrency.symbol} as its native cryptocurrency and ${chain.verified ? 'has been verified' : 'is currently unverified'} by the community.`
    })

    if (chain.rpc && chain.rpc.length > 0) {
      const onlineRpcs = chain.rpcEndpoints?.filter(rpc => rpc.status === 'online').length || 0
      faq.push({
        question: `How many RPC endpoints are available for ${chain.name}?`,
        answer: `${chain.name} has ${chain.rpc.length} total RPC endpoints, with ${onlineRpcs} currently online and available for use. These endpoints allow developers and users to interact with the ${chain.name} blockchain.`
      })
    }

    faq.push({
      question: `How do I add ${chain.name} to my wallet?`,
      answer: `To add ${chain.name} to your wallet, you'll need: Network Name: ${chain.name}, Chain ID: ${chain.chainId}, Currency Symbol: ${chain.nativeCurrency.symbol}, and an RPC URL from the list above. You can use the "Add to Wallet" button on this page for automatic configuration.`
    })

    if (chain.parent) {
      faq.push({
        question: `Is ${chain.name} a Layer 2 network?`,
        answer: `Yes, ${chain.name} is a Layer 2 network built on ${chain.parent.chain}. Layer 2 networks provide scaling solutions by processing transactions off the main blockchain while maintaining security through the parent chain.`
      })
    }

    faq.push({
      question: `What can I do with ${chain.name}?`,
      answer: `With ${chain.name}, you can: transfer ${chain.nativeCurrency.symbol} tokens, interact with smart contracts, use decentralized applications (dApps), and participate in the network's ecosystem. The network supports various features including ${chain.features?.map(f => f.name).join(', ') || 'standard blockchain operations'}.`
    })

    return faq
  }
  
  const faqData = generateFAQData(chain)

  const calculateHealthScore = () => {
  // Check if rpcHealth exists and has at least one defined metric
  if (
    !chain.rpcHealth || (
      chain.rpcHealth.averageLatency === undefined &&
      chain.rpcHealth.reliabilityScore === undefined &&
      chain.rpcHealth.privacyScore === undefined
    )
  ) {
    return 0
  }

  // Destructure with default fallbacks
  const {
    averageLatency = 1000, // high latency = bad by default
    reliabilityScore = 0,
    privacyScore = 0,
  } = chain.rpcHealth

  // Normalize latency to a 0-100 score (lower latency is better)
  const latencyScore = Math.max(0, Math.min(1, (1000 - averageLatency) / 1000)) * 100

  // Weight how important each metric is
  const weights = {
    reliability: 0.5,
    latency: 0.3,
    privacy: 0.2,
  }

  // Compute weighted composite score
  const score =
    reliabilityScore * weights.reliability +
    latencyScore * weights.latency +
    privacyScore * weights.privacy

  // Clamp and round score to 0-100
  return Math.round(Math.max(0, Math.min(100, score)))
}
  
  return (
    <>
      <SEOHead 
        title={seoData ? seoData.title : `${chain.name} (Chain ID: ${chain.chainId}) - Blockchain Network Details & RPC Endpoints`}
        description={seoData ? seoData.description : `Comprehensive analysis of ${chain.name} blockchain network. Chain ID: ${chain.chainId}. ${chain.isTestnet ? 'Testnet' : 'Mainnet'} network with ${chain.rpc?.length || 0} RPC endpoints. ${chain.verified ? 'Verified network.' : ''} ${chain.parent ? `Layer 2 network built on ${chain.parent.chain}.` : ''} Real-time RPC health monitoring, network specifications, and connection details.`}
        keywords={seoData ? seoData.keywords : `${chain.name}, ${chain.name.toLowerCase()} blockchain, chain ID ${chain.chainId}, ${chain.name.toLowerCase()} RPC, ${chain.name.toLowerCase()} network, ${chain.isTestnet ? 'testnet' : 'mainnet'} blockchain, ${chain.nativeCurrency?.symbol || ''} cryptocurrency, blockchain network details, RPC endpoints, network analytics`}
        canonical={seoData ? seoData.canonical : undefined}
        type="website"
        chainData={chain}
        faqData={faqData}
        breadcrumbs={slug ? getBreadcrumbs(slug) : [
          { name: 'Home', url: '/' },
          { name: 'Blockchain Networks', url: '/#networks-section' },
          { name: chain.name, url: slug ? `/network/${slug}` : `/chain/${chain.chainId}` }
        ]}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Back Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            asChild 
            className="mb-4 hover:bg-muted/50 transition-all duration-200 group"
          >
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium hidden sm:inline">Back to All Networks</span>
              <span className="font-medium sm:hidden">Back</span>
            </Link>
          </Button>
        </div>

        {/* Chain Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            {chain.icon && (
              <img 
                src={chain.icon} 
                alt={`${chain.name} logo`}
                className="w-16 h-16 rounded-lg border border-border/50"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{chain.name}</h1>
                {chain.verified && (
                  <Badge variant="default" className="bg-green-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant={chain.isTestnet ? "secondary" : "outline"}>
                  {chain.isTestnet ? 'Testnet' : 'Mainnet'}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-2">
                Chain ID: {chain.chainId} • {chain.nativeCurrency?.name} ({chain.nativeCurrency?.symbol})
              </p>
              {chain.infoURL && (
                <a 
                  href={chain.infoURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <span className="text-sm text-muted-foreground">RPC Endpoints</span>
              <p className="text-2xl font-bold mt-1">{chain.rpc?.length || 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <span className="text-sm text-muted-foreground">Native Currency</span>
              <p className="text-lg font-semibold mt-1">{chain.nativeCurrency.symbol}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <span className="text-sm text-muted-foreground">Features</span>
              <p className="text-2xl font-bold mt-1">{chain.features?.length || 0}</p>
            </CardContent>
          </Card>
        </div>


 

    <div className="mb-6">
  <Card className="bg-gradient-card border-border/50">
    <CardContent className="p-4">
      {/* <span className="text-sm text-muted-foreground">RPC Performance</span> */}
      {/* <div className="mt-3 w-full h-6 bg-gray-200/50 backdrop-blur-md rounded-full overflow-hidden relative shadow-inner border border-gray-300"> */}
        {/* <div
          className="h-full rounded-full transition-all duration-700 ease-in-out"
          style={{
            width: `${Math.min(calculateHealthScore() || 0, 100)}%`,
            background: `linear-gradient(90deg,
              ${calculateHealthScore() >= 70 ? '#22c55e' : calculateHealthScore() >= 40 ? '#facc15' : '#ef4444'},
              ${calculateHealthScore() >= 70 ? '#4ade80' : calculateHealthScore() >= 40 ? '#fde047' : '#f87171'})`,
            boxShadow: '0 0 10px rgba(0,0,0,0.1), inset 0 1px 3px rgba(255,255,255,0.4)'
          }}
        />
      </div> */}
      {/* <p className="text-sm font-medium mt-2 text-center text-muted-foreground">
        {Math.min(calculateHealthScore() || 0, 100)} / 100
      </p> */}
    </CardContent>
  </Card>
</div>













        {/* Main Content Area - Tabs and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (Tabs) */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Network Overview</TabsTrigger>
                <TabsTrigger value="rpc">RPC Endpoints</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Network Information Card */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle>Network Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Network Name</label>
                        <p className="font-medium">{chain.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Short Name</label>
                        <p className="font-medium">{chain.shortName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Chain ID</label>
                        <p className="font-medium">{chain.chainId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Network Type</label>
                        <p className="font-medium">{chain.isTestnet ? 'Testnet' : 'Mainnet'}</p>
                      </div>
                      {chain.slip44 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">SLIP-44</label>
                          <p className="font-medium">{chain.slip44}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Native Currency Details */}
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Native Currency</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Name</label>
                          <p className="font-medium">{chain.nativeCurrency.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Symbol</label>
                          <p className="font-medium">{chain.nativeCurrency.symbol}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Decimals</label>
                          <p className="font-medium">{chain.nativeCurrency.decimals}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Features Card */}
                {chain.features && chain.features.length > 0 && (
                  <Card className="bg-gradient-card border-border/50">
                    <CardHeader>
                      <CardTitle>Network Features & Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {chain.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Bridges Card */}
                {chain.bridges && chain.bridges.length > 0 && (
                  <BridgeInfoSection bridges={chain.bridges} />
                )}
                
                
                
                <DynamicFAQ chain={chain} />
              </TabsContent>

              <TabsContent value="rpc">
                <SimplifiedRpcSection chain={chain} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Add to Wallet Button */}
            <div className="mb-6">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 w-full" 
                disabled={isAddingToWallet}
                onClick={async () => {
                  if (isAddingToWallet) return // Prevent double clicks
                  
                  setIsAddingToWallet(true)
                  try {
                  // Check if wallet is available
                  if (typeof window === 'undefined' || !(window as any).ethereum) {
                    toast({
                      title: "No Web3 Wallet Found",
                      description: "Please install MetaMask or another Web3 wallet to add networks automatically.",
                      variant: "destructive",
                      action: (
                        <ToastAction altText="Get MetaMask" onClick={() => window.open('https://metamask.io/download/', '_blank')}>
                          Get MetaMask
                        </ToastAction>
                      )
                    })
                    return
                  }

                  // Check if wallet is connected
                  const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })
                  
                  if (accounts.length === 0) {
                    toast({
                      title: "Wallet Not Connected",
                      description: "Please connect your wallet first, then try adding the network.",
                      variant: "destructive",
                    //   action: (

                    //     //  <ConnectWalletButton />

                    //     // <ToastAction altText="Connect Wallet" onClick={async () => {
                    //     //   try {
                    //     //     await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
                    //     //     toast({
                    //     //       title: "Wallet Connected",
                    //     //       description: "Your wallet is now connected. Try adding the network again.",
                    //     //     })
                    //     //   } catch {
                    //     //     toast({
                    //     //       title: "Connection Failed",
                    //     //       description: "Please connect your wallet manually and try again.",
                    //     //       variant: "destructive"
                    //     //     })
                    //     //   }
                    //     // }}>
                    //     //   Connect
                    //     // </ToastAction>


                    // //     <ToastAction altText="Connect Wallet">
                    // //   <ConnectWalletButton />
                    // // </ToastAction>


                    //   // )
                     })
                    return
                  }

                  // Use the smart RPC selector to add network with best endpoints
                  await addNetworkToWallet(chain)
                  toast({
                    title: "Network Added Successfully!",
                    description: `${chain.name} has been added to your wallet with the best available RPC endpoints.`,
                    variant: "success"
                  })
                  
                } catch (error: any) {
                  // Handle specific error cases with enhanced user feedback
                  if (error.code === 4001 || error.message?.includes('User rejected')) {
                    toast({
                      title: "Request Cancelled",
                      description: "You declined to add the network to your wallet.",
                      variant: "destructive"
                    })
                  } else if (error.code === -32602 || error.message?.includes('Invalid network parameters')) {
                    toast({
                      title: "Invalid Network Configuration",
                      description: "The network configuration is invalid. Please try again or add manually.",
                      variant: "destructive"
                    })
                  } else if (error.code === -32000 || error.message?.includes('already exists') || error.message?.includes('already added')) {
                    toast({
                      title: "Network Added",
                      description: `${chain.name} is added in your wallet.`,
                      variant: "success"
                    })
                  } else if (error.message?.includes('No official or reliable RPC endpoints')) {
                    toast({
                      title: "No Official RPC Endpoints",
                      description: "For security reasons, we only add networks with verified RPC endpoints to wallets. Please add this network manually using official RPC URLs.",
                      variant: "destructive"
                    })
                  } else if (error.message?.includes('No Ethereum wallet detected')) {
                    toast({
                      title: "Wallet Not Detected",
                      description: "Please install and enable MetaMask or another Web3 wallet.",
                      variant: "destructive"
                    })
                  } else if (!error.message) {
                    // Handle silent failures
                    toast({
                      title: "Unable to Add Network",
                      description: "Please ensure your wallet is unlocked and try again.",
                      variant: "destructive"
                    })
                  } else {
                    toast({
                      title: "Failed to Add Network",
                      description: error.message || "Please try again or add the network manually from the details below.",
                      variant: "destructive"
                    })
                  }
                } finally {
                  setIsAddingToWallet(false)
                }
              }}>
                <Wallet className="w-5 h-5 mr-2" />
                {isAddingToWallet ? 'Adding to Wallet...' : 'Add to Wallet'}
              </Button>
            </div>
            
            {/* Quick Actions */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => copyToClipboard(chain.chainId.toString(), 'Chain ID')}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Chain ID
                </Button>
                {chain.rpc && chain.rpc.length > 0 && (
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    const bestRpc = getBestRpcEndpoint(chain)
                    if (bestRpc) {
                      copyToClipboard(bestRpc, 'RPC URL')
                    } else {
                      toast({
                        title: "No Official RPC Available",
                        description: "This network has no official or reliable RPC endpoints to copy.",
                        variant: "destructive"
                      })
                    }
                  }}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy RPC URL
                  </Button>
                )}
                {chain.infoURL && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={chain.infoURL} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Official Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Blockchain Explorers */}
            {chain.explorers && chain.explorers.length > 0 && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Blockchain Explorers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                                     {chain.explorers.map((explorer, index) => (
                     <a 
                       key={index} 
                       href={explorer.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="block"
                     >
                       <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-border transition-colors cursor-pointer">
                         <div className="flex items-center gap-3">
                           <Globe className="w-4 h-4" />
                           <span className="font-medium">{explorer.name}</span>
                         </div>
                         <ExternalLink className="w-4 h-4 text-muted-foreground" />
                       </div>
                     </a>
                   ))}
                </CardContent>
              </Card>
            )}

            {/* Testnet Faucet - Only for testnet chains */}
            {chain.isTestnet && chain.faucets && chain.faucets.length > 0 && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Testnet Faucet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chain.faucets.map((faucetUrl, index) => {
                    const url = new URL(faucetUrl)
                    const friendlyName = url.hostname.replace('www.', '').split('.')[0]
                    const displayName = friendlyName.charAt(0).toUpperCase() + friendlyName.slice(1)
                    
                    return (
                      <a 
                        key={index} 
                        href={faucetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                                                 <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-border transition-colors cursor-pointer">
                           <div className="flex items-center gap-3">
                             <Droplets className="w-4 h-4 text-blue-500" />
                             <span className="font-medium">{displayName} Faucet</span>
                           </div>
                           <ExternalLink className="w-4 h-4 text-muted-foreground" />
                         </div>
                      </a>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChainDetail