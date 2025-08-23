import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Filter, Check, X } from "lucide-react"

interface NetworkFiltersProps {
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
}

const filterCategories = [
  {
    name: 'Network Type',
    filters: [
      { value: 'mainnet', label: 'Mainnet', description: 'Production networks' },
      { value: 'testnet', label: 'Testnet', description: 'Development networks' },
      { value: 'L1', label: 'Layer 1', description: 'Base layer networks' },
      { value: 'L2', label: 'Layer 2', description: 'Scaling solutions' },
      { value: 'rollup', label: 'Rollups', description: 'Optimistic & ZK rollups' },
      { value: 'sidechain', label: 'Sidechains', description: 'Independent chains' }
    ]
  },
  {
    name: 'Status',
    filters: [
      { value: 'verified', label: 'Verified', description: 'Independently validated' },
      { value: 'active', label: 'Active', description: 'Currently operational' },
      { value: 'deprecated', label: 'Deprecated', description: 'No longer maintained' }
    ]
  },
  {
    name: 'Features',
    filters: [
      { value: 'evm-compatible', label: 'EVM Compatible', description: 'Ethereum Virtual Machine' },
      { value: 'ens', label: 'ENS Support', description: 'Ethereum Name Service' },
      { value: 'bridge', label: 'Bridges', description: 'Cross-chain bridges' },
      { value: 'faucet', label: 'Faucets', description: 'Test token faucets' }
    ]
  },
  {
    name: 'Popular Networks',
    filters: [
      { value: 'ethereum', label: 'Ethereum', description: 'The main Ethereum network' },
      { value: 'polygon', label: 'Polygon', description: 'Polygon PoS network' },
      { value: 'arbitrum', label: 'Arbitrum', description: 'Arbitrum One' },
      { value: 'optimism', label: 'Optimism', description: 'Optimistic Ethereum' },
      { value: 'base', label: 'Base', description: 'Coinbase L2' },
      { value: 'bsc', label: 'BSC', description: 'Binance Smart Chain' }
    ]
  }
]

export const NetworkFilters = ({ selectedFilters, onFilterChange }: NetworkFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterToggle = (filterValue: string) => {
    const newFilters = selectedFilters.includes(filterValue)
      ? selectedFilters.filter(f => f !== filterValue)
      : [...selectedFilters, filterValue]
    onFilterChange(newFilters)
  }

  const handleClearAll = () => {
    onFilterChange([])
  }

  const activeFilters = useMemo(() => {
    return filterCategories.flatMap(category => 
      category.filters.filter(filter => selectedFilters.includes(filter.value))
    )
  }, [selectedFilters])

  const handleRemoveFilter = (filterValue: string) => {
    onFilterChange(selectedFilters.filter(f => f !== filterValue))
  }

  return (
    <div className="space-y-4">
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {activeFilters.map(filter => (
            <Badge
              key={filter.value}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span>{filter.label}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter(filter.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filterCategories.map(category => (
          <Card key={category.name} className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.filters.map(filter => {
                const isSelected = selectedFilters.includes(filter.value)
                return (
                  <Tooltip key={filter.value}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs h-8"
                        onClick={() => handleFilterToggle(filter.value)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{filter.label}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {filter.description}
                            </div>
                          </div>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{filter.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Filter Presets */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange(['mainnet', 'verified'])}
          className="text-xs"
        >
          Popular Mainnets
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange(['L2', 'active'])}
          className="text-xs"
        >
          Active L2s
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange(['testnet', 'faucet'])}
          className="text-xs"
        >
          Testnets with Faucets
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange(['bridge', 'evm-compatible'])}
          className="text-xs"
        >
          Bridge Networks
        </Button>
      </div>
    </div>
  )
}