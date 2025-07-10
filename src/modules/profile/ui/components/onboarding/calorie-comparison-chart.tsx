"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ProfileData } from "@/modules/profile/types";
import { GOAL_INFO } from "@/modules/profile/utils/constants";

interface CalorieComparisonChartProps {
  bmr: number;
  tdee: number;
  calories: number;
  goal: ProfileData["goal"];
}

export function CalorieComparisonChart({ bmr, tdee, calories, goal }: CalorieComparisonChartProps) {
  const calorieChartData = [
    {
      name: "BMR",
      value: bmr,
      fill: "var(--chart-4)",
    },
    {
      name: "TDEE",
      value: tdee,
      fill: "var(--chart-2)",
    },
    {
      name: "Target",
      value: calories,
      fill: "var(--chart-1)",
    },
  ];

  const calorieChartConfig = {
    bmr: {
      label: "BMR",
      color: "hsl(var(--chart-4))",
    },
    tdee: {
      label: "TDEE",
      color: "hsl(var(--chart-2))",
    },
    target: {
      label: "Target",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calorie Comparison</CardTitle>
        <CardDescription>BMR vs TDEE vs your target calories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[280px] w-full max-w-52 lg:max-w-fit" config={calorieChartConfig}>
          <BarChart data={calorieChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis axisLine={false} className="text-xs" dataKey="name" tickLine={false} tickMargin={8} />
            <YAxis
              axisLine={false}
              className="text-xs"
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => [`${Number(value).toLocaleString()} calories`]} />}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {calorieChartData.map((entry) => (
                <Cell fill={entry.fill} key={entry.name} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          {GOAL_INFO[goal].caloriesText}:{" "}
          {Math.abs(calories - tdee) > 0 ? Math.abs(calories - tdee).toLocaleString() : calories} calories
        </div>
      </CardFooter>
    </Card>
  );
}
