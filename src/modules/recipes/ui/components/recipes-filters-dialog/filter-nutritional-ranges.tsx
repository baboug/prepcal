"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { useRecipesFilters } from "@/modules/recipes/ui/hooks/use-recipes-filters";

interface FilterNutritionalRangesProps {
  filters: ReturnType<typeof useRecipesFilters>["filters"];
  setFilters: ReturnType<typeof useRecipesFilters>["setFilters"];
}

export function FilterNutritionalRanges({ filters, setFilters }: FilterNutritionalRangesProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Nutritional Ranges</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Calories */}
        <div className="space-y-2">
          <Label>Calories (kcal)</Label>
          <div className="flex gap-2">
            <Input
              onChange={(e) => setFilters({ minCalories: Number(e.target.value) || 0, page: 1 })}
              placeholder="Min"
              type="number"
              value={filters.minCalories || ""}
            />
            <Input
              onChange={(e) => setFilters({ maxCalories: Number(e.target.value) || 0, page: 1 })}
              placeholder="Max"
              type="number"
              value={filters.maxCalories || ""}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="space-y-2">
          <Label>Protein (g)</Label>
          <div className="flex gap-2">
            <Input
              onChange={(e) => setFilters({ minProtein: Number(e.target.value) || 0, page: 1 })}
              placeholder="Min"
              type="number"
              value={filters.minProtein || ""}
            />
            <Input
              onChange={(e) => setFilters({ maxProtein: Number(e.target.value) || 0, page: 1 })}
              placeholder="Max"
              type="number"
              value={filters.maxProtein || ""}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="space-y-2">
          <Label>Carbs (g)</Label>
          <div className="flex gap-2">
            <Input
              onChange={(e) => setFilters({ minCarbs: Number(e.target.value) || 0, page: 1 })}
              placeholder="Min"
              type="number"
              value={filters.minCarbs || ""}
            />
            <Input
              onChange={(e) => setFilters({ maxCarbs: Number(e.target.value) || 0, page: 1 })}
              placeholder="Max"
              type="number"
              value={filters.maxCarbs || ""}
            />
          </div>
        </div>

        {/* Fat */}
        <div className="space-y-2">
          <Label>Fat (g)</Label>
          <div className="flex gap-2">
            <Input
              onChange={(e) => setFilters({ minFat: Number(e.target.value) || 0, page: 1 })}
              placeholder="Min"
              type="number"
              value={filters.minFat || ""}
            />
            <Input
              onChange={(e) => setFilters({ maxFat: Number(e.target.value) || 0, page: 1 })}
              placeholder="Max"
              type="number"
              value={filters.maxFat || ""}
            />
          </div>
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label>Total Time (min)</Label>
          <div className="flex gap-2">
            <Input
              onChange={(e) => setFilters({ minTime: Number(e.target.value) || 0, page: 1 })}
              placeholder="Min"
              type="number"
              value={filters.minTime || ""}
            />
            <Input
              onChange={(e) => setFilters({ maxTime: Number(e.target.value) || 0, page: 1 })}
              placeholder="Max"
              type="number"
              value={filters.maxTime || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
