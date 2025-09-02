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


<div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1600px] mx-auto px-4">
  {filterCategories.map(category => (
    <Card
      key={category.name}
      className="
        bg-gradient-card border border-border/50 flex flex-col
        rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1
        transition-all duration-300 ease-in-out
        flex-1 min-h-[500px]  /* Adjust height as needed */
      "
    >
      <CardHeader className="pb-3 border-b border-border/30">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 select-none">
          <Filter className="w-5 h-5 text-primary transition-transform duration-300 group-hover:rotate-6" />
          {category.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto">
        {category.filters.map(filter => {
          const isSelected = selectedFilters.includes(filter.value)
          return (
            <Tooltip key={filter.value} delayDuration={150}>
              <TooltipTrigger asChild>
                <Button
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className={`
                    w-full justify-start text-xs h-auto py-3 rounded-md 
                    transition-all duration-300 ease-in-out
                    ${isSelected
                      ? "shadow-md bg-primary/80 hover:bg-primary text-white"
                      : "hover:bg-gradient-to-r hover:from-muted hover:to-muted/70"
                    }
                    flex items-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-primary
                  `}
                  onClick={() => handleFilterToggle(filter.value)}
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium text-[0.825rem] leading-snug">{filter.label}</div>
                    <div className="text-xs text-muted-foreground break-words leading-relaxed mt-0.5">
                      {filter.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check
                      className="w-4 h-4 text-green-500 transform scale-90 transition-transform duration-300"
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="animate-fadeIn p-2 rounded-md bg-popover text-popover-foreground shadow-lg">
                <p className="text-sm leading-relaxed">{filter.description}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </CardContent>
    </Card>
  ))}
</div>

  )
}