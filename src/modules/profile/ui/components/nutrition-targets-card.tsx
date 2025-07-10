"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NutritionTargetsCardProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function NutritionTargetsCard({ calories, protein, carbs, fat }: NutritionTargetsCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Nutrition Targets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NutritionTarget
            className="bg-calories/10 text-calories-foreground dark:bg-calories"
            color="calories"
            label="Calories"
            value={calories}
          />
          <NutritionTarget
            className="bg-protein/10 text-protein-foreground dark:bg-protein"
            color="protein"
            label="Protein"
            value={`${protein}g`}
          />
          <NutritionTarget
            className="bg-carbs/10 text-carbs-foreground dark:bg-carbs"
            color="carbs"
            label="Carbs"
            value={`${carbs}g`}
          />
          <NutritionTarget
            className="bg-fat/10 text-fat-foreground dark:bg-fat"
            color="fat"
            label="Fat"
            value={`${fat}g`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function NutritionTarget({
  label,
  value,
  className,
}: {
  label: string;
  value: number | string;
  color: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg p-4", className)}>
      <span className="font-medium text-sm">{label}</span>
      <span className="font-medium text-2xl">{value}</span>
    </div>
  );
}
