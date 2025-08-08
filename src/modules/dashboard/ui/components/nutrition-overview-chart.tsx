"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTRPC } from "@/lib/trpc/client";
import type { MealWithRecipe } from "@/modules/meal-plans/types";
import { calculateDayNutrition } from "@/modules/meal-plans/utils/nutrition";

const nutritionChartConfig = {
  calories: {
    label: "Calories",
    color: "var(--calories)",
  },
  protein: {
    label: "Protein",
    color: "var(--protein)",
  },
  carbs: {
    label: "Carbs",
    color: "var(--carbs)",
  },
  fat: {
    label: "Fat",
    color: "var(--fat)",
  },
} satisfies ChartConfig;

export function NutritionOverviewChart() {
  const trpc = useTRPC();

  const { data: currentMealPlan } = useSuspenseQuery(trpc.mealPlans.getCurrentActive.queryOptions());
  const { data: userProfile } = useSuspenseQuery(trpc.profile.get.queryOptions());

  if (!(currentMealPlan && userProfile)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Nutrition Overview</CardTitle>
          <CardDescription>Your current nutrition progress</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">No active meal plan found</p>
        </CardContent>
      </Card>
    );
  }

  const todayNutrition = calculateDayNutrition(currentMealPlan.todaysMeals as MealWithRecipe[]);

  const targets = {
    calories: userProfile.calories || 2000,
    protein: userProfile.protein || 150,
    carbs: userProfile.carbs || 200,
    fat: userProfile.fat || 70,
  };

  const chartData = [
    {
      nutrient: "calories",
      actual: todayNutrition.calories,
      target: targets.calories,
      percentage: targets.calories > 0 ? Math.min((todayNutrition.calories / targets.calories) * 100, 100) : 0,
      fill: "var(--calories)",
    },
    {
      nutrient: "protein",
      actual: todayNutrition.protein,
      target: targets.protein,
      percentage: targets.calories > 0 ? Math.min((todayNutrition.protein / targets.protein) * 100, 100) : 0,
      fill: "var(--protein)",
    },
    {
      nutrient: "carbs",
      actual: todayNutrition.carbs,
      target: targets.carbs,
      percentage: targets.calories > 0 ? Math.min((todayNutrition.calories / targets.calories) * 100, 100) : 0,
      fill: "var(--carbs)",
    },
    {
      nutrient: "fat",
      actual: todayNutrition.fat,
      target: targets.fat,
      percentage: targets.calories > 0 ? Math.min((todayNutrition.calories / targets.calories) * 100, 100) : 0,
      fill: "var(--fat)",
    },
  ];

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Daily Nutrition Overview</CardTitle>
        <CardDescription>Your current nutrition progress vs targets</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="mx-auto aspect-square max-h-[240px]" config={nutritionChartConfig}>
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    const item = chartData.find((d) => d.nutrient === props.payload.nutrient);
                    if (!item) {
                      return [value, name];
                    }

                    return [
                      <div className="flex flex-col gap-1" key={name}>
                        <span className="font-medium">
                          {item.actual} / {item.target}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {item.nutrient === "calories" ? "kcal" : "g"}
                        </span>
                      </div>,
                      nutritionChartConfig[item.nutrient as keyof typeof nutritionChartConfig]?.label || item.nutrient,
                    ];
                  }}
                />
              }
              cursor={false}
            />
            <RadialBar cornerRadius={5} dataKey="percentage" />
          </RadialBarChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {chartData.map((item) => (
            <div className="flex items-center gap-2" key={item.nutrient}>
              <div className="size-2 rounded-full" style={{ backgroundColor: `var(--${item.nutrient})` }} />
              <div className="flex-1">
                <p className="font-medium text-sm capitalize">{item.nutrient}</p>
                <p className="text-muted-foreground text-xs">
                  {item.actual} / {item.target} {item.nutrient === "calories" ? "kcal" : "g"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{Math.round(item.percentage)}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
