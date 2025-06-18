import * as React from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "../../primitives/Button";
import { Input } from "../../primitives/Input";
import { cn } from "@/lib/utils";

/**
 * SearchBar Pattern Component
 * Unified search interface for job search, applicant filtering, and data search
 * across all three portals with consistent behavior
 */

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  size?: "sm" | "default" | "lg";
  showFilters?: boolean;
  onFiltersToggle?: () => void;
  filtersActive?: boolean;
  disabled?: boolean;
  className?: string;
  portal?: "student" | "hire" | "school";
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  ({
    value = "",
    onChange,
    onSubmit,
    onClear,
    placeholder = "Search...",
    size = "default",
    showFilters = false,
    onFiltersToggle,
    filtersActive = false,
    disabled = false,
    className,
    portal = "student",
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value);

    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(internalValue);
    };

    const handleClear = () => {
      setInternalValue("");
      onChange?.("");
      onClear?.();
    };

    const showClear = internalValue.length > 0;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 w-full",
          className
        )}
        {...props}
      >
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <Input
            value={internalValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
            disabled={disabled}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={
              showClear ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-muted rounded-sm transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : undefined
            }
            className="pr-10"
          />
        </form>

        {showFilters && (
          <Button
            type="button"
            variant={filtersActive ? "default" : "outline"}
            size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
            onClick={onFiltersToggle}
            disabled={disabled}
            aria-label="Toggle filters"
            aria-pressed={filtersActive}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-2">
              Filters
            </span>
            {filtersActive && (
              <span className="ml-1 text-xs bg-primary-foreground text-primary rounded-full px-1.5 py-0.5 font-medium">
                •
              </span>
            )}
          </Button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
