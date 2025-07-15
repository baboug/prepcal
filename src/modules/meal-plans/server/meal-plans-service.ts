import { TRPCError } from "@trpc/server";

import { handleServiceError } from "@/lib/trpc/utils";
import { mealPlanFiltersSchema } from "../schemas";
import type { CreateMealPlanData, MealPlanFilters } from "../types";
import * as mealPlansRepository from "./meal-plans-repository";

export async function createMealPlan(userId: string, data: CreateMealPlanData) {
  try {
    return await mealPlansRepository.createMealPlan(userId, data);
  } catch (error) {
    handleServiceError(error, "Failed to create meal plan");
  }
}

export async function updateMealPlan(mealPlanId: number, userId: string, data: CreateMealPlanData) {
  try {
    const existingMealPlan = await mealPlansRepository.getUserMealPlan(mealPlanId, userId);
    if (!existingMealPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meal plan not found or you don't have permission to edit it",
      });
    }

    return await mealPlansRepository.updateMealPlan(mealPlanId, userId, data);
  } catch (error) {
    handleServiceError(error, "Failed to update meal plan");
  }
}

export async function getMealPlan(mealPlanId: number, userId: string) {
  try {
    const mealPlan = await mealPlansRepository.getMealPlan(mealPlanId, userId);

    if (!mealPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meal plan not found or you don't have permission to view it",
      });
    }

    return mealPlan;
  } catch (error) {
    handleServiceError(error, "Failed to get meal plan");
  }
}

export async function getMealPlans(userId: string, filters: MealPlanFilters) {
  const validatedFilters = mealPlanFiltersSchema.parse(filters);
  return await mealPlansRepository.getMealPlans(userId, validatedFilters);
}

export async function deleteMealPlan(mealPlanId: number, userId: string) {
  try {
    const existingMealPlan = await mealPlansRepository.getUserMealPlan(mealPlanId, userId);
    if (!existingMealPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meal plan not found or you don't have permission to delete it",
      });
    }

    const deleted = await mealPlansRepository.deleteMealPlan(mealPlanId, userId);
    if (!deleted) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete meal plan",
      });
    }

    return { success: true };
  } catch (error) {
    handleServiceError(error, "Failed to delete meal plan");
  }
}

export async function updateShoppingList(mealPlanId: number, userId: string, shoppingList: string) {
  try {
    const existingMealPlan = await mealPlansRepository.getUserMealPlan(mealPlanId, userId);
    if (!existingMealPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meal plan not found or you don't have permission to update it",
      });
    }

    return await mealPlansRepository.updateMealPlanShoppingList(mealPlanId, userId, shoppingList);
  } catch (error) {
    handleServiceError(error, "Failed to update shopping list");
  }
}

export async function updateMealPrepPlan(mealPlanId: number, userId: string, mealPrepPlan: string) {
  try {
    const existingMealPlan = await mealPlansRepository.getUserMealPlan(mealPlanId, userId);
    if (!existingMealPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meal plan not found or you don't have permission to update it",
      });
    }

    return await mealPlansRepository.updateMealPlanMealPrep(mealPlanId, userId, mealPrepPlan);
  } catch (error) {
    handleServiceError(error, "Failed to update meal prep plan");
  }
}

// Placeholder for AI generation - will be implemented later
export function generateMealPlan(_userId: string, _preferences: Record<string, unknown>) {
  // TODO: Implement AI meal plan generation
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "AI meal plan generation is not yet implemented",
  });
}

export function generateShoppingList(_mealPlanId: number, _userId: string) {
  // TODO: Implement AI shopping list generation
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "AI shopping list generation is not yet implemented",
  });
}

export function generateMealPrepGuide(_mealPlanId: number, _userId: string) {
  // TODO: Implement AI meal prep guide generation
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "AI meal prep guide generation is not yet implemented",
  });
}
