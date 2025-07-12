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
    const escapedSearch = filters.search.replace(/[%_]/g, "\\$&");
    conditions.push(ilike(recipe.name, `%${escapedSearch}%`));
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
    conditions.push(gte(getMacroField("protein"), filters.minProtein));
  }

  if (filters.maxProtein) {
    conditions.push(lte(getMacroField("protein"), filters.maxProtein));
  }

  if (filters.minCarbs) {
    conditions.push(gte(getMacroField("carbs"), filters.minCarbs));
  }

  if (filters.maxCarbs) {
    conditions.push(lte(getMacroField("carbs"), filters.maxCarbs));
  }

  if (filters.minFat) {
    conditions.push(gte(getMacroField("fat"), filters.minFat));
  }

  if (filters.maxFat) {
    conditions.push(lte(getMacroField("fat"), filters.maxFat));
  }

  if (filters.minTime) {
    conditions.push(gte(getTotalTimeField(), filters.minTime));
  }

  if (filters.maxTime) {
    conditions.push(lte(getTotalTimeField(), filters.maxTime));
  }

  return conditions;
}

function getMacroField(field: string) {
  return sql`CAST(${recipe.macros}->>'${field}' AS NUMERIC)`;
}

function getTotalTimeField() {
  return sql`COALESCE(${recipe.prepTime}, 0) + COALESCE(${recipe.cookTime}, 0)`;
}
