import { CARB_CALORIES_PER_GRAM, FAT_CALORIES_PER_GRAM, PROTEIN_CALORIES_PER_GRAM } from "@/lib/constants";
import type { MacroPercentages } from "../types";

export const calculateMacroPercentages = (recipe: {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  calories: number | null;
}): MacroPercentages | null => {
  if (!(recipe.macros && recipe.calories)) {
    return null;
  }

  const proteinCalories = recipe.macros.protein * PROTEIN_CALORIES_PER_GRAM;
  const carbsCalories = recipe.macros.carbs * CARB_CALORIES_PER_GRAM;
  const fatCalories = recipe.macros.fat * FAT_CALORIES_PER_GRAM;
  const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

  if (totalMacroCalories === 0) {
    return null;
  }

  return {
    protein: ((proteinCalories / totalMacroCalories) * 100).toFixed(1),
    carbs: ((carbsCalories / totalMacroCalories) * 100).toFixed(1),
    fat: ((fatCalories / totalMacroCalories) * 100).toFixed(1),
    proteinCalories,
    carbsCalories,
    fatCalories,
  };
};
