"use client";

import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_OPTIONS, CUISINE_OPTIONS, SORT_OPTIONS } from "@/modules/recipes/constants";
import type { RecipesGetMany } from "@/modules/recipes/types";
import type { SortByOption } from "../../types";

interface RecipeSelectorProps {
  onSelect: (recipeId: number, recipeData: RecipesGetMany[0]) => void;
  onClose: () => void;
  recipes: RecipesGetMany;
  recipeFilters: {
    search: string;
    category: string;
    cuisine: string;
    myRecipes: boolean;
    sortBy: SortByOption;
    sortOrder: "asc" | "desc";
  };
  onRecipeFiltersChange: (filters: {
    search: string;
    category: string;
    cuisine: string;
    myRecipes: boolean;
    sortBy: SortByOption;
    sortOrder: "asc" | "desc";
  }) => void;
}

export function RecipeSelector({
  onSelect,
  onClose,
  recipes,
  recipeFilters,
  onRecipeFiltersChange,
}: RecipeSelectorProps) {
  const showFilters =
    recipeFilters.search !== "" ||
    recipeFilters.category !== "" ||
    recipeFilters.cuisine !== "" ||
    recipeFilters.myRecipes ||
    recipeFilters.sortBy !== "default" ||
    recipeFilters.sortOrder !== "desc";

  const handleSelect = (recipe: RecipesGetMany[0]) => {
    onSelect(recipe.id, recipe);
  };

  const clearFilters = () => {
    onRecipeFiltersChange({
      search: "",
      category: "",
      cuisine: "",
      myRecipes: false,
      sortBy: "default",
      sortOrder: "desc",
    });
  };

  const activeFiltersCount = [
    !!recipeFilters.search,
    !!recipeFilters.category,
    !!recipeFilters.cuisine,
    recipeFilters.myRecipes,
    recipeFilters.sortBy !== "default",
    recipeFilters.sortOrder !== "desc",
  ].filter(Boolean).length;

  return (
    <Dialog onOpenChange={onClose} open>
      <DialogContent className="max-h-[90vh] w-[95vw] min-w-0 max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select a Recipe</DialogTitle>
          <DialogDescription>Choose a recipe to add to your meal plan</DialogDescription>
        </DialogHeader>
        <div className="min-w-0 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => onRecipeFiltersChange({ ...recipeFilters, search: e.target.value })}
                placeholder="Search recipes..."
                value={recipeFilters.search}
              />
            </div>
            <Button
              className="relative"
              onClick={() => onRecipeFiltersChange({ ...recipeFilters })}
              size="sm"
              variant="outline"
            >
              <FilterIcon className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="-right-2 -top-2 absolute h-5 w-5 rounded-full p-0 text-xs" variant="default">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
          {showFilters && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filters</h3>
                <Button onClick={clearFilters} size="sm" variant="outline">
                  <XIcon className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    onValueChange={(value) =>
                      onRecipeFiltersChange({
                        ...recipeFilters,
                        category: value === "all" ? "" : value,
                      })
                    }
                    value={recipeFilters.category || "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cuisine</Label>
                  <Select
                    onValueChange={(value) =>
                      onRecipeFiltersChange({
                        ...recipeFilters,
                        cuisine: value === "all" ? "" : value,
                      })
                    }
                    value={recipeFilters.cuisine || "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cuisines</SelectItem>
                      {CUISINE_OPTIONS.map((cuis) => (
                        <SelectItem key={cuis} value={cuis}>
                          {cuis}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sort by</Label>
                  <Select
                    onValueChange={(value) =>
                      onRecipeFiltersChange({
                        ...recipeFilters,
                        sortBy: value as SortByOption,
                      })
                    }
                    value={recipeFilters.sortBy}
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
                    onValueChange={(value) =>
                      onRecipeFiltersChange({
                        ...recipeFilters,
                        sortOrder: value as "asc" | "desc",
                      })
                    }
                    value={recipeFilters.sortOrder}
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={recipeFilters.myRecipes}
                  id="my-recipes"
                  onCheckedChange={(checked) =>
                    onRecipeFiltersChange({
                      ...recipeFilters,
                      myRecipes: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="my-recipes">Show only my recipes</Label>
              </div>
            </div>
          )}
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {!recipes || recipes.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No recipes found</p>
                </div>
              ) : (
                recipes.map((recipe) => (
                  <Card className="overflow-hidden" key={recipe.id}>
                    <div className="p-4">
                      <div className="mb-3 flex items-start gap-4">
                        {recipe.imageUrl ? (
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image alt={recipe.name} className="object-cover" fill src={recipe.imageUrl} />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                            <span className="text-muted-foreground text-sm">No image</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <CardTitle className="mb-1 line-clamp-1 text-lg">{recipe.name}</CardTitle>
                          {recipe.description && (
                            <CardDescription className="line-clamp-2 text-sm">{recipe.description}</CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                          {recipe.calories && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-foreground">{recipe.calories}</span>
                              <span>calories</span>
                            </div>
                          )}
                          {recipe.prepTime && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-foreground">{recipe.prepTime}m</span>
                              <span>prep</span>
                            </div>
                          )}
                          {recipe.cookTime && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-foreground">{recipe.cookTime}m</span>
                              <span>cook</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="font-medium text-muted-foreground text-sm">Macros:</span>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-protein" />
                              <span className="font-medium text-protein-foreground text-sm">
                                {recipe.macros.protein}g
                              </span>
                              <span className="text-muted-foreground text-xs">protein</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-carbs" />
                              <span className="font-medium text-carbs-foreground text-sm">{recipe.macros.carbs}g</span>
                              <span className="text-muted-foreground text-xs">carbs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-fat" />
                              <span className="font-medium text-fat-foreground text-sm">{recipe.macros.fat}g</span>
                              <span className="text-muted-foreground text-xs">fat</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            {recipe.category && recipe.category.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {recipe.category.slice(0, 3).map((cat) => (
                                  <span
                                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-primary text-xs"
                                    key={cat}
                                  >
                                    {cat}
                                  </span>
                                ))}
                                {recipe.category.length > 3 && (
                                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-muted-foreground text-xs">
                                    +{recipe.category.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Button onClick={() => handleSelect(recipe)} size="sm">
                            Add to Meal Plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
