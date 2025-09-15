import React, { useState, useCallback, useMemo, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, TrendingUp, Clock } from "lucide-react"
import { analytics } from "@/lib/analytics"
import { MergedChainData } from "@/types/chain"

interface AdvancedSearchProps {
  chains?: MergedChainData[]
  onSearch: (query: string, filters: string[]) => void
  onClear: () => void
  placeholder?: string
  className?: string
}

const SUGGESTED_TAGS = [
  'Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Avalanche', 'BNB Chain',
  'L2', 'Mainnet', 'Testnet', 'Verified', 'EVM', 'RPC', 'Bridge', 'Privacy'
]

const POPULAR_SEARCHES = [
  'Ethereum Mainnet',
  'Polygon',
  'Arbitrum One',
  'Optimism',
  'Base',
  'BNB Smart Chain',
  'Avalanche C-Chain'
]

export const AdvancedSearch = ({ 
  chains = [],
  onSearch, 
  onClear, 
  placeholder = "Search networks by name, symbol, chain ID...",
  className = "" 
}: AdvancedSearchProps) => {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Generate search suggestions based on current query
  const searchSuggestions = useMemo(() => {
    if (!query.trim() || chains.length === 0) return []
    
    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()
    
    chains.forEach(chain => {
      // Name matches
      if (chain.name.toLowerCase().includes(queryLower)) {
        suggestions.add(chain.name)
      }
      
      // Symbol matches
      if (chain.shortName.toLowerCase().includes(queryLower)) {
        suggestions.add(`${chain.name} (${chain.shortName.toUpperCase()})`)
      }
      
      // Chain ID matches
      if (chain.chainId.toString().includes(query)) {
        suggestions.add(`${chain.name} (Chain ID: ${chain.chainId})`)
      }
      
      // Network matches
      if (chain.network.toLowerCase().includes(queryLower)) {
        suggestions.add(`${chain.name} (${chain.network})`)
      }
    })
    
    return Array.from(suggestions).slice(0, 8)
  }, [query, chains])

  const handleSearch = useCallback(() => {
    const searchQuery = query.trim()
    if (searchQuery) {
      // Track search event
      analytics.trackSearch(searchQuery, 0) // Results count will be updated later
      
      // Add to recent searches
      setRecentSearches(prev => {
        const newSearches = [searchQuery, ...prev.filter(s => s !== searchQuery)]
        return newSearches.slice(0, 5) // Keep only 5 recent searches
      })

    }
    onSearch(searchQuery, selectedTags);
  }, [query, selectedTags, onSearch])

  const handleClear = useCallback(() => {
    setQuery('')
    setSelectedTags([])
    setShowSuggestions(false)
    onClear()
  }, [onClear])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }, [])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    handleSearch()
  }, [handleSearch])

  const handlePopularSearchClick = useCallback((search: string) => {
    setQuery(search)
    handleSearch()
  }, [handleSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
      setShowSuggestions(false)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }, [handleSearch])

  const handleInputFocus = useCallback(() => {
    if (query.trim() || recentSearches.length > 0) {
      setShowSuggestions(true)
    }
  }, [query, recentSearches])

  const handleInputBlur = useCallback(() => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!isMouseOverSuggestions) {
        setShowSuggestions(false)
      }
    }, 150)
  }, [isMouseOverSuggestions])

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20 h-12 text-base"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={handleSearch}
            size="sm"
            className="h-8 px-3"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          onMouseEnter={() => setIsMouseOverSuggestions(true)}
          onMouseLeave={() => setIsMouseOverSuggestions(false)}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-2 py-1 rounded text-sm hover:bg-muted transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && (
            <div className="p-3 border-b border-border">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Suggestions
              </div>
              <div className="space-y-1">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-2 py-1 rounded text-sm hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              Popular Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearchClick(search)}
                  className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Suggested Tags */}
      <div className="mt-3">
        <div className="text-sm text-muted-foreground mb-2">Quick Filters:</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}