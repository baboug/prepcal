import { BananaIcon, DumbbellIcon, IceCreamConeIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RecipesGetOne } from "../../../types";

interface NutritionCardProps {
  recipe: NonNullable<RecipesGetOne>;
}

export function NutritionCard({ recipe }: NutritionCardProps) {
  const hasNutrition = recipe.macros && (recipe.macros.protein || recipe.macros.carbs || recipe.macros.fat);

  if (!(hasNutrition || recipe.calories)) {
    return null;
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="font-semibold text-lg">Nutrition</CardTitle>
        {recipe.servings && <p className="text-muted-foreground text-sm">Per serving ({recipe.servings} servings)</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {recipe.calories && (
          <div className="border-b pb-4 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="font-medium text-muted-foreground text-sm">Calories</span>
            </div>
            <div className="font-bold text-3xl">{recipe.calories}</div>
          </div>
        )}
        {hasNutrition && (
          <div className="grid grid-cols-1 gap-3">
            <NutritionCardItem
              icon={<DumbbellIcon className="size-5 text-protein" />}
              label="Protein"
              type="protein"
              value={recipe.macros.protein}
            />
            <NutritionCardItem
              icon={<BananaIcon className="size-5 text-carbs" />}
              label="Carbs"
              type="carbs"
              value={recipe.macros.carbs}
            />
            <NutritionCardItem
              icon={<IceCreamConeIcon className="size-5 text-fat" />}
              label="Fat"
              type="fat"
              value={recipe.macros.fat}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NutritionCardItem({
  type,
  icon,
  label,
  value,
}: {
  type: "protein" | "carbs" | "fat";
  icon: React.ReactNode;
  label: string;
  value: number;
  valueLabel?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between rounded-2xl p-3", `bg-${type}/10`, `border-${type}`)}>
      <div className="flex items-center gap-3">
        {icon}
        <span className={cn("font-medium", `text-${type}-foreground`)}>{label}</span>
      </div>
      <span className={cn("font-bold text-lg", `text-${type}-foreground`)}>{value}g</span>
    </div>
  );
}
