import "server-only";

import { and, asc, count, desc, eq, isNull, or, sql } from "drizzle-orm";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { db } from "@/lib/db";
import { type Recipe, recipe } from "@/lib/db/schema";
import type { RecipeFilters } from "../types";
import { buildFilterConditions } from "../utils/filters";

export type InsertRecipe = typeof recipe.$inferInsert;

export const createRecipe = async (data: Omit<InsertRecipe, "id" | "createdAt" | "updatedAt">): Promise<Recipe> => {
  const [newRecipe] = await db.insert(recipe).values(data).returning();

  if (!newRecipe) {
    throw new Error("Failed to create recipe");
  }

  return newRecipe;
};

export const getRecipe = async (id: number): Promise<Recipe | null> => {
  const [foundRecipe] = await db.select().from(recipe).where(eq(recipe.id, id)).limit(1);

  return foundRecipe || null;
};

export const getUserRecipe = async (id: number, userId: string): Promise<Recipe | null> => {
  const [foundRecipe] = await db
    .select()
    .from(recipe)
    .where(and(eq(recipe.id, id), eq(recipe.userId, userId)))
    .limit(1);

  return foundRecipe || null;
};

function buildSortClause(sortBy: string, sortOrder: string) {
  const sortFn = sortOrder === "asc" ? asc : desc;

  switch (sortBy) {
    case "calories":
      return sortFn(recipe.calories);
    case "protein":
      return sortFn(sql`CAST(${recipe.macros}->>'protein' AS NUMERIC)`);
    case "carbs":
      return sortFn(sql`CAST(${recipe.macros}->>'carbs' AS NUMERIC)`);
    case "fat":
      return sortFn(sql`CAST(${recipe.macros}->>'fat' AS NUMERIC)`);
    case "time":
      return sortFn(sql`COALESCE(${recipe.prepTime}, 0) + COALESCE(${recipe.cookTime}, 0)`);
    case "name":
      return sortFn(recipe.name);
    default:
      return desc(recipe.createdAt);
  }
}

export const getRecipes = async (
  userId: string,
  filters: RecipeFilters = {
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "default",
    sortOrder: "desc",
  }
): Promise<{ items: Recipe[]; total: number; totalPages: number }> => {
  const conditions = buildFilterConditions(filters);

  if (filters.myRecipes) {
    conditions.push(eq(recipe.userId, userId));
  } else {
    const recipeCondition = or(isNull(recipe.userId), eq(recipe.userId, userId));
    if (recipeCondition) {
      conditions.push(recipeCondition);
    }
  }

  const sortClause = buildSortClause(filters.sortBy || "default", filters.sortOrder || "desc");

  const data = await db
    .select()
    .from(recipe)
    .where(and(...conditions))
    .orderBy(sortClause)
    .limit(filters.pageSize)
    .offset((filters.page - 1) * filters.pageSize);

  const [total] = await db
    .select({ count: count() })
    .from(recipe)
    .where(and(...conditions));

  const totalPages = Math.ceil(total.count / filters.pageSize);

  return { items: data, total: total.count, totalPages };
};

export const updateRecipe = async (id: number, userId: string, data: Partial<InsertRecipe>): Promise<Recipe> => {
  const [updatedRecipe] = await db
    .update(recipe)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(recipe.id, id), eq(recipe.userId, userId)))
    .returning();

  if (!updatedRecipe) {
    throw new Error("Failed to update recipe or recipe not found");
  }

  return updatedRecipe;
};

export const deleteRecipe = async (id: number, userId: string): Promise<boolean> => {
  const result = await db.delete(recipe).where(and(eq(recipe.id, id), eq(recipe.userId, userId)));

  return result.rowCount > 0;
};
