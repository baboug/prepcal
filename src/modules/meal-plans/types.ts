import type { inferRouterOutputs } from "@trpc/server";
import type { z } from "zod";

import type { AppRouter } from "@/lib/trpc/routers/_app";
import type {
  createMealPlanSchema,
  mealPlanBasicInfoStepSchema,
  mealPlanFiltersSchema,
  mealPlanFormSchema,
  mealPlanMealsStepSchema,
  mealPlanPreferencesStepSchema,
  mealSchema,
  mealTypeSchema,
  updateMealPlanSchema,
} from "./schemas";

export type MealPlansGetOne = inferRouterOutputs<AppRouter>["mealPlans"]["getOne"];
export type MealPlansGetMany = inferRouterOutputs<AppRouter>["mealPlans"]["getMany"]["items"];

export type MealPlanData = z.infer<typeof mealPlanFormSchema>;
export type CreateMealPlanData = z.infer<typeof createMealPlanSchema>;
export type UpdateMealPlanData = z.infer<typeof updateMealPlanSchema>;
export type MealPlanFilters = z.infer<typeof mealPlanFiltersSchema>;
export type MealData = z.infer<typeof mealSchema>;
export type MealType = z.infer<typeof mealTypeSchema>;

export type MealPlanBasicInfoStepData = z.infer<typeof mealPlanBasicInfoStepSchema>;
export type MealPlanPreferencesStepData = z.infer<typeof mealPlanPreferencesStepSchema>;
export type MealPlanMealsStepData = z.infer<typeof mealPlanMealsStepSchema>;

export const MealPlanStep = {
  BASIC_INFO: "basic-info",
  PREFERENCES: "preferences",
  AI_GENERATION: "ai-generation",
  MEALS: "meals",
  PREVIEW: "preview",
} as const;

export type MealPlanStep = (typeof MealPlanStep)[keyof typeof MealPlanStep];

export const MealPlanStatus = {
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export const MealPlanSortBy = {
  CREATED_AT: "createdAt",
  START_DATE: "startDate",
  END_DATE: "endDate",
  NAME: "name",
} as const;

export type MealPlanStatus = (typeof MealPlanStatus)[keyof typeof MealPlanStatus];
export type MealPlanSortBy = (typeof MealPlanSortBy)[keyof typeof MealPlanSortBy];

export interface MealPlanWithNutrition extends MealPlanData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  dailyAverageCalories: number;
  dailyAverageProtein: number;
  dailyAverageCarbs: number;
  dailyAverageFat: number;
  numberOfDays: number;
}

export interface MealWithRecipe extends MealData {
  recipe: {
    id: number;
    name: string;
    calories?: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    imageUrl?: string;
  };
}

export interface DayMeals {
  day: number;
  date: string;
  breakfast: MealWithRecipe[];
  lunch: MealWithRecipe[];
  dinner: MealWithRecipe[];
  snack: MealWithRecipe[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export type SortByOption = "default" | "calories" | "protein" | "carbs" | "fat" | "time" | "name";

// Repository-specific type for database queries with meal plan ID
export type MealWithRecipeRepository = {
  mealPlanId: number;
  id: number;
  day: number;
  mealType: string;
  servingSize: number;
  sortOrder: number;
  recipe: {
    id: number;
    name: string;
    calories: number | null;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    prepTime: number | null;
    cookTime: number | null;
    servings: number | null;
    imageUrl: string | null;
  };
};

// Processed meal type for client consumption
export type ProcessedMealWithRecipe = {
  id: number;
  recipeId: number;
  day: number;
  mealType: string;
  servingSize: number;
  sortOrder: number;
  recipe: {
    id: number;
    name: string;
    calories: number | null;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    prepTime: number | null;
    cookTime: number | null;
    servings: number | null;
    imageUrl: string | null;
  };
};
