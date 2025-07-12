import { ilike, lte, or, type SQL } from "drizzle-orm";

import { recipe } from "@/lib/db/schema";
import type { RecipeFilters } from "../types";

function buildArrayFilterConditions(
  values: string[] | undefined,
  column: typeof recipe.category | typeof recipe.cuisine | typeof recipe.keywords
): SQL | null {
  if (!values || values.length === 0) {
    return null;
  }

  const conditions = values.map((value) => ilike(column, `%${value}%`));
  return conditions.length > 0 ? or(...conditions) || null : null;
}

export function buildFilterConditions(filters: RecipeFilters = {}): SQL[] {
  const conditions: SQL[] = [];

  const categoryCondition = buildArrayFilterConditions(filters.category, recipe.category);
  if (categoryCondition) {
    conditions.push(categoryCondition);
  }

  const cuisineCondition = buildArrayFilterConditions(filters.cuisine, recipe.cuisine);
  if (cuisineCondition) {
    conditions.push(cuisineCondition);
  }

  const keywordCondition = buildArrayFilterConditions(filters.keywords, recipe.keywords);
  if (keywordCondition) {
    conditions.push(keywordCondition);
  }

  if (filters.maxCalories) {
    conditions.push(lte(recipe.calories, filters.maxCalories));
  }

  if (filters.maxPrepTime) {
    conditions.push(lte(recipe.prepTime, filters.maxPrepTime));
  }

  if (filters.maxCookTime) {
    conditions.push(lte(recipe.cookTime, filters.maxCookTime));
  }

  return conditions;
}
