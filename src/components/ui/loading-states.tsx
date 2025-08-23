import React from 'react'
import { Loader2, Activity, Globe, Database } from 'lucide-react'
import { SkeletonCard, SkeletonList, SkeletonChart } from './skeleton'
import { Card, CardContent } from './card'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    </div>
  )
}

export const ChainListLoadingState: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center py-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="animate-pulse w-3 h-3 bg-primary rounded-full"></div>
        <p className="text-muted-foreground">
          Fetching live blockchain data from multiple APIs...
        </p>
      </div>
      <p className="text-sm text-muted-foreground/70">
        ChainList • GitHub • Ethereum Lists
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
)

export const ChainDetailLoadingState: React.FC = () => (
  <div className="space-y-8">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-muted/30 rounded-xl animate-pulse" />
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted/30 rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonChart />
        <SkeletonList />
      </div>
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
)

export const DashboardLoadingState: React.FC = () => (
  <div className="space-y-8">
    <div className="text-center space-y-4">
      <div className="h-8 w-64 bg-muted/30 rounded mx-auto animate-pulse" />
      <div className="h-4 w-96 bg-muted/30 rounded mx-auto animate-pulse" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-6 bg-gradient-card border-border/50">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-muted/30 rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-muted/30 rounded animate-pulse" />
            <div className="h-3 w-20 bg-muted/30 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

interface FullPageLoadingProps {
  message?: string
  icon?: React.ComponentType<{ className?: string }>
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
  message = "Loading ChainScope...",
  icon: Icon = Globe
}) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse-glow">
        <Icon className="w-10 h-10 text-primary-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-sf-pro-display font-bold text-foreground">
          {message}
        </h2>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  </div>
)

// Network status loading indicator
export const NetworkStatusLoading: React.FC = () => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Activity className="w-4 h-4 animate-pulse" />
    <span>Checking network status...</span>
  </div>
)

// RPC testing loading indicator
export const RpcTestingLoading: React.FC = () => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Database className="w-4 h-4 animate-spin" />
    <span>Testing RPC endpoints...</span>
  </div>
)