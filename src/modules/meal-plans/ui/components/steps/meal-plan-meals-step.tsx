"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RecipesGetMany } from "@/modules/recipes/types";
import type { MealData, MealPlanData } from "../../../types";
import { getDayOptions } from "../../../utils/date";
import { MealCard } from "../meal-card";
import { RecipeSelector } from "../recipe-selector";

interface MealPlanMealsStepProps {
  form: UseFormReturn<MealPlanData>;
  selectedDay?: number;
  onSelectedDayChange?: (day: number) => void;
}

interface SortableMealItemProps {
  meal: MealData & { recipe?: RecipesGetMany[0] };
  index: number;
  onUpdate: (index: number, updates: Partial<MealData>) => void;
  onRemove: (index: number) => void;
}

function SortableMealItem({ meal, index, onUpdate, onRemove }: SortableMealItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `meal-${meal.day}-${meal.sortOrder}-${meal.recipeId}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <MealCard
      className={isDragging ? "shadow-lg" : ""}
      dragHandleProps={{ ...attributes, ...listeners }}
      index={index}
      isDraggable
      isEditable
      meal={meal}
      onRemove={onRemove}
      onUpdate={onUpdate}
      ref={setNodeRef}
      style={style}
    />
  );
}

export function MealPlanMealsStep({ form, selectedDay = 1, onSelectedDayChange }: MealPlanMealsStepProps) {
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const watchedMeals = form.watch("meals");
  const formData = form.getValues();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dayOptions = getDayOptions(formData.startDate, formData.endDate);

  const addMeal = (recipeId: number, recipeData: RecipesGetMany[0]) => {
    const dayMeals = getMealsForDay(selectedDay);
    const newMeal: MealData & { recipe?: RecipesGetMany[0] } = {
      recipeId,
      day: selectedDay,
      mealType: "breakfast",
      servingSize: 1.0,
      sortOrder: dayMeals.length,
      recipe: recipeData,
    };

    form.setValue("meals", [...watchedMeals, newMeal]);
    setShowRecipeSelector(false);
  };

  const removeMeal = (index: number) => {
    const updatedMeals = watchedMeals.filter((_, i) => i !== index);

    // Update sort orders for meals in the same day
    const mealToRemove = watchedMeals[index];
    const reorderedMeals = updatedMeals.map((meal) => {
      if (meal.day === mealToRemove.day && meal.sortOrder > mealToRemove.sortOrder) {
        return { ...meal, sortOrder: meal.sortOrder - 1 };
      }
      return meal;
    });

    form.setValue("meals", reorderedMeals);
  };

  const updateMeal = (index: number, updates: Partial<MealData>) => {
    const updatedMeals = [...watchedMeals];
    updatedMeals[index] = { ...updatedMeals[index], ...updates };
    form.setValue("meals", updatedMeals);
  };

  const duplicateDay = (dayToDuplicate: number) => {
    const dayMeals = getMealsForDay(dayToDuplicate);
    const currentDayMeals = getMealsForDay(selectedDay);
    const startingSortOrder = currentDayMeals.length;

    const newMeals = dayMeals.map((meal, index) => ({
      ...meal,
      day: selectedDay,
      sortOrder: startingSortOrder + index,
    }));

    form.setValue("meals", [...watchedMeals, ...newMeals]);
  };

  const clearDay = (dayToClear: number) => {
    const updatedMeals = watchedMeals.filter((meal) => meal.day !== dayToClear);
    form.setValue("meals", updatedMeals);
  };

  const getMealsForDay = (day: number) => {
    return watchedMeals.filter((meal) => meal.day === day).sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const dayMeals = getMealsForDay(selectedDay);
    const oldIndex = dayMeals.findIndex((meal) => `meal-${meal.recipeId}-${watchedMeals.indexOf(meal)}` === active.id);
    const newIndex = dayMeals.findIndex((meal) => `meal-${meal.recipeId}-${watchedMeals.indexOf(meal)}` === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reorderedDayMeals = arrayMove(dayMeals, oldIndex, newIndex);
      const updatedMeals = [...watchedMeals];
      reorderedDayMeals.forEach((meal, index) => {
        const globalIndex = watchedMeals.indexOf(meal);
        updatedMeals[globalIndex] = { ...meal, sortOrder: index };
      });

      form.setValue("meals", updatedMeals);
    }

    setActiveId(null);
  };

  const activeItem = activeId
    ? watchedMeals.find((meal) => `meal-${meal.recipeId}-${watchedMeals.indexOf(meal)}` === activeId)
    : null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 font-semibold text-lg">Add Your Meals</h3>
        <p className="mb-4 text-muted-foreground">
          Select recipes for your meal plan. You can customize serving sizes, assign them to specific days, and reorder
          them by dragging.
        </p>
      </div>
      <Tabs onValueChange={(value) => onSelectedDayChange?.(Number(value))} value={selectedDay.toString()}>
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-medium">{day.label}</h4>
              <div className="flex flex-wrap gap-2">
                <Select onValueChange={(value) => duplicateDay(Number(value))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Duplicate day" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions
                      .filter((d) => d.value !== day.value && getMealsForDay(d.value).length > 0)
                      .map((d) => (
                        <SelectItem key={d.value} value={d.value.toString()}>
                          {d.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowRecipeSelector(true)} size="sm" type="button">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Recipe
                </Button>
                {getMealsForDay(day.value).length > 0 && (
                  <Button onClick={() => clearDay(day.value)} size="sm" type="button" variant="outline">
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Clear Day
                  </Button>
                )}
              </div>
            </div>
            {getMealsForDay(day.value).length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <p>No meals added for this day. Click "Add Recipe" to get started.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                sensors={sensors}
              >
                <SortableContext
                  items={getMealsForDay(day.value).map((meal) => `meal-${meal.recipeId}-${watchedMeals.indexOf(meal)}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {getMealsForDay(day.value).map((meal) => {
                      const globalIndex = watchedMeals.indexOf(meal);
                      return (
                        <SortableMealItem
                          index={globalIndex}
                          key={`meal-${meal.recipeId}-${globalIndex}`}
                          meal={meal as MealData & { recipe?: RecipesGetMany[0] }}
                          onRemove={removeMeal}
                          onUpdate={updateMeal}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeItem ? (
                    <MealCard
                      className="opacity-90 shadow-lg"
                      isDraggable
                      meal={activeItem as MealData & { recipe?: RecipesGetMany[0] }}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </TabsContent>
        ))}
      </Tabs>
      {showRecipeSelector && <RecipeSelector onClose={() => setShowRecipeSelector(false)} onSelect={addMeal} />}
      <FormField
        control={form.control}
        name="meals"
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
