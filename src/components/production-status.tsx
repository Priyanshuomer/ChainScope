import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useMergedChains } from '@/hooks/useChains'
import { PRODUCTION_CONFIG, ERROR_MESSAGES } from '@/lib/production-config'
import { CheckCircle, AlertTriangle, Info, Wifi, WifiOff } from 'lucide-react'

export const ProductionStatus = () => {
  const { data: chains = [], isLoading, error, isError } = useMergedChains()

  const isUsingFallback = chains.length > 0 && chains.length < 1000
  const isProductionMode = PRODUCTION_CONFIG.ENABLE_MONITORING
  const hasError = isError || error

  const getStatusIcon = () => {
    if (isLoading) return <Info className="w-4 h-4 text-blue-500" />
    if (hasError) return <AlertTriangle className="w-4 h-4 text-red-500" />
    if (isUsingFallback) return <WifiOff className="w-4 h-4 text-yellow-500" />
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

  const getStatusText = () => {
    if (isLoading) return "Loading network data..."
    if (hasError) return "API temporarily unavailable"
    if (isUsingFallback) return "Using fallback data"
    return "All systems operational"
  }

  const getStatusColor = () => {
    if (isLoading) return "bg-blue-50 border-blue-200"
    if (hasError) return "bg-red-50 border-red-200"
    if (isUsingFallback) return "bg-yellow-50 border-yellow-200"
    return "bg-green-50 border-green-200"
  }

  return (
    <div className="space-y-4">
      {/* Production Status Card */}
      <Card className={`${getStatusColor()} border-2`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            Production Status
            {isProductionMode && (
              <Badge variant="outline" className="text-xs">
                PROD
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={hasError ? "destructive" : isUsingFallback ? "secondary" : "default"}>
              {getStatusText()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Networks:</span>
            <span className="text-sm font-mono">
              {isLoading ? "..." : `${chains.length} chains`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Data Source:</span>
            <span className="text-sm">
              {isUsingFallback ? "Fallback" : "Live API"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cache:</span>
            <span className="text-sm">
              {PRODUCTION_CONFIG.CACHE_DURATION / 60000}min
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Fallback Alert */}
      {isUsingFallback && !isLoading && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {ERROR_MESSAGES.FALLBACK_ACTIVE} We're showing {chains.length} verified networks while we restore full functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {hasError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {ERROR_MESSAGES.API_UNAVAILABLE} Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Production Mode Info */}
      {isProductionMode && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {ERROR_MESSAGES.PRODUCTION_MODE}
          </AlertDescription>
        </Alert>
      )}

      {/* Performance Stats */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-600">API Timeout:</span>
              <div className="font-mono">{PRODUCTION_CONFIG.API_TIMEOUT / 1000}s</div>
            </div>
            <div>
              <span className="text-gray-600">Max Retries:</span>
              <div className="font-mono">{PRODUCTION_CONFIG.MAX_RETRIES}</div>
            </div>
            <div>
              <span className="text-gray-600">Version:</span>
              <div className="font-mono">{PRODUCTION_CONFIG.VERSION}</div>
            </div>
            <div>
              <span className="text-gray-600">Monitoring:</span>
              <div className="font-mono">{isProductionMode ? "ON" : "OFF"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
