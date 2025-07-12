"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { useRecipesFilters } from "@/modules/recipes/ui/hooks/use-recipes-filters";

interface FilterMyRecipesProps {
  filters: ReturnType<typeof useRecipesFilters>["filters"];
  setFilters: ReturnType<typeof useRecipesFilters>["setFilters"];
}

export function FilterMyRecipes({ filters, setFilters }: FilterMyRecipesProps) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="my-recipes">Show only my recipes</Label>
      <Switch
        checked={filters.myRecipes}
        id="my-recipes"
        onCheckedChange={(checked) => setFilters({ myRecipes: checked, page: 1 })}
      />
    </div>
  );
}
