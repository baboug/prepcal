"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RecipesFiltersDialog } from "./recipes-filters-dialog";
import { RecipesSearchFilter } from "./recipes-search-filter";

export function RecipesViewHeader() {
  return (
    <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl md:text-2xl">Recipes</h1>
        <Button>
          <PlusIcon className="size-4" />
          New Recipe
        </Button>
      </div>
      <div className="flex items-center gap-x-2">
        <RecipesSearchFilter />
        <RecipesFiltersDialog />
      </div>
    </div>
  );
}
