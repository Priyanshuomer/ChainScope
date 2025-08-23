// Global spacing and layout fixes
import { cn } from "@/lib/utils"

interface LayoutContainerProps {
  children: React.ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

export function LayoutContainer({ children, className, spacing = 'md' }: LayoutContainerProps) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6', 
    lg: 'space-y-8',
    xl: 'space-y-12'
  }

  return (
    <div className={cn(
      'w-full',
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  )
}

interface GridContainerProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

export function GridContainer({ children, className, cols = 1, gap = 'md' }: GridContainerProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  return (
    <div className={cn(
      'grid',
      gridClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  title?: string
}

export function Section({ children, className, id, title }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'w-full py-8 first:pt-0 last:pb-0',
        className
      )}
    >
      {title && (
        <h2 className="text-2xl font-bold text-foreground mb-6 font-sf-pro-display">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}