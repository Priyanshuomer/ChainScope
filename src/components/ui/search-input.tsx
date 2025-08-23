import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { sanitizeSearchInput } from "@/lib/security-utils"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSecureChange?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSecureChange, onChange, ...props }, ref) => {
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = sanitizeSearchInput(e.target.value)
      
      // Call the secure change handler if provided
      if (onSecureChange) {
        onSecureChange(sanitizedValue)
      }
      
      // Call the original onChange if provided
      if (onChange) {
        // Create a new event with sanitized value
        const sanitizedEvent = {
          ...e,
          target: { ...e.target, value: sanitizedValue }
        }
        onChange(sanitizedEvent as React.ChangeEvent<HTMLInputElement>)
      }
    }, [onSecureChange, onChange])

    return (
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary z-10 pointer-events-none" />
        <input
          className={cn(
            "flex h-12 w-full rounded-lg border border-border bg-input pl-12 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50",
            className
          )}
          ref={ref}
          onChange={handleChange}
          maxLength={500}
          autoComplete="off"
          spellCheck="false"
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }