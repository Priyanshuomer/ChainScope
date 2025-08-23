/**
 * Redirect Handler Component
 * Handles 301 redirects from legacy chain ID URLs to semantic URLs
 * This is crucial for SEO to maintain link equity and improve user experience
 */

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hasSemanticMapping, getSemanticUrl } from '@/lib/url-mapping'

interface RedirectHandlerProps {
  redirectType?: 'replace' | 'push'
}

export function RedirectHandler({ redirectType = 'replace' }: RedirectHandlerProps) {
  const { chainId } = useParams<{ chainId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (chainId) {
      const numericChainId = parseInt(chainId)
      
      // Check if this chain has a semantic URL mapping
      if (hasSemanticMapping(numericChainId)) {
        const semanticUrl = getSemanticUrl(numericChainId)
        
        // Perform 301 redirect (replace in history for SEO)
        navigate(semanticUrl, { replace: redirectType === 'replace' })
        
        // Track redirect for analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'url_redirect', {
            event_category: 'SEO',
            event_label: `chain_id_${chainId}_to_${semanticUrl}`,
            value: 1
          })
        }
      }
    }
  }, [chainId, navigate, redirectType])

  // This component doesn't render anything
  return null
}

/**
 * HOC for handling redirects in route components
 */
export function withRedirect<T extends object>(Component: React.ComponentType<T>) {
  return function RedirectWrappedComponent(props: T) {
    return (
      <>
        <RedirectHandler />
        <Component {...props} />
      </>
    )
  }
}

/**
 * Bulk redirect configuration for server-side rendering or static generation
 * This can be used by build tools to generate redirect rules
 */
export function generateRedirectRules() {
  const { NETWORK_SLUG_MAPPINGS } = require('@/lib/url-mapping')
  
  return NETWORK_SLUG_MAPPINGS.map((mapping: any) => ({
    source: `/chain/${mapping.chainId}`,
    destination: `/network/${mapping.slug}`,
    permanent: true, // 301 redirect
    statusCode: 301
  }))
}

/**
 * Netlify redirects format
 */
export function generateNetlifyRedirects(): string {
  const { NETWORK_SLUG_MAPPINGS } = require('@/lib/url-mapping')
  
  const redirects = NETWORK_SLUG_MAPPINGS.map((mapping: any) => 
    `/chain/${mapping.chainId} /network/${mapping.slug} 301!`
  ).join('\n')
  
  return redirects
}

/**
 * Apache .htaccess redirects format
 */
export function generateApacheRedirects(): string {
  const { NETWORK_SLUG_MAPPINGS } = require('@/lib/url-mapping')
  
  let htaccess = 'RewriteEngine On\n'
  htaccess += NETWORK_SLUG_MAPPINGS.map((mapping: any) => 
    `RewriteRule ^chain/${mapping.chainId}/?$ /network/${mapping.slug} [R=301,L]`
  ).join('\n')
  
  return htaccess
}

/**
 * Nginx redirects format
 */
export function generateNginxRedirects(): string {
  const { NETWORK_SLUG_MAPPINGS } = require('@/lib/url-mapping')
  
  return NETWORK_SLUG_MAPPINGS.map((mapping: any) => 
    `rewrite ^/chain/${mapping.chainId}/?$ /network/${mapping.slug} permanent;`
  ).join('\n')
}