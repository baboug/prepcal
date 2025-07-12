import { z } from "zod";

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
  isPublic: z.boolean().default(false),
});

export const createRecipeSchema = recipeSchema;

export const updateRecipeSchema = recipeSchema.partial().extend({
  id: z.number(),
});

export const scrapeRecipeSchema = z.object({
  url: z.string().url("Please provide a valid URL"),
});

export const recipeFiltersSchema = z.object({
  category: z.array(z.string()).optional(),
  cuisine: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  maxCalories: z.number().min(0).optional(),
  maxPrepTime: z.number().min(0).optional(),
  maxCookTime: z.number().min(0).optional(),
  isPublic: z.boolean().optional(),
});
