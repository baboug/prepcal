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
    const result = await mealPlansRepository.deleteMealPlan(mealPlanId, userId);

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meal plan not found",
      });
    }

    return { success: true };
  } catch (error) {
    handleServiceError(error, "Failed to delete meal plan");
  }
}

export async function getCurrentActiveMealPlan(userId: string) {
  try {
    return await mealPlansRepository.getCurrentActiveMealPlan(userId);
  } catch (error) {
    handleServiceError(error, "Failed to get current active meal plan");
  }
}
