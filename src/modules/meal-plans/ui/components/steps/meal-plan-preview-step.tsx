"use client";

import { CalendarIcon, ClockIcon, UtensilsIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RecipesGetMany } from "@/modules/recipes/types";
import type { MealData, MealPlanData } from "../../../types";
import { formatDate, getDayOptions, getDuration } from "../../../utils/date";
import { MealCard } from "../meal-card";

interface MealPlanPreviewStepProps {
  form: UseFormReturn<MealPlanData>;
}

export function MealPlanPreviewStep({ form }: MealPlanPreviewStepProps) {
  const formData = form.watch();
  const dayOptions = getDayOptions(formData.startDate, formData.endDate);

  const getMealsForDay = (day: number) => {
    return formData.meals.filter((meal: MealData & { recipe?: RecipesGetMany[0] }) => meal.day === day);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-muted-foreground text-sm">Name</h4>
              <p className="font-medium">{formData.name}</p>
            </div>
            {formData.description && (
              <div>
                <h4 className="font-medium text-muted-foreground text-sm">Description</h4>
                <p className="text-sm">{formData.description}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {formatDate(formData.startDate)} - {formatDate(formData.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>{getDuration(formData.startDate, formData.endDate)} days</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsIcon className="h-4 w-4" />
              <span>{formData.mealsPerDay} meals/day</span>
            </div>
          </div>
          {(formData.dietaryPreferences?.length ?? 0) > 0 ||
            ((formData.cuisinePreferences?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground text-sm">Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.dietaryPreferences?.map((pref) => (
                    <Badge key={pref} variant="secondary">
                      {pref}
                    </Badge>
                  ))}
                  {formData.cuisinePreferences?.map((cuisine) => (
                    <Badge key={cuisine} variant="outline">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          {!!formData.excludedIngredients?.length && formData.excludedIngredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-muted-foreground text-sm">Excluded Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {formData.excludedIngredients.map((ingredient) => (
                  <Badge key={ingredient} variant="destructive">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Daily Meal Breakdown</CardTitle>
          <CardDescription>Your selected recipes for each day</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="1">
            <ScrollArea className="w-full whitespace-nowrap">
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
              <TabsContent className="mt-6 space-y-4" key={day.value} value={day.value.toString()}>
                {getMealsForDay(day.value).length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">No meals planned for this day</div>
                ) : (
                  <div className="space-y-4">
                    {getMealsForDay(day.value).map((meal: MealData & { recipe?: RecipesGetMany[0] }, index) => (
                      <MealCard isDraggable={false} key={index} meal={meal} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
