import { IconChefHat } from "@tabler/icons-react";
import { FlameIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { MEAL_TYPES_INFO } from "@/modules/meal-plans/constants";
import type { MealPlanGetCurrentActive } from "@/modules/meal-plans/types";

interface DailyRecipesCarouselProps {
  mealPlan: MealPlanGetCurrentActive;
}

const mealTypeColors = {
  breakfast: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  lunch: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  dinner: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  snack: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export function DailyRecipesCarousel({ mealPlan }: DailyRecipesCarouselProps) {
  if (!mealPlan || mealPlan.todaysMeals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconChefHat className="size-5" />
            Today's Recipes
          </CardTitle>
          <CardDescription>
            {mealPlan ? `Day ${mealPlan.currentDay} of ${mealPlan.name}` : "No active meal plan"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
          <div className="text-center">
            <IconChefHat className="mx-auto mb-4 size-12 opacity-50" />
            <p>No meals planned for today</p>
            <p className="text-sm">Add some recipes to your meal plan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const calculateMacroPercentages = (meal: (typeof mealPlan.todaysMeals)[0]) => {
    const totalCalories = (meal.recipe.calories || 0) * meal.servingSize;
    if (totalCalories === 0) {
      return null;
    }

    const protein = ((meal.recipe.macros.protein * meal.servingSize * 4) / totalCalories) * 100;
    const carbs = ((meal.recipe.macros.carbs * meal.servingSize * 4) / totalCalories) * 100;
    const fat = ((meal.recipe.macros.fat * meal.servingSize * 9) / totalCalories) * 100;

    return { protein, carbs, fat };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconChefHat className="size-5" />
          Today's Recipes
        </CardTitle>
        <CardDescription>
          Day {mealPlan.currentDay} of "{mealPlan.name}" • {mealPlan.todaysMeals.length} meal
          {mealPlan.todaysMeals.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {mealPlan.todaysMeals.map((meal) => {
              const totalCalories = (meal.recipe.calories || 0) * meal.servingSize;
              const totalProtein = meal.recipe.macros.protein * meal.servingSize;
              const totalCarbs = meal.recipe.macros.carbs * meal.servingSize;
              const totalFat = meal.recipe.macros.fat * meal.servingSize;
              const totalTime = (meal.recipe.prepTime || 0) + (meal.recipe.cookTime || 0);
              const macroPercentages = calculateMacroPercentages(meal);

              return (
                <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={meal.id}>
                  <div className="h-full">
                    <Link className="block h-full" href={`/recipes/${meal.recipe.id}`}>
                      <Card className="!p-0 flex h-full flex-col gap-0 overflow-hidden transition-colors hover:bg-muted/50">
                        <CardHeader className="relative gap-0 p-0">
                          <div className="relative aspect-video overflow-hidden">
                            {meal.recipe.imageUrl ? (
                              <Image
                                alt={meal.recipe.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                height={220}
                                src={meal.recipe.imageUrl}
                                width={390}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                <IconChefHat className="size-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="absolute top-2 left-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-2">
                            {totalTime > 0 && (
                              <Badge className="flex items-center gap-1.5" variant="accent">
                                <TimerIcon className="size-3" />
                                <span>{totalTime} min</span>
                              </Badge>
                            )}
                            {totalCalories > 0 && (
                              <Badge className="flex items-center gap-1.5" variant="accent">
                                <FlameIcon className="size-3" />
                                <span>{Math.round(totalCalories)} kcal</span>
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="line-clamp-1 font-semibold">{meal.recipe.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`text-xs ${mealTypeColors[meal.mealType as keyof typeof mealTypeColors] || "bg-gray-100 text-gray-800"}`}
                              >
                                {MEAL_TYPES_INFO[meal.mealType as keyof typeof MEAL_TYPES_INFO]?.title || meal.mealType}
                              </Badge>
                              {meal.servingSize !== 1 && (
                                <Badge className="text-xs" variant="outline">
                                  {meal.servingSize}x serving
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="mt-auto p-4 pt-0">
                          <div className="grid w-full gap-2 text-sm">
                            {meal.recipe.macros && (
                              <div className="grid grid-cols-3 gap-2 border-t pt-2">
                                <div className="flex flex-col items-center gap-2 text-center">
                                  <span className="font-medium">Protein</span>
                                  <div className="flex min-h-14 w-fit min-w-14 flex-col items-center justify-center rounded-full bg-protein/10 p-2 font-medium text-protein-foreground dark:bg-protein/20 dark:text-protein-foreground">
                                    <span className="text-xs">{Math.round(totalProtein)}g</span>
                                    {macroPercentages?.protein && (
                                      <>
                                        <Separator className="my-0.5 w-3/4 bg-protein dark:bg-protein-foreground" />
                                        <span className="font-medium text-xs">
                                          {Math.round(macroPercentages.protein)}%
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                  <span className="font-medium">Carbs</span>
                                  <div className="flex min-h-14 w-fit min-w-14 flex-col items-center justify-center rounded-full bg-carbs/10 p-2 font-medium text-carbs-foreground dark:bg-carbs/20 dark:text-carbs-foreground">
                                    <span className="font-medium text-xs">{Math.round(totalCarbs)}g</span>
                                    {macroPercentages?.carbs && (
                                      <>
                                        <Separator className="my-0.5 w-3/4 bg-carbs dark:bg-carbs-foreground" />
                                        <span className="text-xs">{Math.round(macroPercentages.carbs)}%</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                  <span className="font-medium">Fat</span>
                                  <div className="flex min-h-14 w-fit min-w-14 flex-col items-center justify-center rounded-full bg-fat/10 p-2 font-medium text-fat-foreground dark:bg-fat/20 dark:text-fat-foreground">
                                    <span className="font-medium text-xs">{Math.round(totalFat)}g</span>
                                    {macroPercentages?.fat && (
                                      <>
                                        <Separator className="my-0.5 w-3/4 bg-fat dark:bg-fat-foreground" />
                                        <span className="text-xs">{Math.round(macroPercentages.fat)}%</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {mealPlan.todaysMeals.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
