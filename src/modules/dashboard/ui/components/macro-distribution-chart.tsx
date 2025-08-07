"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTRPC } from "@/lib/trpc/client";
import type { MealWithRecipe } from "@/modules/meal-plans/types";
import { calculateDayNutrition, getMacroCalories } from "@/modules/meal-plans/utils/nutrition";

const macroChartConfig = {
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

export function MacroDistributionChart() {
  const trpc = useTRPC();

  const { data: currentMealPlan } = useSuspenseQuery(trpc.mealPlans.getCurrentActive.queryOptions());

  if (!currentMealPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Macro Distribution</CardTitle>
          <CardDescription>Today's macronutrient breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">No active meal plan found</p>
        </CardContent>
      </Card>
    );
  }

  const todayNutrition = calculateDayNutrition(currentMealPlan.todaysMeals as MealWithRecipe[]);
  const macroCalories = getMacroCalories(todayNutrition.protein, todayNutrition.carbs, todayNutrition.fat);

  const totalMacroCalories = macroCalories.proteinCalories + macroCalories.carbsCalories + macroCalories.fatCalories;

  const chartData = [
    {
      name: "protein",
      value: macroCalories.proteinCalories,
      grams: todayNutrition.protein,
      percentage: totalMacroCalories > 0 ? Math.round((macroCalories.proteinCalories / totalMacroCalories) * 100) : 0,
      fill: "var(--protein)",
    },
    {
      name: "carbs",
      value: macroCalories.carbsCalories,
      grams: todayNutrition.carbs,
      percentage: totalMacroCalories > 0 ? Math.round((macroCalories.carbsCalories / totalMacroCalories) * 100) : 0,
      fill: "var(--carbs)",
    },
    {
      name: "fat",
      value: macroCalories.fatCalories,
      grams: todayNutrition.fat,
      percentage: totalMacroCalories > 0 ? Math.round((macroCalories.fatCalories / totalMacroCalories) * 100) : 0,
      fill: "var(--fat)",
    },
  ];

  const hasData = totalMacroCalories > 0;

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Macro Distribution</CardTitle>
        <CardDescription>Today's macronutrient breakdown ({todayNutrition.calories} kcal total)</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ChartContainer className="mx-auto aspect-square max-h-[240px]" config={macroChartConfig}>
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const item = chartData.find((d) => d.name === name);
                        if (!item) {
                          return [value, name];
                        }

                        return [
                          <div className="flex flex-col gap-1" key={name}>
                            <span className="font-medium">
                              {item.grams}g ({item.percentage}%)
                            </span>
                            <span className="text-muted-foreground text-xs">{Math.round(item.value)} kcal</span>
                          </div>,
                          macroChartConfig[name as keyof typeof macroChartConfig]?.label || name,
                        ];
                      }}
                    />
                  }
                  cursor={false}
                />
                <Pie cx="50%" cy="50%" data={chartData} dataKey="value" nameKey="name" outerRadius={80} strokeWidth={5}>
                  {chartData.map((entry) => (
                    <Cell fill={entry.fill} key={entry.name} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {chartData.map((item) => (
                <div className="text-center" key={item.name}>
                  <div className="mb-1 flex items-center justify-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: `var(--${item.name})` }} />
                    <p className="font-medium text-sm capitalize">{item.name}</p>
                  </div>
                  <p className="font-bold text-lg">{item.grams}g</p>
                  <p className="text-muted-foreground text-xs">
                    {item.percentage}% • {Math.round(item.value)} kcal
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground text-sm">No meals scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
