"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "rating-asc"
  | "duration-asc"
  | "duration-desc"
  | "popularity"
  | "newest";

interface SortOptionsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortOptions({ value, onChange }: SortOptionsProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="popularity">Most Popular</SelectItem>
          <SelectItem value="rating-desc">Highest Rated</SelectItem>
          <SelectItem value="rating-asc">Lowest Rated</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="duration-asc">Shortest Duration</SelectItem>
          <SelectItem value="duration-desc">Longest Duration</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
