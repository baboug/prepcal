import { TRPCError } from "@trpc/server";

import { createRecipeSchema, recipeFiltersSchema, scrapeRecipeSchema, updateRecipeSchema } from "../schemas";
import type { CreateRecipeData, RecipeFilters, ScrapeRecipeInput } from "../types";
import { scrapeRecipe } from "../utils/recipe-scraper";
import * as recipeRepository from "./recipe-repository";

export const createRecipe = async (userId: string, data: CreateRecipeData) => {
  try {
    const validatedData = createRecipeSchema.parse(data);

    const recipeData = {
      ...validatedData,
      userId,
    };

    const recipe = await recipeRepository.createRecipe(recipeData);
    return recipe;
  } catch (error) {
    console.error("Error creating recipe", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create recipe",
    });
  }
};

export const updateRecipe = async (id: number, userId: string, data: Partial<CreateRecipeData>) => {
  try {
    const validatedData = updateRecipeSchema.parse({ ...data, id });

    const existingRecipe = await recipeRepository.getUserRecipe(id, userId);
    if (!existingRecipe) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Recipe not found or you don't have permission to edit it",
      });
    }

    const updatedRecipe = await recipeRepository.updateRecipe(id, userId, validatedData);
    return updatedRecipe;
  } catch (error) {
    console.error("Error updating recipe", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update recipe",
    });
  }
};

export const getRecipe = async (id: number, userId?: string) => {
  try {
    const recipe = await recipeRepository.getRecipe(id);

    if (!recipe) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Recipe not found",
      });
    }

    if (!recipe.isPublic && (!userId || recipe.userId !== userId)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to view this recipe",
      });
    }

    return recipe;
  } catch (error) {
    console.error("Error getting recipe", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get recipe",
    });
  }
};

export const getUserRecipes = async (userId: string, filters: RecipeFilters = {}) => {
  try {
    const validatedFilters = recipeFiltersSchema.parse(filters);
    return await recipeRepository.getUserRecipes(userId, validatedFilters);
  } catch (error) {
    console.error("Error getting user recipes", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get user recipes",
    });
  }
};

export const getPublicRecipes = async (filters: RecipeFilters = {}) => {
  try {
    const validatedFilters = recipeFiltersSchema.parse(filters);
    return await recipeRepository.getPublicRecipes(validatedFilters);
  } catch (error) {
    console.error("Error getting public recipes", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get public recipes",
    });
  }
};

export const deleteRecipe = async (id: number, userId: string) => {
  try {
    const existingRecipe = await recipeRepository.getUserRecipe(id, userId);
    if (!existingRecipe) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Recipe not found or you don't have permission to delete it",
      });
    }

    const deleted = await recipeRepository.deleteRecipe(id, userId);
    if (!deleted) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete recipe",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting recipe", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete recipe",
    });
  }
};

export const scrapeAndCreateRecipe = async (userId: string, input: ScrapeRecipeInput) => {
  try {
    const validatedInput = scrapeRecipeSchema.parse(input);

    const scrapedData = await scrapeRecipe(validatedInput.url, true);
    if (!scrapedData) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to scrape recipe from the provided URL",
      });
    }

    const recipeData: CreateRecipeData = {
      ...scrapedData,
      isPublic: scrapedData.isPublic ?? false,
      imageUrl: scrapedData.imageUrl ?? undefined,
    };

    return await createRecipe(userId, recipeData);
  } catch (error) {
    console.error("Error scraping and creating recipe", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to scrape and create recipe",
    });
  }
};
