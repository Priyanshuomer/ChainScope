import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Filter, Check, X } from "lucide-react"

interface NetworkFiltersProps {
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
}

const filterCategories = [
  {
    name: "Status",
    filters: [
      { value: "verified", label: "Verified", description: "Independently validated" },
      { value: "active", label: "Active", description: "Currently operational" },
      { value: "deprecated", label: "Deprecated", description: "No longer maintained" },
    ],
  },
  {
    name: "Features",
    filters: [
      { value: "evm-compatible", label: "EVM Compatible", description: "Ethereum Virtual Machine" },
      { value: "ens", label: "ENS Support", description: "Ethereum Name Service" },
      { value: "bridge", label: "Bridges", description: "Cross-chain bridges" },
      { value: "faucet", label: "Faucets", description: "Test token faucets" },
    ],
  },
]

export const NetworkFilters = ({ selectedFilters, onFilterChange }: NetworkFiltersProps) => {
  const handleFilterToggle = (filterValue: string) => {
    const newFilters = selectedFilters.includes(filterValue)
      ? selectedFilters.filter((f) => f !== filterValue)
      : [...selectedFilters, filterValue]
    onFilterChange(newFilters)
  }

  const handleClearAll = () => onFilterChange([])

  const activeFilters = useMemo(() => {
    return filterCategories.flatMap((category) =>
      category.filters.filter((filter) => selectedFilters.includes(filter.value))
    )
  }, [selectedFilters])

  const handleRemoveFilter = (filterValue: string) => {
    onFilterChange(selectedFilters.filter((f) => f !== filterValue))
  }

  return (
    <div className="w-full space-y-6">
      {/* 🔹 Selected badges row */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.value}
              variant="secondary"
              className="flex items-center gap-1 pr-2"
            >
              {filter.label}
              <button
                onClick={() => handleRemoveFilter(filter.value)}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="ml-auto"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* 🔹 Inline dropdown sections */}
      <Accordion
  type="multiple" // allow multiple open
  // collapsible ❌ not allowed on type="multiple"
  className="w-full space-y-3"
>
  {filterCategories.map((category) => (
    <AccordionItem
      key={category.name}
      value={category.name}
      className="border border-border/40 rounded-md overflow-hidden"
    >
      {/* clickable header */}
      <AccordionTrigger className="flex items-center gap-2 px-4 py-2 bg-muted/30 hover:bg-muted/50 text-sm font-semibold">
        <Filter className="w-4 h-4 text-primary" />
        {category.name}
      </AccordionTrigger>

      {/* collapsible content */}
      <AccordionContent className="p-3 space-y-2 bg-background">
        {category.filters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.value)
          return (
            <Tooltip key={filter.value} delayDuration={150}>
              <TooltipTrigger asChild>
                <Button
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start text-xs h-auto py-3 rounded-md 
                    transition-all duration-300 ease-in-out
                    ${
                      isSelected
                        ? "shadow-md bg-primary/80 hover:bg-primary text-white"
                        : "hover:bg-gradient-to-r hover:from-muted hover:to-muted/70"
                    }
                    flex items-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-primary`}
                  onClick={() => handleFilterToggle(filter.value)}
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium text-[0.825rem] leading-snug">
                      {filter.label}
                    </div>
                    <div className="text-xs text-muted-foreground break-words leading-relaxed mt-0.5">
                      {filter.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-green-500 transform scale-90 transition-transform duration-300" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="animate-fadeIn p-2 rounded-md bg-popover text-popover-foreground shadow-lg">
                <p className="text-sm leading-relaxed">{filter.description}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>

    </div>
  )
}
