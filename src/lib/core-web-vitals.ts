// Enhanced Core Web Vitals tracking for SEO optimization
// Implements all Google's Core Web Vitals metrics with advanced analytics

export interface WebVitalMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
  value: number
  delta: number
  rating: 'good' | 'needs-improvement' | 'poor'
  id: string
  navigationType: string
  entries: PerformanceEntry[]
}

export interface WebVitalsConfig {
  reportAllChanges?: boolean
  threshold?: {
    CLS: number
    FID: number
    FCP: number
    LCP: number
    TTFB: number
    INP: number
  }
  debug?: boolean
}

class CoreWebVitals {
  private config: WebVitalsConfig
  private metrics: Map<string, WebVitalMetric> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()
  
  constructor(config: WebVitalsConfig = {}) {
    this.config = {
      reportAllChanges: false,
      threshold: {
        CLS: 0.1,
        FID: 100,
        FCP: 1800,
        LCP: 2500,
        TTFB: 800,
        INP: 200
      },
      debug: false,
      ...config
    }
    
    this.initializeTracking()
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return

    // Track First Contentful Paint (FCP)
    this.trackFCP()
    
    // Track Largest Contentful Paint (LCP)
    this.trackLCP()
    
    // Track Cumulative Layout Shift (CLS)
    this.trackCLS()
    
    // Track First Input Delay (FID)
    this.trackFID()
    
    // Track Interaction to Next Paint (INP)
    this.trackINP()
    
    // Track Time to First Byte (TTFB)
    this.trackTTFB()
    
    // Track navigation performance
    this.trackNavigationTiming()
  }

