import { z } from "zod";
import { mealPlanBasicInfoStepSchema, mealPlanMealsStepSchema, mealPlanPreferencesStepSchema } from "../schemas";
import type { MealData, MealPlanData, MealPlanStep } from "../types";
import { MealPlanStep as Steps } from "../types";
import { getDuration } from "./date";

export function validateMealsForAllDays(formData: MealPlanData): { isValid: boolean; errorMessage?: string } {
  const totalDays = getDuration(formData.startDate, formData.endDate);

  for (let day = 1; day <= totalDays; day++) {
    const mealsForDay = formData.meals.filter((meal: MealData) => meal.day === day);
    if (mealsForDay.length === 0) {
      return {
        isValid: false,
        errorMessage: `Day ${day} must have at least one meal`,
      };
    }
  }

  return { isValid: true };
}

export async function validateStep(
  step: MealPlanStep,
  formData: MealPlanData
): Promise<{ isValid: boolean; errors?: z.ZodError }> {
  try {
    if (!formData) {
      return {
        isValid: false,
        errors: new z.ZodError([
          {
            code: "custom",
            message: "Form data is required",
            path: [],
          },
        ]),
      };
    }

    switch (step) {
      case Steps.BASIC_INFO:
        await mealPlanBasicInfoStepSchema.parseAsync({
          name: formData.name,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          mealsPerDay: formData.mealsPerDay,
        });
        return { isValid: true };

      case Steps.PREFERENCES:
        await mealPlanPreferencesStepSchema.parseAsync({
          dietaryPreferences: formData.dietaryPreferences,
          cuisinePreferences: formData.cuisinePreferences,
          excludedIngredients: formData.excludedIngredients,
          maxPrepTime: formData.maxPrepTime,
          maxCookTime: formData.maxCookTime,
        });
        return { isValid: true };

      case Steps.AI_GENERATION:
        // AI generation step is always valid (it's optional)
        return { isValid: true };

      case Steps.MEALS: {
        await mealPlanMealsStepSchema.parseAsync({
          meals: formData.meals,
        });

        // Additional validation for meals per day
        const mealValidation = validateMealsForAllDays(formData);
        if (!mealValidation.isValid) {
          return {
            isValid: false,
            errors: new z.ZodError([
              {
                code: "custom",
                message: mealValidation.errorMessage || "Invalid meals configuration",
                path: ["meals"],
              },
            ]),
          };
        }

        return { isValid: true };
      }

      case Steps.PREVIEW:
        // Preview step doesn't need validation
        return { isValid: true };

      default:
        return {
          isValid: false,
          errors: new z.ZodError([
            {
              code: "custom",
              message: `Unknown validation step: ${step}`,
              path: [],
            },
          ]),
        };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error };
    }
    return { isValid: false };
  }
}
