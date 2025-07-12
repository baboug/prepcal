import { arrayContains, gte, ilike, lte, type SQL, sql } from "drizzle-orm";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { recipe } from "@/lib/db/schema";
import type { RecipeFilters } from "../types";

export function buildFilterConditions(
  filters: RecipeFilters = {
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "default",
    sortOrder: "desc",
  }
): SQL[] {
  const conditions: SQL[] = [];

  if (filters.search) {
    conditions.push(ilike(recipe.name, `%${filters.search}%`));
  }

  if (filters.category) {
    conditions.push(arrayContains(recipe.category, [filters.category]));
  }

  if (filters.cuisine) {
    conditions.push(arrayContains(recipe.cuisine, [filters.cuisine]));
  }

  // Range filters
  if (filters.minCalories) {
    conditions.push(gte(recipe.calories, filters.minCalories));
  }

  if (filters.maxCalories) {
    conditions.push(lte(recipe.calories, filters.maxCalories));
  }

  if (filters.minProtein) {
    conditions.push(gte(sql`CAST(${recipe.macros}->>'protein' AS NUMERIC)`, filters.minProtein));
  }

  if (filters.maxProtein) {
    conditions.push(lte(sql`CAST(${recipe.macros}->>'protein' AS NUMERIC)`, filters.maxProtein));
  }

  if (filters.minCarbs) {
    conditions.push(gte(sql`CAST(${recipe.macros}->>'carbs' AS NUMERIC)`, filters.minCarbs));
  }

  if (filters.maxCarbs) {
    conditions.push(lte(sql`CAST(${recipe.macros}->>'carbs' AS NUMERIC)`, filters.maxCarbs));
  }

  if (filters.minFat) {
    conditions.push(gte(sql`CAST(${recipe.macros}->>'fat' AS NUMERIC)`, filters.minFat));
  }

  if (filters.maxFat) {
    conditions.push(lte(sql`CAST(${recipe.macros}->>'fat' AS NUMERIC)`, filters.maxFat));
  }

  if (filters.minTime) {
    conditions.push(gte(sql`COALESCE(${recipe.prepTime}, 0) + COALESCE(${recipe.cookTime}, 0)`, filters.minTime));
  }

  if (filters.maxTime) {
    conditions.push(lte(sql`COALESCE(${recipe.prepTime}, 0) + COALESCE(${recipe.cookTime}, 0)`, filters.maxTime));
  }

  return conditions;
}
