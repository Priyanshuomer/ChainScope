// src/components/QuickFilters.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";

const FILTER_OPTIONS = [
  { id: "l2", label: "Layer 2" },
  { id: "l1", label: "Layer 1" },
  { id: "active", label: "RPC" },
  { id: "ethereum", label: "Ethereum" },
  { id: "polygon", label: "Polygon" },
  { id: "arbitrum", label: "Arbitrum" },
  { id: "optimism", label: "Optimism" },
  { id: "avalanche", label: "Avalanche" },
  { id: "bsc", label: "BNB Chain" },
  // { id: "privacy", label: "Privacy" },
  { id: "bridge", label: "Bridges" },
  { id: "verified", label: "Verified" },
  { id: "deprecated", label: "Deprecated" },
  { id: "ens", label: "ENS Support" },
  { id: "faucet", label: "Faucets" },
];

interface QuickFiltersProps {
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

export const QuickFilters = ({ selectedFilters, onFiltersChange }: QuickFiltersProps) => {
  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onFiltersChange(selectedFilters.filter(f => f !== filter));
    } else {
      onFiltersChange([...selectedFilters, filter]);
    }
  };

  return (
    <div className="mb-8">
      {/* Heading */}
      <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
        Quick Filters
      </h3>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        {FILTER_OPTIONS.map(f => (
          <Badge
            key={f.id}
            onClick={() => toggleFilter(f.id)}
            className={`cursor-pointer px-3 py-1 transition-all duration-150 ${
              selectedFilters.includes(f.id)
                ? "bg-primary text-black hover:bg-primary/90"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {f.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};
