import { RpcEndpoint } from "@/types/chain"
import { validateRpcUrl, RateLimiter } from './security-utils'

export interface RpcPerformanceData {
  url: string
  status: 'online' | 'offline' | 'slow'
  latency: number
  uptime: number
  privacy: number
  lastChecked: Date
  reliability: number
  score: number
}

export interface ChainPerformanceMetrics {
  averageLatency: number
  averageUptime: number
  totalRpcs: number
  healthyRpcs: number
  privacyScore: number
  reliabilityScore: number
  performanceData: RpcPerformanceData[]
}

export class RpcMonitor {
  private static instance: RpcMonitor
  private statusCache = new Map<string, RpcPerformanceData>()
  private rateLimiter = new RateLimiter(100, 60000) // 100 requests per minute
  private performanceHistory = new Map<string, RpcPerformanceData[]>()

  static getInstance(): RpcMonitor {
    if (!RpcMonitor.instance) {
      RpcMonitor.instance = new RpcMonitor()
    }
    return RpcMonitor.instance
  }

  async checkRpcHealth(url: string): Promise<RpcPerformanceData> {
    // Validate URL first
    if (!validateRpcUrl(url)) {
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`❌ Invalid RPC URL: ${url}`)
      }
      return {
        url,
        status: 'offline',
        latency: 0,
        uptime: 0,
        privacy: 0,
        lastChecked: new Date(),
        reliability: 0,
        score: 0
      }
    }
    
    // Check rate limiting
    if (!this.rateLimiter.isAllowed(url)) {
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`⏳ Rate limited for: ${url}`)
      }
      const cached = this.statusCache.get(url)
      if (cached) {
        if (import.meta.env.NODE_ENV === 'development') {
          console.log(`📋 Using cached result for: ${url}`)
        }
        return { ...cached, lastChecked: new Date() }
      }
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`❌ No cache available for rate limited: ${url}`)
      }
      return {
        url,
        status: 'offline',
        latency: 0,
        uptime: 0,
        privacy: 0,
        lastChecked: new Date(),
        reliability: 0,
        score: 0
      }
    }
    
    const cached = this.statusCache.get(url)
    if (cached && Date.now() - cached.lastChecked.getTime() < 300000) { // 5 minutes cache
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`📋 Using cached result (5min): ${url}`)
      }
      return { ...cached, lastChecked: new Date() }
    }

    if (import.meta.env.NODE_ENV === 'development') {
      console.log(`🔍 Testing RPC: ${url}`)
    }
    
    try {
      const startTime = Date.now()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const latency = Date.now() - startTime
      
      if (response.ok) {
        const status = latency > 5000 ? 'slow' : 'online'
        const privacy = this.calculatePrivacyScore(url)
        const reliability = status === 'online' ? 95 : status === 'slow' ? 75 : 0
        const score = this.calculateScore(status, latency, privacy)
        const uptime = this.calculateUptime(url)
        
        const performanceData: RpcPerformanceData = {
          url,
          status,
          latency,
          uptime,
          privacy,
          lastChecked: new Date(),
          reliability,
          score
        }
        
        this.statusCache.set(url, performanceData)
        this.updatePerformanceHistory(url, performanceData)
        
        if (import.meta.env.NODE_ENV === 'development') {
          console.log(`✅ RPC ${url} is ${status} (${latency}ms)`)
        }
        
        return performanceData
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(`❌ RPC ${url} failed:`, error)
      }
      
      const performanceData: RpcPerformanceData = {
        url,
        status: 'offline',
        latency: 0,
        uptime: 0,
        privacy: 0,
        lastChecked: new Date(),
        reliability: 0,
        score: 0
      }
      
      this.statusCache.set(url, performanceData)
      return performanceData
    }
  }

  async testMultipleRpcs(rpcs: string[]): Promise<RpcEndpoint[]> {
    const results: RpcEndpoint[] = []
    
    // Test RPCs in parallel with concurrency limit
    const concurrencyLimit = 5
    const chunks = []
    for (let i = 0; i < rpcs.length; i += concurrencyLimit) {
      chunks.push(rpcs.slice(i, i + concurrencyLimit))
    }
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (rpc) => {
        try {
          const performance = await this.checkRpcHealth(rpc)
          return {
            url: rpc,
            status: performance.status,
            latency: performance.latency,
            tracking: this.detectTracking(rpc)
          }
        } catch (error) {
          return {
            url: rpc,
            status: 'offline' as const,
            latency: 0,
            tracking: 'none' as const
          }
        }
      })
      
      const chunkResults = await Promise.all(chunkPromises)
      results.push(...chunkResults)
    }
    
    return results
  }

  async getChainPerformanceMetrics(chainId: number, rpcUrls: string[]): Promise<ChainPerformanceMetrics> {
    const performanceData = await Promise.all(
      rpcUrls.map(url => this.checkRpcHealth(url))
    )
    
    const healthyRpcs = performanceData.filter(p => p.status === 'online')
    const totalRpcs = performanceData.length
    
    const averageLatency = performanceData.length > 0 
      ? performanceData.reduce((sum, p) => sum + p.latency, 0) / performanceData.length 
      : 0
    
    const averageUptime = performanceData.length > 0 
      ? performanceData.reduce((sum, p) => sum + p.uptime, 0) / performanceData.length 
      : 0
    
    const privacyScore = performanceData.length > 0 
      ? performanceData.reduce((sum, p) => sum + p.privacy, 0) / performanceData.length 
      : 0
    
    const reliabilityScore = performanceData.length > 0 
      ? performanceData.reduce((sum, p) => sum + p.reliability, 0) / performanceData.length 
      : 0
    
    return {
      averageLatency,
      averageUptime,
      totalRpcs,
      healthyRpcs: healthyRpcs.length,
      privacyScore,
      reliabilityScore,
      performanceData
    }
  }

  async getPerformanceHistory(url: string, hours: number = 24): Promise<RpcPerformanceData[]> {
    return this.performanceHistory.get(url) || []
  }

  private calculatePrivacyScore(url: string): number {
    const tracking = this.detectTracking(url)
    switch (tracking) {
      case 'none': return 100
      case 'limited': return 70
      case 'yes': return 30
      default: return 50
    }
  }

  private calculateUptime(url: string): number {
    // For now, return a default uptime score
    // In a real implementation, this would track historical uptime
    return 95
  }

  private updatePerformanceHistory(url: string, data: RpcPerformanceData): void {
    const history = this.performanceHistory.get(url) || []
    history.push(data)
    
    // Keep only last 24 hours of data
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const filteredHistory = history.filter(entry => entry.lastChecked > cutoff)
    
    this.performanceHistory.set(url, filteredHistory)
  }

  private detectTracking(url: string): 'none' | 'limited' | 'yes' {
    const hostname = new URL(url).hostname.toLowerCase()
    
    // Known privacy-focused providers
    const privacyProviders = [
      'alchemy.com',
      'infura.io',
      'ankr.com',
      'publicnode.com',
      'blastapi.io'
    ]
    
    // Providers with limited tracking
    const limitedTrackingProviders = [
      '1rpc.io',
      'llamarpc.com'
    ]
    
    if (privacyProviders.some(provider => hostname.includes(provider))) {
      return 'none'
    }
    
    if (limitedTrackingProviders.some(provider => hostname.includes(provider))) {
      return 'limited'
    }
    
    return 'yes'
  }

  private calculateScore(status: string, latency: number, privacy: number): number {
    let score = 0
    
    // Status score
    switch (status) {
      case 'online': score += 40; break
      case 'slow': score += 20; break
      case 'offline': score += 0; break
    }
    
    // Latency score (lower is better)
    if (latency < 100) score += 30
    else if (latency < 500) score += 25
    else if (latency < 1000) score += 20
    else if (latency < 5000) score += 10
    else score += 5
    
    // Privacy score
    score += (privacy / 100) * 30
    
    return Math.min(100, Math.max(0, score))
  }
}