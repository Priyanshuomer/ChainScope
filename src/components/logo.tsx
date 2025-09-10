import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-primary via-primary/90 to-primary/70 
        flex items-center justify-center relative overflow-hidden rounded-none`} // changed
      >
        {/* Network Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
        
        {/* Main Icon */}
        <div className="relative z-10">
          <svg 
            className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} text-primary-foreground`}
            viewBox="0 0 256 256" 
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="ChainScope Chain Link Logo"
            fill="currentColor"
          >
            <title>ChainScope</title>
            <path d="M190 190A95 95 0 1 1 190 65L160 90A60 60 0 1 0 160 165z" strokeWidth="2" stroke="currentColor" fill="currentColor"/>
            <path d="M200 105q12 10 22 22-10 12-22 22-12-10-22-22 10-12 22-22z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex items-center gap-2">
          <span className={`font-bold ${textSizes[size]} text-foreground`}>
            ChainScope
          </span>
          <span className={`${size === 'sm' ? 'text-xs' : 'text-xs'} font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent uppercase tracking-wider`}>
            BETA
          </span>
        </div>
      )}
    </div>
  )
}

// Compact version for small spaces
export const LogoCompact: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-primary/80 
        flex items-center justify-center rounded-none`} // changed
      >
        <svg 
          className={`${size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-primary-foreground`}
          viewBox="0 0 256 256" 
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M190 190A95 95 0 1 1 190 65L160 90A60 60 0 1 0 160 165z" strokeWidth="3" stroke="currentColor"/>
          <path d="M200 105q12 10 22 22-10 12-22 22-12-10-22-22 10-12 22-22z"/>
        </svg>
      </div>
      <span className={`font-bold ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'} text-foreground`}>
        CS
      </span>
    </div>
  )
}
