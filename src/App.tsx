import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from '@/components/error-boundary'
import { Layout } from '@/components/layout'
import { ScrollToTop } from '@/components/scroll-to-top'
import { analytics, performanceMonitor } from '@/lib/analytics'
import { config } from '@/lib/wallet-config'

// Lazy load pages for better performance
const Index = React.lazy(() => import('./pages/Index'))
const ChainDetail = React.lazy(() => import('./pages/ChainDetail'))
const Compare = React.lazy(() => import('./pages/Compare'))
const Privacy = React.lazy(() => import('./pages/Privacy'))
const Terms = React.lazy(() => import('./pages/Terms'))
const Cookies = React.lazy(() => import('./pages/Cookies'))
const Disclaimer = React.lazy(() => import('./pages/Disclaimer'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

// Configure React Query for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
})

// Register service worker for offline support
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.VITE_NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully:', registration)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

function App() {
  useEffect(() => {
    // Track initial page load performance
    const startTime = performance.now()
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime
      performanceMonitor.trackPageLoad()
      analytics.trackPageView(window.location.pathname)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <ScrollToTop />
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      
                      {/* Semantic URL Routes (Primary) */}
                      <Route path="/network/:slug" element={<ChainDetail />} />
                      
                      {/* Legacy Chain ID Routes (with redirects) */}
                      <Route path="/chain/:chainId" element={<ChainDetail />} />
                      
                      {/* Category Pages for SEO */}
                      <Route path="/networks" element={<Index />} />
                      <Route path="/layer1-networks" element={<Index />} />
                      <Route path="/layer2-networks" element={<Index />} />
                      <Route path="/testnets" element={<Index />} />
                      <Route path="/sidechains" element={<Index />} />
                      <Route path="/rollups" element={<Index />} />
                      
                      {/* Other Routes */}
                      <Route path="/compare" element={<Compare />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/cookies" element={<Cookies />} />
                      <Route path="/disclaimer" element={<Disclaimer />} />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
