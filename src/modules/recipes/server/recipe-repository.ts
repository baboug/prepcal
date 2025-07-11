import "server-only";

import { and, eq, ilike, lte, or, type SQL } from "drizzle-orm";

import { db } from "@/lib/db";
import { type Recipe, recipe } from "@/lib/db/schema";
import type { RecipeFilters } from "../types";

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

export const getUserRecipes = async (userId: string, filters: RecipeFilters = {}): Promise<Recipe[]> => {
  const conditions: SQL[] = [eq(recipe.userId, userId)];

  if (filters.category && filters.category.length > 0) {
    const categoryConditions = filters.category.map((cat) => ilike(recipe.category, `%${cat}%`));
    if (categoryConditions.length > 0) {
      const orCondition = or(...categoryConditions);
      if (orCondition) {
        conditions.push(orCondition);
      }
    }
  }

  if (filters.cuisine && filters.cuisine.length > 0) {
    const cuisineConditions = filters.cuisine.map((cui) => ilike(recipe.cuisine, `%${cui}%`));
    if (cuisineConditions.length > 0) {
      const orCondition = or(...cuisineConditions);
      if (orCondition) {
        conditions.push(orCondition);
      }
    }
  }

  if (filters.keywords && filters.keywords.length > 0) {
    const keywordConditions = filters.keywords.map((keyword) => ilike(recipe.keywords, `%${keyword}%`));
    if (keywordConditions.length > 0) {
      const orCondition = or(...keywordConditions);
      if (orCondition) {
        conditions.push(orCondition);
      }
    }
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

  if (filters.isPublic !== undefined) {
    conditions.push(eq(recipe.isPublic, filters.isPublic));
  }

  return await db
    .select()
    .from(recipe)
    .where(and(...conditions))
    .orderBy(recipe.createdAt);
};

export const getPublicRecipes = async (filters: RecipeFilters = {}): Promise<Recipe[]> => {
  const conditions: SQL[] = [eq(recipe.isPublic, true)];

  // Apply same filters as getUserRecipes
  if (filters.category && filters.category.length > 0) {
    const categoryConditions = filters.category.map((cat) => ilike(recipe.category, `%${cat}%`));
    if (categoryConditions.length > 0) {
      const orCondition = or(...categoryConditions);
      if (orCondition) {
        conditions.push(orCondition);
      }
    }
  }

  if (filters.cuisine && filters.cuisine.length > 0) {
    const cuisineConditions = filters.cuisine.map((cui) => ilike(recipe.cuisine, `%${cui}%`));
    if (cuisineConditions.length > 0) {
      const orCondition = or(...cuisineConditions);
      if (orCondition) {
        conditions.push(orCondition);
      }
    }
  }

  if (filters.keywords && filters.keywords.length > 0) {
    const keywordConditions = filters.keywords.map((keyword) => ilike(recipe.keywords, `%${keyword}%`));
    if (keywordConditions.length > 0) {
      const orCondition = or(...keywordConditions);
      if (orCondition) {
        conditions.push(orCondition);
      }
    }
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

  return await db
    .select()
    .from(recipe)
    .where(and(...conditions))
    .orderBy(recipe.createdAt);
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
