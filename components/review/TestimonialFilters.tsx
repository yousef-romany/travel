"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal, Star } from "lucide-react";
import { Testimonial } from "@/fetch/testimonials";

interface TestimonialFiltersProps {
  testimonials: Testimonial[];
  onFilterChange: (filtered: Testimonial[]) => void;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";
type FilterOption = "all" | "5" | "4" | "3" | "2" | "1";

export default function TestimonialFilters({
  testimonials,
  onFilterChange,
}: TestimonialFiltersProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterByRating, setFilterByRating] = useState<FilterOption>("all");

  const applyFiltersAndSort = (
    sort: SortOption,
    filter: FilterOption
  ): Testimonial[] => {
    let filtered = [...testimonials];

    // Apply rating filter
    if (filter !== "all") {
      const rating = parseInt(filter);
      filtered = filtered.filter((t) => t.rating === rating);
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }

    return filtered;
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    const result = applyFiltersAndSort(option, filterByRating);
    onFilterChange(result);
  };

  const handleFilterChange = (option: FilterOption) => {
    setFilterByRating(option);
    const result = applyFiltersAndSort(sortBy, option);
    onFilterChange(result);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "highest":
        return "Highest Rating";
      case "lowest":
        return "Lowest Rating";
    }
  };

  const getFilterLabel = () => {
    if (filterByRating === "all") return "All Ratings";
    return `${filterByRating} Stars`;
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Filter & Sort:
        </span>
      </div>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {getSortLabel()}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSortChange("newest")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("oldest")}>
            Oldest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("highest")}>
            Highest Rating
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("lowest")}>
            Lowest Rating
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter by Rating Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {getFilterLabel()}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleFilterChange("all")}>
            All Ratings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("5")}>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-2" />
            5 Stars Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("4")}>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-2" />
            4 Stars Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("3")}>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-2" />
            3 Stars Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("2")}>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-2" />
            2 Stars Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("1")}>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-2" />
            1 Star Only
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
      {filterByRating !== "all" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange("all")}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear Filter
        </Button>
      )}
    </div>
  );
}
