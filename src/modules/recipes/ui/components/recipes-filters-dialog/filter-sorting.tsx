"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SORT_OPTIONS } from "@/modules/recipes/constants";
import type { useRecipesFilters } from "@/modules/recipes/ui/hooks/use-recipes-filters";

interface FilterSortingProps {
  filters: ReturnType<typeof useRecipesFilters>["filters"];
  setFilters: ReturnType<typeof useRecipesFilters>["setFilters"];
}

export function FilterSorting({ filters, setFilters }: FilterSortingProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Sort by</Label>
        <Select
          onValueChange={(value) =>
            setFilters({
              sortBy: value as "default" | "calories" | "protein" | "carbs" | "fat" | "time" | "name",
              page: 1,
            })
          }
          value={filters.sortBy}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Sort order</Label>
        <Select
          onValueChange={(value) => setFilters({ sortOrder: value as "asc" | "desc", page: 1 })}
          value={filters.sortOrder}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Highest to Lowest</SelectItem>
            <SelectItem value="asc">Lowest to Highest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
