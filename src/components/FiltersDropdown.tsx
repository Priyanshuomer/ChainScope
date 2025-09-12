// components/filters/FiltersDropdown.tsx
import React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Filter } from "lucide-react"
import { NetworkFilters } from "./network-filters" // your existing component

interface FiltersDropdownProps {
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
}

export const FiltersDropdown: React.FC<FiltersDropdownProps> = ({
  selectedFilters,
  onFilterChange,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={`flex items-center gap-2 px-4 py-2 ${
            selectedFilters.length > 0
              ? "bg-primary text-black hover:bg-primary/90"
              : "bg-muted text-foreground hover:bg-muted/70"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </PopoverTrigger>

    <PopoverContent className="w-[400px] sm:w-[600px] max-h-[80vh] overflow-y-auto p-4">
  <NetworkFilters
    selectedFilters={selectedFilters}
    onFilterChange={onFilterChange}
  />
</PopoverContent>

    </Popover>
  )
}
