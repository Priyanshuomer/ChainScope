// Security utilities for input validation and sanitization
// Enhanced with OWASP Top 10 protections

/**
 * Sanitizes search input to prevent XSS and other attacks
 */
export function sanitizeSearchInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  // Remove HTML tags and scripts
  const htmlTagsRegex = /<[^>]*>/g
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  const dangerousPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
    /onclick=/gi,
    /onmouseover=/gi,
    /eval\(/gi,
    /document\./gi,
    /window\./gi
  ]
  
  let sanitized = input
    .replace(scriptRegex, '')
    .replace(htmlTagsRegex, '')
    .trim()
    .slice(0, 500) // Limit length
  
  // Remove dangerous patterns
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })
  
  return sanitized
}

/**
 * Validates and sanitizes URLs with enhanced security
 */
export function validateUrl(url: string): boolean {
  if (typeof url !== 'string') return false
  
  try {
    const parsedUrl = new URL(url)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false
    }
    
    // Block localhost and private IP ranges
    const hostname = parsedUrl.hostname.toLowerCase()
    const blockedPatterns = [
      /^localhost$/,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^0\.0\.0\.0$/,
      /^::1$/,
      /\.local$/,
      /\.internal$/
    ]
    
    return !blockedPatterns.some(pattern => pattern.test(hostname))
  } catch {
    return false
  }
}

/**
 * Sanitizes HTML content to prevent XSS
 */
export function sanitizeHtml(content: string): string {
  if (typeof content !== 'string') return ''
  
  // Enhanced HTML sanitization
  const dangerousElements = /<(script|iframe|object|embed|form|input|textarea|button|link|style|meta|base)[^>]*>.*?<\/\1>/gi
  const dangerousAttributes = /(on\w+|javascript:|vbscript:|data:text\/html|data:text\/javascript)/gi
  const dangerousProtocols = /(javascript|vbscript|data|file):/gi
  
  return content
    .replace(dangerousElements, '')
    .replace(dangerousAttributes, '')
    .replace(dangerousProtocols, '')
    .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
}

/**
 * Enhanced URL validation with security checks for RPC endpoints
 */
export function validateRpcUrl(url: string): boolean {
  if (!validateUrl(url)) return false
  
  try {
    const parsedUrl = new URL(url)
    
    // Block suspicious patterns
    const suspiciousPatterns = [
      /localhost/i,
      /127\.0\.0\.1/,
      /0\.0\.0\.0/,
      /\.local/i,
      /internal/i,
      /admin/i,
      /test/i,
      /dev/i
    ]
    
    // Allow known public RPC providers
    const allowedDomains = [
      'infura.io',
      'alchemy.com',
      'alchemyapi.io', 
      'ankr.com',
      'publicnode.com',
      'blastapi.io',
      'llamarpc.com',
      'rpc.ankr.com',
      '1rpc.io',
      'ethereum-rpc.publicnode.com',
      'polygon-rpc.com',
      'bsc-dataseed.binance.org'
    ]
    
    const hostname = parsedUrl.hostname.toLowerCase()
    
    // Check if it's a known provider
    const isKnownProvider = allowedDomains.some(domain => hostname.includes(domain))
    if (isKnownProvider) return true
    
    // Block suspicious patterns for unknown providers
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(hostname))
    if (hasSuspiciousPattern) return false
    
    return true
  } catch {
    return false
  }
}

/**
 * Rate limiting helper for API calls with enhanced security
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private blockedIPs: Map<string, number> = new Map()

  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000, // 1 minute
    private blockDuration: number = 300000 // 5 minutes
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now()
    
    // Check if IP is blocked
    const blockedUntil = this.blockedIPs.get(key)
    if (blockedUntil && now < blockedUntil) {
      return false
    }
    
    // Remove expired block
    if (blockedUntil && now >= blockedUntil) {
      this.blockedIPs.delete(key)
    }
    
    // Get existing requests
    const requests = this.requests.get(key) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    // Check if limit exceeded
    if (validRequests.length >= this.maxRequests) {
      // Block for blockDuration
      this.blockedIPs.set(key, now + this.blockDuration)
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(key, validRequests)
    
    return true
  }

  reset(key?: string): void {
    if (key) {
      this.requests.delete(key)
      this.blockedIPs.delete(key)
    } else {
      this.requests.clear()
      this.blockedIPs.clear()
    }
  }
}

/**
 * CSRF Protection Token Generator
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate CSRF Token
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false
  return token === storedToken
}

/**
 * Content Security Policy Headers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https: wss:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
}

/**
 * Security Headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  ...CSP_HEADERS
}

/**
 * Sanitize error messages to prevent information disclosure
 */
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // In production, don't expose stack traces
    if (import.meta.env.NODE_ENV === 'production') {
      return 'An error occurred. Please try again later.'
    }
    return error.message
  }
  return 'An unknown error occurred'
}

/**
 * Input validation for chain IDs
 */
export function validateChainId(chainId: unknown): boolean {
  if (typeof chainId !== 'number') return false
  return Number.isInteger(chainId) && chainId > 0 && chainId <= 2147483647
}

/**
 * Input validation for search queries
 */
export function validateSearchQuery(query: unknown): boolean {
  if (typeof query !== 'string') return false
  const sanitized = sanitizeSearchInput(query)
  return sanitized.length >= 1 && sanitized.length <= 100
}