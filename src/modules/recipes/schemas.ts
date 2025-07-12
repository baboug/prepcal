import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/lib/constants";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

export const instructionVideoSchema = z.object({
  url: z.string().url(),
  duration: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
});

export const instructionSchema = z.object({
  step: z.string().min(1, "Instruction step is required"),
  video: instructionVideoSchema.optional(),
});

export const macrosSchema = z.object({
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
});

export const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required").max(255),
  description: z.string().optional(),
  category: z.array(z.string()).default([]),
  cuisine: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  instructions: z.array(instructionSchema).min(1, "At least one instruction is required"),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  macros: macrosSchema.optional(),
  servings: z.number().min(1).optional(),
  imageUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

export const createRecipeSchema = recipeSchema;

export const updateRecipeSchema = recipeSchema.partial().extend({
  id: z.number(),
});

export const scrapeRecipeSchema = z.object({
  url: z.string().url("Please provide a valid URL"),
});

export const recipeFiltersSchema = z.object({
  page: z.number().default(DEFAULT_PAGE),
  pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  search: z.string().nullish(),
  category: z.string().optional(),
  cuisine: z.string().optional(),
  myRecipes: z.boolean().optional(),
  sortBy: z.enum(["default", "calories", "protein", "carbs", "fat", "time", "name"]).default("default"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  // Range filters
  minCalories: z.number().min(0).optional(),
  maxCalories: z.number().min(0).optional(),
  minProtein: z.number().min(0).optional(),
  maxProtein: z.number().min(0).optional(),
  minCarbs: z.number().min(0).optional(),
  maxCarbs: z.number().min(0).optional(),
  minFat: z.number().min(0).optional(),
  maxFat: z.number().min(0).optional(),
  minTime: z.number().min(0).optional(),
  maxTime: z.number().min(0).optional(),
});
