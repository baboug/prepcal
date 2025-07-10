"use client";

import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MacronutrientChartProps {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  dietType: string;
}

export function MacronutrientChart({ protein, carbs, fat, calories, dietType }: MacronutrientChartProps) {
  const macroChartData = [
    {
      name: "Protein",
      value: protein,
      calories: protein * 4,
      percentage: Math.round(((protein * 4) / calories) * 100),
      fill: "var(--protein)",
    },
    {
      name: "Carbohydrates",
      value: carbs,
      calories: carbs * 4,
      percentage: Math.round(((carbs * 4) / calories) * 100),
      fill: "var(--carbs)",
    },
    {
      name: "Fat",
      value: fat,
      calories: fat * 9,
      percentage: Math.round(((fat * 9) / calories) * 100),
      fill: "var(--fat)",
    },
  ];

  const macroChartConfig = {
    Protein: {
      label: "Protein",
      color: "var(--protein)",
    },
    Carbohydrates: {
      label: "Carbohydrates",
      color: "var(--carbs)",
    },
    Fat: {
      label: "Fat",
      color: "var(--fat)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Macronutrient Breakdown</CardTitle>
        <CardDescription>Daily targets based on your {dietType} approach</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="mx-auto aspect-square max-h-[300px]" config={macroChartConfig}>
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const dataItem = macroChartData.find((d) => d.name === name);
                    return [
                      <div className="flex flex-col" key={name}>
                        <span className="font-medium">
                          {value}g {name}
                        </span>
                        <span className="text-muted-foreground text-xs">{dataItem?.percentage}% of calories</span>
                      </div>,
                      "",
                    ];
                  }}
                  hideLabel
                />
              }
              cursor={false}
            />
            <Pie data={macroChartData} dataKey="value" innerRadius={60} outerRadius={120} strokeWidth={2}>
              {macroChartData.map((entry) => (
                <Cell fill={entry.fill} key={entry.name} />
              ))}
            </Pie>
            <ChartLegend className="mt-6" content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        Total: {calories.toLocaleString()} calories per day
      </CardFooter>
    </Card>
  );
}