  private trackFCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      
      if (fcpEntry) {
        this.reportMetric({
          name: 'FCP',
          value: fcpEntry.startTime,
          delta: fcpEntry.startTime,
          rating: this.getRating('FCP', fcpEntry.startTime),
          id: this.generateId(),
          navigationType: this.getNavigationType(),
          entries: [fcpEntry]
        })
      }
    })
    
    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['paint'] })
      this.observers.set('FCP', observer)
    }
  }

  private trackLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      if (lastEntry) {
        this.reportMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          delta: lastEntry.startTime,
          rating: this.getRating('LCP', lastEntry.startTime),
          id: this.generateId(),
          navigationType: this.getNavigationType(),
          entries: [lastEntry]
        })
      }
    })
    
    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.set('LCP', observer)
    }
  }

  private trackCLS(): void {
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEntry[]
      
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      
      this.reportMetric({
        name: 'CLS',
        value: clsValue,
        delta: clsValue,
        rating: this.getRating('CLS', clsValue),
        id: this.generateId(),
        navigationType: this.getNavigationType(),
        entries: entries
      })
    })
    
    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.set('CLS', observer)
    }
  }

  private trackFID(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const firstInput = entries[0]
      
      if (firstInput) {
        const fidValue = firstInput.processingStart - firstInput.startTime
        
        this.reportMetric({
          name: 'FID',
          value: fidValue,
          delta: fidValue,
          rating: this.getRating('FID', fidValue),
          id: this.generateId(),
          navigationType: this.getNavigationType(),
          entries: [firstInput]
        })
      }
    })
    
    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.set('FID', observer)
    }
  }

  private trackINP(): void {
    let maxDelay = 0
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      for (const entry of entries) {
        const delay = entry.processingStart - entry.startTime
        if (delay > maxDelay) {
          maxDelay = delay
          
          this.reportMetric({
            name: 'INP',
            value: delay,
            delta: delay,
            rating: this.getRating('INP', delay),
            id: this.generateId(),
            navigationType: this.getNavigationType(),
            entries: [entry]
          })
        }
      }
    })
    
    if ('PerformanceObserver' in window) {
      try {
        observer.observe({ entryTypes: ['event'] })
        this.observers.set('INP', observer)
      } catch (e) {
        // Event timing not supported in all browsers
        if (this.config.debug) {
          console.warn('Event timing not supported for INP tracking')
        }
      }
    }
  }

  private trackTTFB(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.fetchStart
      
      this.reportMetric({
        name: 'TTFB',
        value: ttfb,
        delta: ttfb,
        rating: this.getRating('TTFB', ttfb),
        id: this.generateId(),
        navigationType: this.getNavigationType(),
        entries: [navigation]
      })
    }
  }

  private trackNavigationTiming(): void {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing
      const navigationStart = timing.navigationStart
      
      // Additional performance metrics for comprehensive SEO analysis
      const metrics = {
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnect: timing.connectEnd - timing.connectStart,
        serverResponse: timing.responseEnd - timing.requestStart,
        domProcessing: timing.domComplete - timing.domLoading,
        pageLoad: timing.loadEventEnd - navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - navigationStart
      }
      
      // Report to analytics
      if (this.config.debug) {
        console.log('Navigation Timing Metrics:', metrics)
      }
      
      // Send to analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        Object.entries(metrics).forEach(([name, value]) => {
          window.gtag('event', 'timing_complete', {
            name: name,
            value: Math.round(value),
            custom_parameter_1: 'core_web_vitals'
          })
        })
      }
    }
  }

  private getRating(metric: WebVitalMetric['name'], value: number): WebVitalMetric['rating'] {
    const thresholds = this.config.threshold!
    
    switch (metric) {
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
      case 'FCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
      case 'TTFB':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
      case 'INP':
        return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor'
      default:
        return 'good'
    }
  }

  private getNavigationType(): string {
    if ('performance' in window && 'navigation' in performance) {
      const nav = performance.navigation
      switch (nav.type) {
        case 0: return 'navigate'
        case 1: return 'reload'
        case 2: return 'back_forward'
        default: return 'navigate'
      }
    }
    return 'navigate'
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private reportMetric(metric: WebVitalMetric): void {
    // Store metric
    this.metrics.set(metric.name, metric)
    
    // Debug logging
    if (this.config.debug) {
      console.log(`Core Web Vital - ${metric.name}:`, {
        value: Math.round(metric.value),
        rating: metric.rating,
        navigationType: metric.navigationType
      })
    }
    
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        custom_parameter_1: metric.rating,
        custom_parameter_2: metric.navigationType
      })
    }
    
    // Send to custom analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Core Web Vital', {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        navigationType: metric.navigationType
      })
    }
    
    // Trigger custom event for additional tracking
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('webvital', {
        detail: metric
      }))
    }
  }

  // Public methods
  public getMetrics(): Map<string, WebVitalMetric> {
    return new Map(this.metrics)
  }

  public getMetric(name: WebVitalMetric['name']): WebVitalMetric | undefined {
    return this.metrics.get(name)
  }

  public getAllRatings(): Record<string, WebVitalMetric['rating']> {
    const ratings: Record<string, WebVitalMetric['rating']> = {}
    this.metrics.forEach((metric, name) => {
      ratings[name] = metric.rating
    })
    return ratings
  }

  public getOverallScore(): number {
    const ratings = this.getAllRatings()
    const total = Object.keys(ratings).length
    
    if (total === 0) return 0
    
    const score = Object.values(ratings).reduce((sum, rating) => {
      switch (rating) {
        case 'good': return sum + 100
        case 'needs-improvement': return sum + 50
        case 'poor': return sum + 0
        default: return sum
      }
    }, 0)
    
    return Math.round(score / total)
  }

  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }
}

// Export singleton instance
export const coreWebVitals = new CoreWebVitals({
  reportAllChanges: false,
  debug: import.meta.env.NODE_ENV === 'development'
})

// Initialize on page load
if (typeof window !== 'undefined') {
  // Report final metrics when page is about to unload
  window.addEventListener('beforeunload', () => {
    const metrics = coreWebVitals.getMetrics()
    const overallScore = coreWebVitals.getOverallScore()
    
    // Send beacon with final metrics
    if (navigator.sendBeacon && metrics.size > 0) {
      const data = JSON.stringify({
        metrics: Array.from(metrics.entries()),
        overallScore,
        timestamp: Date.now(),
        url: window.location.href
      })
      
      navigator.sendBeacon('/api/web-vitals', data)
    }
  })
  
  // Report metrics when page becomes hidden
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const overallScore = coreWebVitals.getOverallScore()
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals_score', {
          event_category: 'Performance',
          value: overallScore,
          custom_parameter_1: window.location.pathname
        })
      }
    }
  })
}

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    analytics?: {
      track: (event: string, properties: Record<string, any>) => void
    }
  }
}

export default coreWebVitals