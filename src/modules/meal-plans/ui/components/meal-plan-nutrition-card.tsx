"use client";

import { useQuery } from "@tanstack/react-query";
import { BananaIcon, DumbbellIcon, IceCreamConeIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import type { RecipesGetMany } from "@/modules/recipes/types";
import type { MealData, MealPlanData } from "../../types";

interface MealPlanNutritionCardProps {
  selectedDay?: number;
  isPreviewStep?: boolean;
}

export function MealPlanNutritionCard({ selectedDay = 1, isPreviewStep = false }: MealPlanNutritionCardProps) {
  const form = useFormContext<MealPlanData>();
  const watchedMeals = form.watch("meals");
  const trpc = useTRPC();

  const { data: userProfile } = useQuery(trpc.profile.get.queryOptions());

  const calculateDayNutrition = (day: number) => {
    const dayMeals = watchedMeals.filter((meal: MealData & { recipe?: RecipesGetMany[0] }) => meal.day === day);

    return dayMeals.reduce(
      (acc, meal: MealData & { recipe?: RecipesGetMany[0] }) => {
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

  const calculateTotalNutrition = () => {
    if (!watchedMeals || watchedMeals.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    const totals = watchedMeals.reduce(
      (acc, meal: MealData & { recipe?: RecipesGetMany[0] }) => {
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

    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
    };
  };

  const calculateAverageDaily = () => {
    const formData = form.getValues();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const totals = calculateTotalNutrition();

    if (totalDays === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    return {
      calories: Math.round(totals.calories / totalDays),
      protein: Math.round(totals.protein / totalDays),
      carbs: Math.round(totals.carbs / totalDays),
      fat: Math.round(totals.fat / totalDays),
    };
  };

  const selectedDayNutrition = calculateDayNutrition(selectedDay);
  const averageDaily = calculateAverageDaily();

  const userTargets = userProfile
    ? {
        calories: userProfile.calories || 2000,
        protein: userProfile.protein || 150,
        carbs: userProfile.carbs || 250,
        fat: userProfile.fat || 65,
      }
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nutrition Overview</CardTitle>
        <CardDescription>
          {isPreviewStep ? "Average nutrition vs your targets" : "Track your daily nutrition vs targets"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPreviewStep && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">Day {selectedDay}</div>
              <div className="font-bold text-2xl">
                {selectedDayNutrition.calories}
                {userTargets && (
                  <span className="ml-1">
                    / {userTargets.calories}
                    <span className="text-lg"> kcal</span>
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <NutritionDisplay
                colorClass="bg-protein"
                current={selectedDayNutrition.protein}
                icon={<DumbbellIcon className="size-5 text-protein" />}
                label="Protein"
                target={userTargets?.protein}
              />
              <NutritionDisplay
                colorClass="bg-carbs"
                current={selectedDayNutrition.carbs}
                icon={<BananaIcon className="size-5 text-carbs" />}
                label="Carbs"
                target={userTargets?.carbs}
              />
              <NutritionDisplay
                colorClass="bg-fat"
                current={selectedDayNutrition.fat}
                icon={<IceCreamConeIcon className="size-5 text-fat" />}
                label="Fat"
                target={userTargets?.fat}
              />
            </div>
          </div>
        )}
        <div className={`${isPreviewStep ? "" : "border-t pt-4"} space-y-4`}>
          <div className="text-center">
            <div className="text-muted-foreground text-sm">Average daily nutrition</div>
            <div className="font-semibold text-lg">
              {averageDaily.calories}
              {userTargets && (
                <span className="ml-1">
                  / {userTargets.calories}
                  <span className="text-sm"> kcal</span>
                </span>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <NutritionDisplay
              colorClass="bg-protein"
              current={averageDaily.protein}
              icon={<DumbbellIcon className="size-5 text-protein" />}
              label={isPreviewStep ? "Protein" : "Avg Protein"}
              target={userTargets?.protein}
            />
            <NutritionDisplay
              colorClass="bg-carbs"
              current={averageDaily.carbs}
              icon={<BananaIcon className="size-5 text-carbs" />}
              label={isPreviewStep ? "Carbs" : "Avg Carbs"}
              target={userTargets?.carbs}
            />
            <NutritionDisplay
              colorClass="bg-fat"
              current={averageDaily.fat}
              icon={<IceCreamConeIcon className="size-5 text-fat" />}
              label={isPreviewStep ? "Fat" : "Avg Fat"}
              target={userTargets?.fat}
            />
          </div>
        </div>
        {watchedMeals.length === 0 && (
          <div className="text-center text-muted-foreground text-sm">Add meals to see nutrition information</div>
        )}
        {!userTargets && (
          <div className="text-center text-muted-foreground text-xs">
            Complete your profile to see nutrition targets
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NutritionDisplay({
  label,
  current,
  target,
  icon,
  colorClass,
}: {
  label: string;
  current: number;
  target?: number;
  icon: React.ReactNode;
  colorClass: string;
}) {
  const percentage = target ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="text-right">
          <div className="font-medium text-sm">
            {Math.round(current)}g
            {target && <span className="ml-1 text-muted-foreground text-xs">/ {Math.round(target)}g</span>}
            {target && <span className="ml-1 text-muted-foreground text-xs">({Math.round(percentage)}%)</span>}
          </div>
        </div>
      </div>
      {target && (
        <Progress className={cn("h-2", `${colorClass}/20`)} indicatorClassName={colorClass} value={percentage} />
      )}
    </div>
  );
}
