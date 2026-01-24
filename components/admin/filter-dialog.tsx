"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

export interface FilterOptions {
  categoryId?: string;
  sectionId?: string;
  available?: boolean;
  priceStatus?: "all" | "base" | "temporary";
}

export interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: Array<{ id: string; name: string }>;
  sections: Array<{ id: string; name: string; categoryId: string }>;
  onReset: () => void;
}

export function FilterDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  categories,
  sections,
  onReset,
}: FilterDialogProps) {
  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(filters);

  // Update local filters when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  // Get sections filtered by selected category
  const filteredSections = React.useMemo(() => {
    if (localFilters.categoryId && localFilters.categoryId !== "all") {
      return sections.filter((s) => s.categoryId === localFilters.categoryId);
    }
    return sections;
  }, [sections, localFilters.categoryId]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      categoryId: "all",
      sectionId: "all",
      available: undefined,
      priceStatus: "all",
    };
    setLocalFilters(resetFilters);
    onReset();
    onOpenChange(false);
  };

  const hasActiveFilters = () => {
    return (
      (localFilters.categoryId && localFilters.categoryId !== "all") ||
      (localFilters.sectionId && localFilters.sectionId !== "all") ||
      localFilters.available !== undefined ||
      (localFilters.priceStatus && localFilters.priceStatus !== "all")
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Filter Menu Items</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Filter menu items by category, section, availability, and price status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-category" className="text-text-secondary">
                Category
              </Label>
              <Select
                value={localFilters.categoryId || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    categoryId: value,
                    sectionId: value === "all" ? "all" : localFilters.sectionId,
                  })
                }
              >
              <SelectTrigger id="filter-category" className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-section" className="text-text-secondary">
                Section
              </Label>
              <Select
                value={localFilters.sectionId || "all"}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, sectionId: value })
                }
                disabled={!localFilters.categoryId || localFilters.categoryId === "all"}
              >
              <SelectTrigger id="filter-section" className="w-full">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {filteredSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Availability Filter */}
            <div className="space-y-2">
              <Label className="text-text-secondary">Availability</Label>
              <Select
                value={
                  localFilters.available === undefined
                    ? "all"
                    : localFilters.available
                      ? "available"
                      : "unavailable"
                }
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    available:
                      value === "all" ? undefined : value === "available",
                  })
                }
              >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="available">Available Only</SelectItem>
                  <SelectItem value="unavailable">Unavailable Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Status Filter */}
            <div className="space-y-2">
              <Label className="text-text-secondary">Price Status</Label>
              <Select
                value={localFilters.priceStatus || "all"}
                onValueChange={(value: "all" | "base" | "temporary") =>
                  setLocalFilters({ ...localFilters, priceStatus: value })
                }
              >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="base">Base Price Only</SelectItem>
                  <SelectItem value="temporary">Temporary Price Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Badge */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-sm text-text-secondary">Active filters:</span>
              {localFilters.categoryId && localFilters.categoryId !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/20">
                  {categories.find((c) => c.id === localFilters.categoryId)?.name}
                  <button
                    onClick={() =>
                      setLocalFilters({
                        ...localFilters,
                        categoryId: "all",
                        sectionId: "all",
                      })
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {localFilters.sectionId && localFilters.sectionId !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/20">
                  {sections.find((s) => s.id === localFilters.sectionId)?.name}
                  <button
                    onClick={() =>
                      setLocalFilters({ ...localFilters, sectionId: "all" })
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {localFilters.available !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/20">
                  {localFilters.available ? "Available" : "Unavailable"}
                  <button
                    onClick={() =>
                      setLocalFilters({ ...localFilters, available: undefined })
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {localFilters.priceStatus && localFilters.priceStatus !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/20">
                  {localFilters.priceStatus === "base" ? "Base Price" : "Temporary Price"}
                  <button
                    onClick={() =>
                      setLocalFilters({ ...localFilters, priceStatus: "all" })
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="text-text-secondary"
          >
            Reset
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
