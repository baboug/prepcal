import { google } from "@ai-sdk/google";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { and, or, type SQL, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { recipe } from "@/lib/db/schema";
import { handleServiceError } from "@/lib/trpc/utils";
import type { RecipesGetMany } from "@/modules/recipes/types";
import type { MealData } from "../types";

const aiMealPlanSchema = z.object({
  meals: z.array(
    z.object({
      day: z.number().min(1),
      mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
      recipeId: z.number(),
      servingSize: z.number().min(0.1).max(10).default(1),
    })
  ),
});

interface GenerateMealPlanInput {
  startDate: string;
  endDate: string;
  mealsPerDay: number;
  dietaryPreferences?: string[];
  cuisinePreferences?: string[];
  excludedIngredients?: string[];
  maxPrepTime?: number;
  maxCookTime?: number;
  nutritionTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface RecipeForAI {
  id: number;
  name: string;
  description: string | null;
  category: string[];
  cuisine: string[];
  keywords: string[];
  prepTime: number | null;
  cookTime: number | null;
  calories: number | null;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  servings: number | null;
}

export async function generateMealPlan(
  input: GenerateMealPlanInput
): Promise<(MealData & { recipe: RecipesGetMany[0] })[]> {
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include end date

  const availableRecipes = await getCompleteRecipes(input);

  if (availableRecipes.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No suitable recipes found matching your preferences. Please adjust your criteria and try again.",
    });
  }

  const recipesForAI = availableRecipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    cuisine: recipe.cuisine,
    keywords: recipe.keywords,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    calories: recipe.calories,
    macros: recipe.macros,
    servings: recipe.servings,
  }));

  const dailyTargets = {
    calories: Math.round(input.nutritionTargets.calories),
    protein: Math.round(input.nutritionTargets.protein),
    carbs: Math.round(input.nutritionTargets.carbs),
    fat: Math.round(input.nutritionTargets.fat),
  };

  const prompt = createMealPlanPrompt({
    dayCount,
    mealsPerDay: input.mealsPerDay,
    dailyTargets,
    dietaryPreferences: input.dietaryPreferences || [],
    cuisinePreferences: input.cuisinePreferences || [],
    excludedIngredients: input.excludedIngredients || [],
    availableRecipes: recipesForAI,
  });

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-pro"),
      schema: aiMealPlanSchema,
      prompt,
      temperature: 0.7,
    });

    const recipeMap = new Map<number, RecipesGetMany[0]>();
    for (const recipe of availableRecipes) {
      recipeMap.set(recipe.id, recipe);
    }

    return object.meals.map((meal, index) => {
      const recipe = recipeMap.get(meal.recipeId);
      if (!recipe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Recipe with ID ${meal.recipeId} not found in available recipes`,
        });
      }

      return {
        recipeId: meal.recipeId,
        day: meal.day,
        mealType: meal.mealType,
        servingSize: meal.servingSize,
        sortOrder: index,
        recipe,
      };
    });
  } catch (error) {
    handleServiceError(error, "Failed to generate meal plan");
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate meal plan",
    });
  }
}

async function getCompleteRecipes(input: GenerateMealPlanInput): Promise<RecipesGetMany> {
  const conditions: SQL[] = [];

  addTimeConstraints(conditions, input);
  addCuisinePreferences(conditions, input);
  addIngredientExclusions(conditions, input);
  addNutritionFilters(conditions);

  const results = await db
    .select()
    .from(recipe)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(200);

  return results.map((recipe) => ({
    ...recipe,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  }));
}

function addTimeConstraints(conditions: SQL[], input: GenerateMealPlanInput) {
  if (input.maxPrepTime && input.maxPrepTime > 0) {
    const prepTimeCondition = or(sql`${recipe.prepTime} IS NULL`, sql`${recipe.prepTime} <= ${input.maxPrepTime}`);
    if (prepTimeCondition) {
      conditions.push(prepTimeCondition);
    }
  }
  if (input.maxCookTime && input.maxCookTime > 0) {
    const cookTimeCondition = or(sql`${recipe.cookTime} IS NULL`, sql`${recipe.cookTime} <= ${input.maxCookTime}`);
    if (cookTimeCondition) {
      conditions.push(cookTimeCondition);
    }
  }
}

function addCuisinePreferences(conditions: SQL[], input: GenerateMealPlanInput) {
  if (input.cuisinePreferences && input.cuisinePreferences.length > 0) {
    const cuisineConditions = input.cuisinePreferences.map(
      (cuisine) => sql`${recipe.cuisine} @> ${JSON.stringify([cuisine])}`
    );
    const cuisineCondition = or(...cuisineConditions);
    if (cuisineCondition) {
      conditions.push(cuisineCondition);
    }
  }
}

function addIngredientExclusions(conditions: SQL[], input: GenerateMealPlanInput) {
  if (input.excludedIngredients && input.excludedIngredients.length > 0) {
    const ingredientConditions = input.excludedIngredients.map((ingredient) => {
      const searchPattern = `%${ingredient.toLowerCase()}%`;
      return sql`NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements(${recipe.ingredients}) AS ingredient
        WHERE LOWER(ingredient->>'name') LIKE LOWER(${searchPattern})
      )`;
    });
    const ingredientCondition = and(...ingredientConditions);
    if (ingredientCondition) {
      conditions.push(ingredientCondition);
    }
  }
}

function addNutritionFilters(conditions: SQL[]) {
  conditions.push(
    sql`${recipe.calories} IS NOT NULL AND ${recipe.calories} > 0`,
    sql`${recipe.macros}->>'protein' IS NOT NULL`,
    sql`${recipe.macros}->>'carbs' IS NOT NULL`,
    sql`${recipe.macros}->>'fat' IS NOT NULL`
  );
}

function createMealPlanPrompt({
  dayCount,
  mealsPerDay,
  dailyTargets,
  dietaryPreferences,
  cuisinePreferences,
  excludedIngredients,
  availableRecipes,
}: {
  dayCount: number;
  mealsPerDay: number;
  dailyTargets: { calories: number; protein: number; carbs: number; fat: number };
  dietaryPreferences: string[];
  cuisinePreferences: string[];
  excludedIngredients: string[];
  availableRecipes: RecipeForAI[];
}) {
  const totalMeals = dayCount * mealsPerDay;

  return `You are a nutrition expert creating a ${dayCount}-day meal plan with ${mealsPerDay} meals per day (total: ${totalMeals} meals).

NUTRITION TARGETS (per day):
- Calories: ${dailyTargets.calories}
- Protein: ${dailyTargets.protein}g
- Carbs: ${dailyTargets.carbs}g  
- Fat: ${dailyTargets.fat}g

USER PREFERENCES:
${dietaryPreferences.length > 0 ? `- Dietary preferences: ${dietaryPreferences.join(", ")}` : ""}
${cuisinePreferences.length > 0 ? `- Preferred cuisines: ${cuisinePreferences.join(", ")}` : ""}
${excludedIngredients.length > 0 ? `- Ingredients to avoid: ${excludedIngredients.join(", ")}` : ""}

MEAL TYPES BY MEALS PER DAY:
${getMealTypeDistribution(mealsPerDay)}

AVAILABLE RECIPES:
${availableRecipes.map((r) => `ID: ${r.id} | ${r.name} | Cal: ${r.calories} | P: ${r.macros.protein}g | C: ${r.macros.carbs}g | F: ${r.macros.fat}g | Servings: ${r.servings} | Cuisine: ${r.cuisine?.join(", ") || "N/A"} | Category: ${r.category?.join(", ") || "N/A"}`).join("\n")}

INSTRUCTIONS:
1. Create a balanced meal plan that gets as close as possible to the daily nutrition targets
2. Use appropriate serving sizes (0.1 to 10.0) to meet nutrition goals - don't just use 1.0
3. Distribute meals appropriately throughout each day
4. Ensure variety - don't repeat the same recipe too frequently
5. Consider meal types (breakfast foods for breakfast, etc.)
6. Respect dietary preferences and avoid excluded ingredients
7. If cuisine preferences are specified, prioritize those cuisines but include variety

Generate a meal plan that balances nutrition accuracy with meal variety and user preferences.`;
}

function getMealTypeDistribution(mealsPerDay: number): string {
  switch (mealsPerDay) {
    case 1:
      return "- 1 meal: Any main meal (lunch or dinner)";
    case 2:
      return "- 2 meals: breakfast, dinner";
    case 3:
      return "- 3 meals: breakfast, lunch, dinner";
    case 4:
      return "- 4 meals: breakfast, snack, lunch, dinner";
    case 5:
      return "- 5 meals: breakfast, snack, lunch, snack, dinner";
    case 6:
      return "- 6 meals: breakfast, snack, lunch, snack, dinner, snack";
    default:
      return "- Distribute meals evenly throughout the day";
  }
}
