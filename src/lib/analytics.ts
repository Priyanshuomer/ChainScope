// Analytics and monitoring system for ChainScope
// Supports multiple analytics providers and error tracking

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  metadata?: Record<string, any>
}

export interface ErrorEvent {
  message: string
  stack?: string
  component?: string
  userId?: string
  sessionId?: string
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class Analytics {
  private static instance: Analytics
  private sessionId: string
  private userId?: string
  private events: AnalyticsEvent[] = []
  private performanceMetrics: PerformanceMetric[] = []
  private errorEvents: ErrorEvent[] = []
  private isInitialized = false
  private gaMeasurementId: string

  private constructor() {
    this.sessionId = this.generateSessionId()
    // Get GA Measurement ID from environment or use placeholder
    this.gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID'
    this.initializeAnalytics()
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeAnalytics(): void {
    // Check if analytics is enabled via environment variable
    const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
    
    // Initialize Google Analytics if available and enabled
    if (typeof window !== 'undefined' && window.gtag && this.gaMeasurementId !== 'GA_MEASUREMENT_ID' && enableAnalytics) {
      this.isInitialized = true
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        console.log('📊 Analytics initialized with Google Analytics')
      }
    } else if (typeof window !== 'undefined') {
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        if (!enableAnalytics) {
          console.log('📊 Analytics disabled via environment variable')
        } else if (this.gaMeasurementId === 'GA_MEASUREMENT_ID') {
          console.log('📊 Analytics initialized (Google Analytics Measurement ID not configured)')
        } else {
          console.log('📊 Analytics initialized (Google Analytics not available)')
        }
      }
    }

    // Track page views only if analytics is enabled
    if (enableAnalytics) {
      this.trackPageView(window.location.pathname)
    }
  }

  // Page View Tracking
  trackPageView(page: string, title?: string): void {
    const event: AnalyticsEvent = {
      name: 'page_view',
      properties: {
        page,
        title: title || document.title,
        referrer: document.referrer
      },
      timestamp: Date.now(),
      sessionId: this.sessionId
    }

    this.trackEvent(event)

    // Google Analytics
    if (window.gtag && this.gaMeasurementId !== 'GA_MEASUREMENT_ID') {
      window.gtag('config', this.gaMeasurementId, {
        page_path: page,
        page_title: title || document.title
      })
    }
  }

