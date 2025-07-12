"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { useRecipesFilters } from "@/modules/recipes/ui/hooks/use-recipes-filters";

interface FilterSearchProps {
  filters: ReturnType<typeof useRecipesFilters>["filters"];
  setFilters: ReturnType<typeof useRecipesFilters>["setFilters"];
}

export function FilterSearch({ filters, setFilters }: FilterSearchProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="search">Search</Label>
      <Input
        id="search"
        onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
        placeholder="Search recipes..."
        value={filters.search}
      />
    </div>
  );
}
