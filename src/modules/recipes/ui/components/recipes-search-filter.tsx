"use client";

import { SearchInput } from "@/components/ui/search-input";
import { useRecipesFilters } from "../hooks/use-recipes-filters";

export function RecipesSearchFilter() {
  const { filters, setFilters } = useRecipesFilters();

  return (
    <SearchInput
      className="h-9 w-full bg-white md:w-56"
      onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
      placeholder="Search recipes"
      value={filters.search}
    />
  );
}
