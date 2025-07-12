"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_OPTIONS, CUISINE_OPTIONS } from "@/modules/recipes/constants";
import type { useRecipesFilters } from "@/modules/recipes/ui/hooks/use-recipes-filters";

interface FilterCategoryAndCuisineProps {
  filters: ReturnType<typeof useRecipesFilters>["filters"];
  setFilters: ReturnType<typeof useRecipesFilters>["setFilters"];
}

export function FilterCategoryAndCuisine({ filters, setFilters }: FilterCategoryAndCuisineProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          onValueChange={(value) => setFilters({ category: value === "all" ? "" : value, page: 1 })}
          value={filters.category || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORY_OPTIONS.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Cuisine</Label>
        <Select
          onValueChange={(value) => setFilters({ cuisine: value === "all" ? "" : value, page: 1 })}
          value={filters.cuisine || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cuisines</SelectItem>
            {CUISINE_OPTIONS.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
