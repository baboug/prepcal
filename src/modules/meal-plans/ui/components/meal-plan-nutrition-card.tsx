"use client";

import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useTRPC } from "@/lib/trpc/client";
import type { RecipesGetMany } from "@/modules/recipes/types";
import type { MealData, MealPlanData } from "../../types";
import { NutritionOverviewCard } from "./nutrition-overview-card";

type MealWithRecipe = MealData & { recipe?: RecipesGetMany[0] };

interface MealPlanNutritionCardProps {
  selectedDay?: number;
  isPreviewStep?: boolean;
}

export function MealPlanNutritionCard({ selectedDay = 1, isPreviewStep = false }: MealPlanNutritionCardProps) {
  const form = useFormContext<MealPlanData>();
  const watchedMeals = form.watch("meals");
  const trpc = useTRPC();

  const { data: userProfile } = useQuery(trpc.profile.get.queryOptions());

  const sumMealNutrition = (meals: MealWithRecipe[]) => {
    return meals.reduce(
      (acc, meal) => {
        if (meal.recipe) {
          const servingMultiplier = meal.servingSize || 1;
          acc.calories += (meal.recipe.calories || 0) * servingMultiplier;
          acc.protein += (meal.recipe.macros?.protein || 0) * servingMultiplier;
          acc.carbs += (meal.recipe.macros?.carbs || 0) * servingMultiplier;
          acc.fat += (meal.recipe.macros?.fat || 0) * servingMultiplier;
        }
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const calculateDayNutrition = (day: number) => {
    const dayMeals = watchedMeals.filter((meal: MealWithRecipe) => meal.day === day);
    return sumMealNutrition(dayMeals);
  };

  const calculateTotalNutrition = () => {
    if (!watchedMeals || watchedMeals.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    return sumMealNutrition(watchedMeals);
  };

  const calculateAverageDaily = () => {
    const formData = form.getValues();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const totalNutrition = calculateTotalNutrition();

    return {
      calories: Math.round(totalNutrition.calories / daysDifference),
      protein: Math.round(totalNutrition.protein / daysDifference),
      carbs: Math.round(totalNutrition.carbs / daysDifference),
      fat: Math.round(totalNutrition.fat / daysDifference),
    };
  };

  const selectedDayNutrition = calculateDayNutrition(selectedDay);
  const averageDaily = calculateAverageDaily();

  const userTargets = userProfile
    ? {
        calories: userProfile.calories || 0,
        protein: userProfile.protein || 0,
        carbs: userProfile.carbs || 0,
        fat: userProfile.fat || 0,
      }
    : null;

  const title = "Nutrition Overview";
  const description = isPreviewStep ? "Average nutrition vs your targets" : "Track your daily nutrition vs targets";

  if (watchedMeals.length === 0) {
    return (
      <NutritionOverviewCard
        averageDailyNutrition={{ calories: 0, protein: 0, carbs: 0, fat: 0 }}
        description="Add meals to see nutrition information"
        showDayView={false}
        title={title}
        userTargets={userTargets}
      />
    );
  }

  return (
    <NutritionOverviewCard
      averageDailyNutrition={averageDaily}
      currentDayNutrition={isPreviewStep ? undefined : selectedDayNutrition}
      description={description}
      selectedDay={selectedDay}
      showDayView={!isPreviewStep}
      title={title}
      userTargets={userTargets}
    />
  );
}
