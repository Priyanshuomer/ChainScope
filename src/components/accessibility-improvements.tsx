import React, { useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Focus management hook
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLDivElement>(null)

  const focusFirstElement = () => {
    if (focusRef.current) {
      const focusableElements = focusRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
  }

  const focusLastElement = () => {
    if (focusRef.current) {
      const focusableElements = focusRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[focusableElements.length - 1] as HTMLElement).focus()
      }
    }
  }

  return { focusRef, focusFirstElement, focusLastElement }
}

// Skip to content link
export const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
  >
    Skip to main content
  </a>
)

// Accessible card component
export const AccessibleCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Card> & {
    role?: string
    'aria-label'?: string
    'aria-describedby'?: string
  }
>(({ className, role = "article", ...props }, ref) => (
  <Card
    ref={ref}
    role={role}
    className={cn("focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2", className)}
    tabIndex={0}
    {...props}
  />
))

AccessibleCard.displayName = 'AccessibleCard'

// Accessible button with proper ARIA labels
export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    'aria-label'?: string
    'aria-describedby'?: string
    'aria-expanded'?: boolean
    'aria-pressed'?: boolean
  }
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn("focus:ring-2 focus:ring-primary focus:ring-offset-2", className)}
    {...props}
  >
    {children}
  </Button>
))

AccessibleButton.displayName = 'AccessibleButton'

// Accessible badge component
export const AccessibleBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Badge> & {
    'aria-label'?: string
  }
>(({ className, children, ...props }, ref) => (
  <Badge
    ref={ref}
    className={cn("focus:ring-2 focus:ring-primary focus:ring-offset-2", className)}
    {...props}
  >
    {children}
  </Badge>
))

AccessibleBadge.displayName = 'AccessibleBadge'

// Keyboard navigation hook
export const useKeyboardNavigation = (
  items: any[],
  onSelect: (item: any, index: number) => void
) => {
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        )
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          onSelect(items[focusedIndex], focusedIndex)
        }
        break
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setFocusedIndex(items.length - 1)
        break
    }
  }

  useEffect(() => {
    if (focusedIndex >= 0 && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll('[tabindex="0"]')
      if (focusableElements[focusedIndex]) {
        (focusableElements[focusedIndex] as HTMLElement).focus()
      }
    }
  }, [focusedIndex])

  return { containerRef, handleKeyDown, focusedIndex, setFocusedIndex }
}

// Screen reader only text
export const ScreenReaderOnly = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)

// Live region for announcements
export const LiveRegion = ({ 
  children, 
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = true 
}: { 
  children: React.ReactNode
  'aria-live'?: 'polite' | 'assertive' | 'off'
  'aria-atomic'?: boolean
}) => (
  <div
    aria-live={ariaLive}
    aria-atomic={ariaAtomic}
    className="sr-only"
  >
    {children}
  </div>
)

// Accessible loading state
export const AccessibleLoading = ({ 
  message = "Loading content...",
  'aria-label': ariaLabel 
}: { 
  message?: string
  'aria-label'?: string 
}) => (
  <div
    role="status"
    aria-label={ariaLabel || message}
    aria-live="polite"
    className="flex items-center gap-2"
  >
    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    <span className="sr-only">{message}</span>
  </div>
)

// Accessible error state
export const AccessibleError = ({ 
  message,
  'aria-label': ariaLabel 
}: { 
  message: string
  'aria-label'?: string 
}) => (
  <div
    role="alert"
    aria-label={ariaLabel || `Error: ${message}`}
    className="text-destructive"
  >
    {message}
  </div>
)

// Accessible success state
export const AccessibleSuccess = ({ 
  message,
  'aria-label': ariaLabel 
}: { 
  message: string
  'aria-label'?: string 
}) => (
  <div
    role="status"
    aria-label={ariaLabel || `Success: ${message}`}
    aria-live="polite"
    className="text-success"
  >
    {message}
  </div>
)

// Accessible list component
export const AccessibleList = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'> & {
    'aria-label'?: string
    'aria-describedby'?: string
  }
>(({ className, children, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("focus:outline-none", className)}
    {...props}
  >
    {children}
  </ul>
))

AccessibleList.displayName = 'AccessibleList'

// Accessible list item component
export const AccessibleListItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'> & {
    'aria-label'?: string
    'aria-describedby'?: string
  }
>(({ className, children, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", className)}
    tabIndex={0}
    {...props}
  >
    {children}
  </li>
))

AccessibleListItem.displayName = 'AccessibleListItem'

// Accessible search input
export const AccessibleSearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    'aria-label'?: string
    'aria-describedby'?: string
    'aria-expanded'?: boolean
    'aria-autocomplete'?: 'list' | 'none' | 'both'
    'aria-controls'?: string
  }
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="search"
    className={cn(
      "focus:ring-2 focus:ring-primary focus:ring-offset-2",
      className
    )}
    {...props}
  />
))

AccessibleSearchInput.displayName = 'AccessibleSearchInput'

// Accessible navigation component
export const AccessibleNavigation = React.forwardRef<
  HTMLElement,
  React.ComponentProps<'nav'> & {
    'aria-label'?: string
    'aria-describedby'?: string
  }
>(({ className, children, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("focus:outline-none", className)}
    {...props}
  >
    {children}
  </nav>
))

AccessibleNavigation.displayName = 'AccessibleNavigation'

// Accessible heading component
export const AccessibleHeading = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> & {
    level: 1 | 2 | 3 | 4 | 5 | 6
    'aria-label'?: string
  }
>(({ level, className, children, ...props }, ref) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  return (
    <Component
      ref={ref}
      className={cn("focus:outline-none", className)}
      {...props}
    >
      {children}
    </Component>
  )
})

AccessibleHeading.displayName = 'AccessibleHeading'

// Accessible link component
export const AccessibleLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    'aria-label'?: string
    'aria-describedby'?: string
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'
  }
>(({ className, children, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none",
      className
    )}
    {...props}
  >
    {children}
  </a>
))

AccessibleLink.displayName = 'AccessibleLink'

// Accessibility context provider
export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [announcements, setAnnouncements] = React.useState<string[]>([])

  const announce = React.useCallback((message: string) => {
    setAnnouncements(prev => [...prev, message])
    // Clear announcement after 3 seconds
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a !== message))
    }, 3000)
  }, [])

  return (
    <div>
      {children}
      <LiveRegion aria-live="polite" aria-atomic="false">
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </LiveRegion>
    </div>
  )
} 