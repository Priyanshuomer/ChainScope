import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

interface ErrorFallbackProps {
  error?: Error | null
  resetError?: () => void
  message?: string
  showRetry?: boolean
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  message = "Something went wrong",
  showRetry = true 
}) => {
  const isDevelopment = import.meta.env.DEV

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gradient-card border-border/50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-destructive/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-foreground">
            {message}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We encountered an issue while loading this content. Please try again.
          </p>
          
          {isDevelopment && error && (
            <details className="mt-4 p-3 bg-secondary/50 rounded-lg border border-border">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs text-destructive whitespace-pre-wrap break-words">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col gap-2">
            {showRetry && resetError && (
              <Button 
                onClick={resetError} 
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button 
              asChild
              variant="outline" 
              className="w-full"
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Network error specific fallback
export const NetworkErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorFallback
    message="Network Connection Error"
    resetError={onRetry}
    showRetry={!!onRetry}
  />
)

// Data loading error fallback
export const DataErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorFallback
    message="Failed to Load Data"
    resetError={onRetry}
    showRetry={!!onRetry}
  />
)