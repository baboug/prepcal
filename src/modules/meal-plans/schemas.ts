import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/lib/constants";

export const mealTypeSchema = z.enum(["breakfast", "lunch", "dinner", "snack"]);

export const mealSchema = z.object({
  id: z.number().optional(),
  recipeId: z.number().min(1, "Recipe is required"),
  day: z.number().min(1, "Day must be at least 1"),
  mealType: mealTypeSchema,
  servingSize: z.number().min(0.1, "Serving size must be at least 0.1").max(10, "Serving size cannot exceed 10"),
  sortOrder: z.number().default(0),
});

export const mealPlanBaseSchema = z.object({
  name: z.string().min(1, "Meal plan name is required").max(255, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  mealsPerDay: z
    .number()
    .min(1, "Must have at least 1 meal per day")
    .max(6, "Cannot exceed 6 meals per day")
    .default(3),
  meals: z.array(mealSchema).min(1, "Must have at least one meal"),
});

export const createMealPlanSchema = mealPlanBaseSchema.refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export const updateMealPlanSchema = z
  .object({
    id: z.number().min(1),
  })
  .merge(mealPlanBaseSchema);

export const mealPlanFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(DEFAULT_PAGE),
  pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  status: z.enum(["active", "archived", "all"]).default("all"),
  sortBy: z.enum(["name", "startDate", "endDate", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const mealPlanBasicInfoStepSchema = z.object({
  name: z.string().min(1, "Meal plan name is required").max(255, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  mealsPerDay: z
    .number()
    .min(1, "Must have at least 1 meal per day")
    .max(6, "Cannot exceed 6 meals per day")
    .default(3),
});

export const mealPlanPreferencesStepSchema = z.object({
  dietaryPreferences: z.array(z.string()).optional(),
  cuisinePreferences: z.array(z.string()).optional(),
  excludedIngredients: z.array(z.string()).optional(),
  maxPrepTime: z.number().min(0).max(180).optional(),
  maxCookTime: z.number().min(0).max(240).optional(),
});

export const mealPlanMealsStepSchema = z.object({
  meals: z.array(mealSchema).min(1, "Must have at least one meal"),
});

export const mealPlanFormBaseSchema = mealPlanBasicInfoStepSchema
  .merge(mealPlanPreferencesStepSchema)
  .merge(mealPlanMealsStepSchema);

export const mealPlanFormSchema = mealPlanFormBaseSchema.refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);
