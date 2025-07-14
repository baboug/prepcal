"use client";

import {
  BananaIcon,
  CalendarIcon,
  ClockIcon,
  DumbbellIcon,
  FlameIcon,
  IceCreamConeIcon,
  UtensilsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealPlansGetMany } from "../../types";
import { formatDate, getDuration } from "../../utils/date";

interface MealPlanCardProps {
  mealPlan: MealPlansGetMany[0];
}

type MealPlanWithOptionalMeals = MealPlansGetMany[0] & {
  meals?: Array<{
    recipe?: {
      imageUrl?: string;
      calories?: number;
      macros?: {
        protein: number;
        carbs: number;
        fat: number;
      };
    };
    servingSize: number;
  }>;
};

export function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  const daysCount = getDuration(mealPlan.startDate, mealPlan.endDate);
  const isActive = new Date(mealPlan.endDate) >= new Date();

  const mealPlanWithMeals = mealPlan as MealPlanWithOptionalMeals;

  const firstMealImage = mealPlanWithMeals.meals?.[0]?.recipe?.imageUrl;

  const calculateTotalNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const meals = mealPlanWithMeals.meals;
    if (meals && Array.isArray(meals)) {
      for (const meal of meals) {
        if (meal.recipe) {
          const servingMultiplier = meal.servingSize || 1;
          totalCalories += (meal.recipe.calories || 0) * servingMultiplier;
          totalProtein += (meal.recipe.macros?.protein || 0) * servingMultiplier;
          totalCarbs += (meal.recipe.macros?.carbs || 0) * servingMultiplier;
          totalFat += (meal.recipe.macros?.fat || 0) * servingMultiplier;
        }
      }
    }

    return {
      dailyAverageCalories: Math.round(totalCalories / daysCount),
      dailyAverageProtein: Math.round(totalProtein / daysCount),
      dailyAverageCarbs: Math.round(totalCarbs / daysCount),
      dailyAverageFat: Math.round(totalFat / daysCount),
    };
  };

  const nutrition = calculateTotalNutrition();
  const hasMealsData = mealPlanWithMeals.meals && Array.isArray(mealPlanWithMeals.meals);

  return (
    <Link className="block" href={`/meal-plans/${mealPlan.id}`}>
      <Card className="h-full gap-0 transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 gap-3">
              {firstMealImage ? (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image alt="Meal plan preview" className="object-cover" fill src={firstMealImage} />
                </div>
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  <UtensilsIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <CardTitle className="line-clamp-1 text-lg transition-colors hover:text-primary">
                  {mealPlan.name}{" "}
                  <Badge className="ml-2 p-1" variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Active" : "Archived"}
                  </Badge>
                </CardTitle>
                {mealPlan.description && (
                  <CardDescription className="mt-1 line-clamp-2 transition-colors hover:text-foreground">
                    {mealPlan.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {hasMealsData && (
            <div className="space-y-2">
              <div className="flex items-center justify-start gap-4">
                <div className="flex items-center gap-1">
                  <FlameIcon className="h-3 w-3 text-calories" />
                  <span className="font-semibold">{nutrition.dailyAverageCalories}</span>
                  <span className="text-muted-foreground text-xs">kcal</span>
                </div>
                <div className="flex items-center gap-1">
                  <DumbbellIcon className="h-3 w-3 text-protein" />
                  <span className="font-semibold">{nutrition.dailyAverageProtein}g</span>
                  <span className="text-muted-foreground text-xs">protein</span>
                </div>
                <div className="flex items-center gap-1">
                  <BananaIcon className="h-3 w-3 text-carbs" />
                  <span className="font-semibold">{nutrition.dailyAverageCarbs}g</span>
                  <span className="text-muted-foreground text-xs">carbs</span>
                </div>
                <div className="flex items-center gap-1">
                  <IceCreamConeIcon className="h-3 w-3 text-fat" />
                  <span className="font-medium">{nutrition.dailyAverageFat}g</span>
                  <span className="text-muted-foreground text-xs">fat</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-3" />
              <span>
                {formatDate(mealPlan.startDate)} - {formatDate(mealPlan.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              <span>{daysCount} days</span>
            </div>
            <div className="flex items-center gap-1">
              <UtensilsIcon className="size-3" />
              <span>{mealPlan.mealsPerDay} meals/day</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
