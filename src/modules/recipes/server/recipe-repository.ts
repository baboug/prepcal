import "server-only";

import { and, eq } from "drizzle-orm";

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

export const getUserRecipes = async (userId: string, filters: RecipeFilters = {}): Promise<Recipe[]> => {
  const conditions = [eq(recipe.userId, userId), ...buildFilterConditions(filters)];

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
  const conditions = [eq(recipe.isPublic, true), ...buildFilterConditions(filters)];

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
