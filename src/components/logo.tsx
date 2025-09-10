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
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Squircle Logo Container */}
      <div
        className={`${sizeClasses[size]} 
          bg-gradient-to-br from-primary via-primary/90 to-primary/70 
          shadow-lg shadow-primary/30 flex items-center justify-center 
          relative overflow-hidden rounded-[30%]`}
      >
        {/* Inner subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 rounded-[30%]" />

        {/* Main Icon */}
        <div className="relative z-10">
          <svg
            className={`${
              size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-10 h-10'
            } text-primary-foreground`}
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="ChainScope Chain Link Logo"
            fill="currentColor"
          >
            <title>ChainScope</title>
            {/* Chain Link */}
            <path
              d="M190 190A95 95 0 1 1 190 65L160 90A60 60 0 1 0 160 165z"
              strokeWidth="2"
              stroke="currentColor"
              fill="currentColor"
            />
            {/* Star/Node */}
            <path
              d="M200 105q12 10 22 22-10 12-22 22-12-10-22-22 10-12 22-22z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Subtle glow at the corner */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizes[size]} text-foreground leading-tight`}>
            ChainScope
          </span>
          <span
            className={`${
              size === 'sm' ? 'text-xs' : 'text-xs'
            } font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent uppercase tracking-wider`}
          >
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
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} 
          bg-gradient-to-br from-primary to-primary/80 
          shadow-md shadow-primary/30 flex items-center justify-center rounded-[30%]`}
      >
        <svg
          className={`${
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-8 h-8'
          } text-primary-foreground`}
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M190 190A95 95 0 1 1 190 65L160 90A60 60 0 1 0 160 165z" />
          <path d="M200 105q12 10 22 22-10 12-22 22-12-10-22-22 10-12 22-22z" />
        </svg>
      </div>
      <span
        className={`font-bold ${
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
        } text-foreground`}
      >
        CS
      </span>
    </div>
  )
}
