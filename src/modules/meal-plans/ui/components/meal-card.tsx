"use client";

import { GripVerticalIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { forwardRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RecipesGetMany } from "@/modules/recipes/types";
import { MEAL_TYPES } from "../../constants";
import type { MealData } from "../../types";
import { MealCardEditForm } from "./meal-card-edit-form";

interface MealCardProps {
  meal: MealData & { recipe?: RecipesGetMany[0] };
  index?: number;
  onUpdate?: (index: number, updates: Partial<MealData>) => void;
  onRemove?: (index: number) => void;
  isEditable?: boolean;
  isDraggable?: boolean;
  dragHandleProps?: Record<string, unknown>;
  style?: React.CSSProperties;
  className?: string;
}

export const MealCard = forwardRef<HTMLDivElement, MealCardProps>(
  (
    {
      meal,
      index = 0,
      onUpdate,
      onRemove,
      isEditable = false,
      isDraggable = false,
      dragHandleProps,
      style,
      className = "",
    },
    ref
  ) => {
    const getRecipeTitle = () => {
      if (meal.recipe?.name) {
        return meal.recipe.name;
      }
      return `Recipe #${meal.recipeId} (Not Found)`;
    };

    const getMealTypeLabel = () => {
      return MEAL_TYPES.find((type) => type.value === meal.mealType)?.label || meal.mealType;
    };

    return (
      <Card className={cn("gap-0", className)} ref={ref} style={style}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-start gap-3">
              {isDraggable && (
                <button
                  className={cn(
                    "mt-1 text-muted-foreground",
                    isEditable ? "cursor-grab hover:text-foreground active:cursor-grabbing" : "text-muted-foreground/50"
                  )}
                  {...(isEditable ? dragHandleProps : {})}
                >
                  <GripVerticalIcon className="h-4 w-4" />
                </button>
              )}
              {meal.recipe?.imageUrl ? (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image alt={meal.recipe.name} className="object-cover" fill src={meal.recipe.imageUrl} />
                </div>
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  <span className="text-muted-foreground text-xs">No image</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <CardTitle className="line-clamp-1 text-base">{getRecipeTitle()}</CardTitle>
                <CardDescription className="mt-1">
                  {getMealTypeLabel()}
                  {meal.servingSize !== 1 && <span className="ml-2">({meal.servingSize}x serving)</span>}
                </CardDescription>
                {meal.recipe && (
                  <div className="mt-2 space-y-2">
                    <div className={`flex flex-wrap items-center gap-6 text-muted-foreground text-sm ${className}`}>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground">
                          {meal.recipe.calories ? Math.round(meal.recipe.calories * meal.servingSize) : 0}
                        </span>
                        <span>calories</span>
                      </div>
                      {meal.recipe.prepTime && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{meal.recipe.prepTime}m</span>
                          <span>prep</span>
                        </div>
                      )}
                      {meal.recipe.cookTime && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{meal.recipe.cookTime}m</span>
                          <span>cook</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-medium text-muted-foreground text-sm">Macros:</span>
                      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-protein" />
                          <span className="font-medium text-protein-foreground text-sm">
                            {Math.round(meal.recipe.macros.protein * meal.servingSize)}g
                          </span>
                          <span className="text-muted-foreground text-xs">protein</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-carbs" />
                          <span className="font-medium text-carbs-foreground text-sm">
                            {Math.round(meal.recipe.macros.carbs * meal.servingSize)}g
                          </span>
                          <span className="text-muted-foreground text-xs">carbs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-fat" />
                          <span className="font-medium text-fat-foreground text-sm">
                            {Math.round(meal.recipe.macros.fat * meal.servingSize)}g
                          </span>
                          <span className="text-muted-foreground text-xs">fat</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isEditable && onRemove && (
              <Button
                className="flex-shrink-0 text-destructive hover:text-destructive"
                onClick={() => onRemove(index)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        {isEditable && onUpdate && (
          <CardContent className="space-y-4">
            <MealCardEditForm index={index} meal={meal} onUpdate={onUpdate} />
          </CardContent>
        )}
      </Card>
    );
  }
);

MealCard.displayName = "MealCard";
