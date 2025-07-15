"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, EditIcon, TrashIcon, UtensilsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/components/error-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTRPC } from "@/lib/trpc/client";
import type { RecipesGetMany } from "@/modules/recipes/types";
import type { MealData } from "../../types";
import { formatDate, getDayOptions, getDuration } from "../../utils/date";
import { MealCard } from "../components/meal-card";
import { NutritionOverviewCard } from "../components/nutrition-overview-card";

interface MealPlanDetailViewProps {
  mealPlanId: number;
}

export function MealPlanDetailView({ mealPlanId }: MealPlanDetailViewProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: mealPlan } = useSuspenseQuery(trpc.mealPlans.getOne.queryOptions({ id: mealPlanId }));
  const { data: userProfile } = useSuspenseQuery(trpc.profile.get.queryOptions());

  const deleteMealPlan = useMutation(
    trpc.mealPlans.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.mealPlans.getMany.queryOptions({}));
        toast.success("Meal plan deleted successfully");
        router.push("/meal-plans");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete meal plan");
      },
    })
  );

  const handleDelete = () => {
    deleteMealPlan.mutate({ id: mealPlanId });
  };

  if (!mealPlan) {
    throw new Error("Meal plan not found");
  }

  const daysCount = getDuration(mealPlan.startDate, mealPlan.endDate);
  const isActive = new Date(mealPlan.endDate) >= new Date();
  const dayOptions = getDayOptions(mealPlan.startDate, mealPlan.endDate);

  const getMealsForDay = (day: number) => {
    return mealPlan.meals.filter((meal) => meal.day === day);
  };

  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const meal of mealPlan.meals) {
      if (meal.recipe) {
        const servingMultiplier = meal.servingSize;
        totalCalories += (meal.recipe.calories || 0) * servingMultiplier;
        totalProtein += meal.recipe.macros.protein * servingMultiplier;
        totalCarbs += meal.recipe.macros.carbs * servingMultiplier;
        totalFat += meal.recipe.macros.fat * servingMultiplier;
      }
    }

    const averageDaily = {
      calories: Math.round(totalCalories / daysCount),
      protein: Math.round(totalProtein / daysCount),
      carbs: Math.round(totalCarbs / daysCount),
      fat: Math.round(totalFat / daysCount),
    };

    return { averageDaily };
  };

  const calculateDayNutrition = (day: number) => {
    const dayMeals = getMealsForDay(day);
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    for (const meal of dayMeals) {
      if (meal.recipe) {
        const servingMultiplier = meal.servingSize;
        calories += (meal.recipe.calories || 0) * servingMultiplier;
        protein += meal.recipe.macros.protein * servingMultiplier;
        carbs += meal.recipe.macros.carbs * servingMultiplier;
        fat += meal.recipe.macros.fat * servingMultiplier;
      }
    }

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    };
  };

  const { averageDaily } = calculateNutrition();
  const selectedDayNutrition = calculateDayNutrition(selectedDay);

  const userTargets = userProfile
    ? {
        calories: userProfile.calories || 0,
        protein: userProfile.protein || 0,
        carbs: userProfile.carbs || 0,
        fat: userProfile.fat || 0,
      }
    : null;

  return (
    <>
      <div className="p-4 lg:p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-semibold text-3xl tracking-tight">{mealPlan.name}</h1>
                <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Archived"}</Badge>
              </div>
              {mealPlan.description && <p className="mt-2 text-muted-foreground">{mealPlan.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/meal-plans/${mealPlanId}/edit`}>
                <Button variant="outline">
                  <EditIcon className="h-4 w-4" />
                  Edit Plan
                </Button>
              </Link>
              <Button
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
                variant="outline"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {formatDate(mealPlan.startDate)} - {formatDate(mealPlan.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>{daysCount} days</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsIcon className="h-4 w-4" />
              <span>{mealPlan.mealsPerDay} meals/day</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Meal Schedule</CardTitle>
                <CardDescription>View your planned meals for each day</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  onValueChange={(value) => {
                    const day = Number(value);
                    if (!Number.isNaN(day)) {
                      setSelectedDay(day);
                    }
                  }}
                  value={selectedDay.toString()}
                >
                  <ScrollArea className="mb-4 w-full whitespace-nowrap">
                    <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
                      {dayOptions.map((day) => (
                        <TabsTrigger
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                          key={day.value}
                          value={day.value.toString()}
                        >
                          <div className="text-center">
                            <div className="text-xs">{day.label}</div>
                            <div className="text-muted-foreground text-xs">{day.date}</div>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </ScrollArea>
                  {dayOptions.map((day) => (
                    <TabsContent className="space-y-4" key={day.value} value={day.value.toString()}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{day.label}</h4>
                        <div className="text-muted-foreground text-sm">
                          {getMealsForDay(day.value).length} meals planned
                        </div>
                      </div>

                      {getMealsForDay(day.value).length === 0 ? (
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground">
                              <p>No meals planned for this day</p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {getMealsForDay(day.value).map((meal) => (
                            <MealCard
                              isDraggable={false}
                              isEditable={false}
                              key={`${meal.id}-${meal.day}-${meal.sortOrder}`}
                              meal={meal as MealData & { recipe?: RecipesGetMany[0] }}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <NutritionOverviewCard
                averageDailyNutrition={averageDaily}
                currentDayNutrition={selectedDayNutrition}
                description="Daily nutrition vs your targets"
                selectedDay={selectedDay}
                showDayView={true}
                title="Nutrition Overview"
                userTargets={userTargets}
              />
            </div>
          </div>
        </div>
      </div>
      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meal Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{mealPlan.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMealPlan.isPending}
              onClick={handleDelete}
            >
              {deleteMealPlan.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function MealPlanDetailViewSkeleton() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="mt-2 h-4 w-96" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function MealPlanDetailViewError() {
  return (
    <div className="p-4 lg:p-6">
      <ErrorState
        description="We couldn't load the meal plan details. Please try again."
        title="Error loading meal plan"
      />
    </div>
  );
}
