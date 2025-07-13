import type { DayMeals, MealWithRecipe } from "../types";

export function calculateMealNutrition(meal: MealWithRecipe) {
  const { recipe, servingSize } = meal;
  const multiplier = servingSize || 1;

  return {
    calories: Math.round((recipe.calories || 0) * multiplier),
    protein: Math.round(recipe.macros.protein * multiplier),
    carbs: Math.round(recipe.macros.carbs * multiplier),
    fat: Math.round(recipe.macros.fat * multiplier),
  };
}

export function calculateDayNutrition(dayMeals: MealWithRecipe[]) {
  return dayMeals.reduce(
    (totals, meal) => {
      const mealNutrition = calculateMealNutrition(meal);
      return {
        calories: totals.calories + mealNutrition.calories,
        protein: totals.protein + mealNutrition.protein,
        carbs: totals.carbs + mealNutrition.carbs,
        fat: totals.fat + mealNutrition.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function calculateMealPlanNutrition(meals: MealWithRecipe[], numberOfDays: number) {
  const totals = meals.reduce(
    (acc, meal) => {
      const mealNutrition = calculateMealNutrition(meal);
      return {
        calories: acc.calories + mealNutrition.calories,
        protein: acc.protein + mealNutrition.protein,
        carbs: acc.carbs + mealNutrition.carbs,
        fat: acc.fat + mealNutrition.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    totalCalories: totals.calories,
    totalProtein: totals.protein,
    totalCarbs: totals.carbs,
    totalFat: totals.fat,
    dailyAverageCalories: Math.round(totals.calories / numberOfDays),
    dailyAverageProtein: Math.round(totals.protein / numberOfDays),
    dailyAverageCarbs: Math.round(totals.carbs / numberOfDays),
    dailyAverageFat: Math.round(totals.fat / numberOfDays),
  };
}

export function groupMealsByDay(meals: MealWithRecipe[], startDate: string, numberOfDays: number): DayMeals[] {
  const dayMealsMap = new Map<number, DayMeals>();

  // Initialize all days
  for (let day = 1; day <= numberOfDays; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day - 1);

    dayMealsMap.set(day, {
      day,
      date: date.toISOString().split("T")[0],
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    });
  }

  // Group meals by day and meal type
  for (const meal of meals) {
    const dayMeals = dayMealsMap.get(meal.day);
    if (dayMeals) {
      dayMeals[meal.mealType].push(meal);
    }
  }

  // Calculate nutrition for each day
  const result: DayMeals[] = [];
  for (const dayMeals of dayMealsMap.values()) {
    const allMeals = [...dayMeals.breakfast, ...dayMeals.lunch, ...dayMeals.dinner, ...dayMeals.snack];

    const dayNutrition = calculateDayNutrition(allMeals);

    result.push({
      ...dayMeals,
      totalCalories: dayNutrition.calories,
      totalProtein: dayNutrition.protein,
      totalCarbs: dayNutrition.carbs,
      totalFat: dayNutrition.fat,
    });
  }

  return result.sort((a, b) => {
    return a.day - b.day;
  });
}

export function calculateDateRange(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
}

export function formatMacroPercentage(value: number, total: number): string {
  if (total === 0) {
    return "0%";
  }
  return `${Math.round((value / total) * 100)}%`;
}

export function getMacroCalories(protein: number, carbs: number, fat: number) {
  return {
    proteinCalories: protein * 4,
    carbsCalories: carbs * 4,
    fatCalories: fat * 9,
  };
}
