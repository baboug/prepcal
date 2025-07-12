import type { z } from "zod";

import type {
  createRecipeSchema,
  ingredientSchema,
  instructionSchema,
  macrosSchema,
  recipeFiltersSchema,
  recipeSchema,
  scrapeRecipeSchema,
  updateRecipeSchema,
} from "./schemas";

export type RecipeData = z.infer<typeof recipeSchema>;
export type CreateRecipeData = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeData = z.infer<typeof updateRecipeSchema>;
export type RecipeFilters = z.infer<typeof recipeFiltersSchema>;
export type ScrapeRecipeInput = z.infer<typeof scrapeRecipeSchema>;
export type RecipeIngredient = z.infer<typeof ingredientSchema>;
export type RecipeInstruction = z.infer<typeof instructionSchema>;
export type RecipeMacros = z.infer<typeof macrosSchema>;

export interface ScrapedRecipe {
  name: string;
  description: string;
  category: string[];
  cuisine: string[];
  keywords: string[];
  ingredients: {
    name: string;
    amount?: number;
    unit?: string;
    notes?: string;
  }[];
  instructions: {
    step: string;
    video?: {
      url: string;
      duration?: string;
      thumbnailUrl?: string;
    };
  }[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  sourceUrl: string;
  imageUrl: string | null;
  videoUrl?: string;
  isPublic?: boolean;
}

export interface JsonLdRecipe {
  "@type": string;
  name?: string;
  description?: string;
  recipeCategory?: string | string[];
  recipeCuisine?: string | string[];
  keywords?: string | string[];
  recipeIngredient?: string[];
  recipeInstructions?: JsonLdRecipeInstruction[];
  prepTime?: string;
  cookTime?: string;
  recipeYield?: string | (string | number)[];
  nutrition?: {
    calories?: string;
    proteinContent?: string;
    carbohydrateContent?: string;
    fatContent?: string;
  };
  image?: string | string[] | { url?: string; contentUrl?: string }[];
  video?: {
    contentUrl?: string;
    embedUrl?: string;
  };
}

export interface JsonLdRecipeInstruction {
  "@type"?: string;
  text?: string;
  name?: string;
  itemListElement?: JsonLdRecipeInstruction[];
  video?: {
    url: string;
    duration?: string;
    thumbnailUrl?: string;
  };
}

export interface MacroPercentages {
  protein: string;
  carbs: string;
  fat: string;
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
}

export interface ParsedIngredient {
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
}

export interface Measurement {
  amount: number;
  unit?: string;
  remainingText: string;
}

export interface ParsedInstruction {
  step: string;
  video?: string;
}
