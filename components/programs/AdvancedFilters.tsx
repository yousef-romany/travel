"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface FilterOptions {
  duration: string;
  difficulty: string;
  language: string;
  groupSize: string;
  priceRange: number[];
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export function AdvancedFilters({
  filters,
  onFilterChange,
  onReset,
}: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.duration !== "all") count++;
    if (filters.difficulty !== "all") count++;
    if (filters.language !== "all") count++;
    if (filters.groupSize !== "all") count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Duration Filter */}
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Select
          value={filters.duration}
          onValueChange={(value) => updateFilter("duration", value)}
        >
          <SelectTrigger id="duration">
            <SelectValue placeholder="Any duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any duration</SelectItem>
            <SelectItem value="1-3">1-3 days</SelectItem>
            <SelectItem value="4-7">4-7 days</SelectItem>
            <SelectItem value="8-14">8-14 days</SelectItem>
            <SelectItem value="15+">15+ days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty Level */}
      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <Select
          value={filters.difficulty}
          onValueChange={(value) => updateFilter("difficulty", value)}
        >
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Any difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any difficulty</SelectItem>
            <SelectItem value="easy">Easy - Relaxed pace</SelectItem>
            <SelectItem value="moderate">Moderate - Some activity</SelectItem>
            <SelectItem value="challenging">Challenging - Active adventure</SelectItem>
            <SelectItem value="extreme">Extreme - High intensity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language">Guide Language</Label>
        <Select
          value={filters.language}
          onValueChange={(value) => updateFilter("language", value)}
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="Any language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any language</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="arabic">Arabic</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="italian">Italian</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
            <SelectItem value="russian">Russian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Group Size */}
      <div className="space-y-2">
        <Label htmlFor="groupSize">Group Size</Label>
        <Select
          value={filters.groupSize}
          onValueChange={(value) => updateFilter("groupSize", value)}
        >
          <SelectTrigger id="groupSize">
            <SelectValue placeholder="Any group size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any group size</SelectItem>
            <SelectItem value="private">Private (1-2 people)</SelectItem>
            <SelectItem value="small">Small Group (3-8 people)</SelectItem>
            <SelectItem value="medium">Medium Group (9-15 people)</SelectItem>
            <SelectItem value="large">Large Group (16+ people)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label htmlFor="priceRange">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Label>
        <Slider
          id="priceRange"
          min={0}
          max={5000}
          step={50}
          value={filters.priceRange}
          onValueChange={(value) => updateFilter("priceRange", value)}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$5,000</span>
        </div>
      </div>

      {/* Reset Button */}
      {activeCount > 0 && (
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Reset All Filters ({activeCount})
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop View - Inline Filters */}
      <div className="hidden lg:block">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {activeCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeCount}
                </Badge>
              )}
            </h3>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile View - Sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filter Programs</SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect trip
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto pb-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

// Active Filters Display Component
interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (key: keyof FilterOptions) => void;
}

export function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  const activeFilters: { key: keyof FilterOptions; label: string; value: string }[] = [];

  if (filters.duration !== "all") {
    activeFilters.push({
      key: "duration",
      label: "Duration",
      value: `${filters.duration} days`,
    });
  }

  if (filters.difficulty !== "all") {
    activeFilters.push({
      key: "difficulty",
      label: "Difficulty",
      value: filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1),
    });
  }

  if (filters.language !== "all") {
    activeFilters.push({
      key: "language",
      label: "Language",
      value: filters.language.charAt(0).toUpperCase() + filters.language.slice(1),
    });
  }

  if (filters.groupSize !== "all") {
    activeFilters.push({
      key: "groupSize",
      label: "Group Size",
      value: filters.groupSize.charAt(0).toUpperCase() + filters.groupSize.slice(1),
    });
  }

  if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000) {
    activeFilters.push({
      key: "priceRange",
      label: "Price",
      value: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`,
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="pl-3 pr-1 py-1.5 gap-1"
        >
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-1 rounded-full hover:bg-background p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
