"use client";

import { FilterIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRecipesFilters } from "../../hooks/use-recipes-filters";
import { FilterCategoryAndCuisine } from "./filter-category-and-cuisine";
import { FilterMyRecipes } from "./filter-my-recipes";
import { FilterNutritionalRanges } from "./filter-nutritional-ranges";
import { FilterSearch } from "./filter-search";
import { FilterSorting } from "./filter-sorting";

export function RecipesFiltersDialog() {
  const { filters, setFilters, clearAllFilters, activeFiltersCount } = useRecipesFilters();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="relative h-9" size="sm" variant="outline">
          <FilterIcon className="size-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="-right-2 -top-2 absolute h-5 w-5 rounded-full p-0 text-xs" variant="default">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filter Recipes</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <FilterSearch filters={filters} setFilters={setFilters} />
            <FilterMyRecipes filters={filters} setFilters={setFilters} />
            <Separator />
            <FilterCategoryAndCuisine filters={filters} setFilters={setFilters} />
            <Separator />
            <FilterSorting filters={filters} setFilters={setFilters} />
            <Separator />
            <FilterNutritionalRanges filters={filters} setFilters={setFilters} />
          </div>
        </ScrollArea>
        <div className="flex justify-between gap-2 pt-4">
          <Button onClick={clearAllFilters} variant="outline">
            <XIcon className="size-4" />
            Clear All
          </Button>
          <Button onClick={() => setIsOpen(false)}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
