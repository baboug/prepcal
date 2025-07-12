import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useRecipesFilters } from "../hooks/use-recipes-filters";

export function RecipesSearchFilter() {
  const { filters, setFilters } = useRecipesFilters();

  return (
    <div className="relative">
      <Input
        className="h-9 w-[200px] bg-white pl-7"
        onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
        placeholder="Search recipes"
        value={filters.search}
      />
      <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-2 size-4 text-muted-foreground" />
    </div>
  );
}
