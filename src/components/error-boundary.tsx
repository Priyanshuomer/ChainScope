import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { sanitizeError } from '@/lib/security-utils'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error securely without exposing sensitive information
    console.error('Error caught by boundary:', {
      message: sanitizeError(error),
      componentStack: errorInfo.componentStack?.split('\n').slice(0, 5).join('\n') // Limit stack trace
    })
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-gradient-card rounded-lg border border-border/50">
          <AlertTriangle className="w-12 h-12 text-warning" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
            <p className="text-muted-foreground max-w-md">
              An unexpected error occurred. This is likely a temporary issue.
            </p>
            {this.state.error && import.meta.env.VITE_NODE_ENV === 'development' && (
              <details className="text-xs text-muted-foreground mt-4">
                <summary className="cursor-pointer hover:text-foreground">Error details</summary>
                <pre className="mt-2 p-2 bg-muted rounded text-left">
                  {sanitizeError(this.state.error)}
                </pre>
              </details>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={this.handleRetry} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} variant="default" size="sm">
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional component wrapper for easier use
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
}