  // Event Tracking
  trackEvent(event: AnalyticsEvent): void {
    event.timestamp = event.timestamp || Date.now()
    event.sessionId = event.sessionId || this.sessionId
    event.userId = event.userId || this.userId

    this.events.push(event)

    // Google Analytics
    if (window.gtag && this.gaMeasurementId !== 'GA_MEASUREMENT_ID') {
      window.gtag('event', event.name, event.properties)
    }

    // Log in development
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event)
    }
  }

  // Custom Events
  trackChainView(chainId: number, chainName: string): void {
    this.trackEvent({
      name: 'chain_view',
      properties: {
        chain_id: chainId,
        chain_name: chainName
      }
    })
  }

  trackSearch(query: string, resultsCount: number): void {
    this.trackEvent({
      name: 'search',
      properties: {
        query: query.substring(0, 100), // Limit query length
        results_count: resultsCount
      }
    })
  }

  trackRpcCopy(chainId: number, rpcUrl: string): void {
    this.trackEvent({
      name: 'rpc_copy',
      properties: {
        chain_id: chainId,
        rpc_domain: new URL(rpcUrl).hostname
      }
    })
  }

  trackWalletConnect(chainId: number, walletType: string): void {
    this.trackEvent({
      name: 'wallet_connect',
      properties: {
        chain_id: chainId,
        wallet_type: walletType
      }
    })
  }

  // Performance Tracking
  trackPerformance(metric: PerformanceMetric): void {
    metric.timestamp = metric.timestamp || Date.now()
    this.performanceMetrics.push(metric)

    // Web Vitals
    if (window.gtag && this.gaMeasurementId !== 'GA_MEASUREMENT_ID') {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        non_interaction: true
      })
    }
  }

  // Error Tracking
  trackError(error: Error, component?: string, severity: ErrorEvent['severity'] = 'medium'): void {
    const errorEvent: ErrorEvent = {
      message: error.message,
      stack: error.stack,
      component,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      severity
    }

    this.errorEvents.push(errorEvent)

    // Google Analytics
    if (window.gtag && this.gaMeasurementId !== 'GA_MEASUREMENT_ID') {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: severity === 'critical'
      })
    }

    // Log in development (only if verbose logging is enabled)
    if (import.meta.env.VITE_NODE_ENV === 'development' && import.meta.env.VITE_VERBOSE_LOGGING === 'true') {
      console.error('🚨 Error Tracked:', errorEvent)
    }
  }

  // User Identification
  setUserId(userId: string): void {
    this.userId = userId
    
    // Google Analytics
    if (window.gtag && this.gaMeasurementId !== 'GA_MEASUREMENT_ID') {
      window.gtag('config', this.gaMeasurementId, {
        user_id: userId
      })
    }
  }

  // Get Analytics Data
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics]
  }

  getErrorEvents(): ErrorEvent[] {
    return [...this.errorEvents]
  }

  // Export data for external analytics
  exportData(): {
    events: AnalyticsEvent[]
    performance: PerformanceMetric[]
    errors: ErrorEvent[]
    sessionId: string
    userId?: string
  } {
    return {
      events: this.events,
      performance: this.performanceMetrics,
      errors: this.errorEvents,
      sessionId: this.sessionId,
      userId: this.userId
    }
  }

  // Clear data (for privacy)
  clearData(): void {
    this.events = []
    this.performanceMetrics = []
    this.errorEvents = []
  }

  // Check if Google Analytics is properly configured
  isGoogleAnalyticsConfigured(): boolean {
    return this.gaMeasurementId !== 'GA_MEASUREMENT_ID' && typeof window !== 'undefined' && !!window.gtag
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private analytics = Analytics.getInstance()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Track page load performance
  trackPageLoad(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        this.analytics.trackPerformance({
          name: 'page_load_time',
          value: navigation.loadEventEnd - navigation.loadEventStart,
          unit: 'ms',
          timestamp: Date.now()
        })

        this.analytics.trackPerformance({
          name: 'dom_content_loaded',
          value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          unit: 'ms',
          timestamp: Date.now()
        })
      }
    }
  }

  // Track API response times
  trackApiCall(endpoint: string, duration: number, success: boolean): void {
    this.analytics.trackPerformance({
      name: 'api_call',
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      metadata: {
        endpoint,
        success
      }
    })
  }

  // Track component render times
  trackComponentRender(componentName: string, renderTime: number): void {
    this.analytics.trackPerformance({
      name: 'component_render',
      value: renderTime,
      unit: 'ms',
      timestamp: Date.now(),
      metadata: {
        component: componentName
      }
    })
  }
}

// Error monitoring
export class ErrorMonitor {
  private static instance: ErrorMonitor
  private analytics = Analytics.getInstance()

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  // Initialize global error handlers
  initialize(): void {
    if (typeof window !== 'undefined') {
      // Global error handler
      window.addEventListener('error', (event) => {
        this.analytics.trackError(event.error, 'global', 'high')
      })

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.analytics.trackError(
          new Error(event.reason?.message || 'Unhandled Promise Rejection'),
          'global',
          'high'
        )
      })
    }
  }

  // Track React errors
  trackReactError(error: Error, errorInfo: any): void {
    this.analytics.trackError(error, 'react', 'medium')
  }
}

// Export singleton instances
export const analytics = Analytics.getInstance()
export const performanceMonitor = PerformanceMonitor.getInstance()
export const errorMonitor = ErrorMonitor.getInstance()

// Initialize error monitoring
if (typeof window !== 'undefined') {
  errorMonitor.initialize()
}

// Declare global types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
} 