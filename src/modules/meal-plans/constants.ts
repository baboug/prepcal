import { MealPlanStep } from "./types";

export const MEAL_PLAN_STEPS = [
  {
    id: MealPlanStep.BASIC_INFO,
    title: "Basic Info",
    description: "Plan details and duration",
    order: 1,
  },
  {
    id: MealPlanStep.PREFERENCES,
    title: "Preferences",
    description: "Dietary preferences and restrictions",
    order: 2,
  },
  {
    id: MealPlanStep.AI_GENERATION,
    title: "AI Generation",
    description: "Generate meals with AI or continue manually",
    order: 3,
  },
  {
    id: MealPlanStep.MEALS,
    title: "Meals",
    description: "Select and customize your meals",
    order: 4,
  },
  {
    id: MealPlanStep.PREVIEW,
    title: "Preview",
    description: "Review your meal plan",
    order: 5,
  },
] as const;

export const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
] as const;

export const MEAL_TYPES_INFO = {
  breakfast: {
    title: "Breakfast",
  },
  lunch: {
    title: "Lunch",
  },
  dinner: {
    title: "Dinner",
  },
  snack: {
    title: "Snack",
  },
};

export const DEFAULT_MEALS_PER_DAY = 3;
export const MAX_MEALS_PER_DAY = 6;
export const MIN_MEALS_PER_DAY = 1;

export const DEFAULT_SERVING_SIZE = 1.0;
export const MIN_SERVING_SIZE = 0.1;
export const MAX_SERVING_SIZE = 10.0;

export const DIETARY_PREFERENCES = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "High-Protein",
  "Mediterranean",
  "Whole30",
] as const;

export const CUISINE_PREFERENCES = [
  "Italian",
  "Mexican",
  "Asian",
  "Mediterranean",
  "American",
  "Indian",
  "Thai",
  "Japanese",
  "French",
  "Chinese",
  "Greek",
  "Middle Eastern",
] as const;
