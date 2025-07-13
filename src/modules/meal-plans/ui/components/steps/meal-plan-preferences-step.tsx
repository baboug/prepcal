"use client";

import type { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CUISINE_PREFERENCES, DIETARY_PREFERENCES } from "../../../constants";
import type { MealPlanData } from "../../../types";

interface MealPlanPreferencesStepProps {
  form: UseFormReturn<MealPlanData>;
}

export function MealPlanPreferencesStep({ form }: MealPlanPreferencesStepProps) {
  const watchedDietaryPreferences = form.watch("dietaryPreferences") || [];
  const watchedCuisinePreferences = form.watch("cuisinePreferences") || [];
  const watchedExcludedIngredients = form.watch("excludedIngredients") || [];

  const addDietaryPreference = (preference: string) => {
    if (!watchedDietaryPreferences.includes(preference)) {
      form.setValue("dietaryPreferences", [...watchedDietaryPreferences, preference]);
    }
  };

  const removeDietaryPreference = (preference: string) => {
    form.setValue(
      "dietaryPreferences",
      watchedDietaryPreferences.filter((p) => p !== preference)
    );
  };

  const addCuisinePreference = (preference: string) => {
    if (!watchedCuisinePreferences.includes(preference)) {
      form.setValue("cuisinePreferences", [...watchedCuisinePreferences, preference]);
    }
  };

  const removeCuisinePreference = (preference: string) => {
    form.setValue(
      "cuisinePreferences",
      watchedCuisinePreferences.filter((p) => p !== preference)
    );
  };

  const addExcludedIngredient = (ingredient: string) => {
    if (ingredient.trim() && !watchedExcludedIngredients.includes(ingredient.trim())) {
      form.setValue("excludedIngredients", [...watchedExcludedIngredients, ingredient.trim()]);
    }
  };

  const removeExcludedIngredient = (ingredient: string) => {
    form.setValue(
      "excludedIngredients",
      watchedExcludedIngredients.filter((i) => i !== ingredient)
    );
  };

  return (
    <div className="space-y-6">
      {/* Dietary Preferences */}
      <FormField
        control={form.control}
        name="dietaryPreferences"
        render={() => (
          <FormItem>
            <FormLabel>Dietary Preferences</FormLabel>
            <FormDescription>Select any dietary preferences or restrictions</FormDescription>

            <div className="space-y-4">
              <Select onValueChange={addDietaryPreference}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dietary preferences" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DIETARY_PREFERENCES.filter((pref) => !watchedDietaryPreferences.includes(pref)).map((preference) => (
                    <SelectItem key={preference} value={preference}>
                      {preference}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {watchedDietaryPreferences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedDietaryPreferences.map((preference) => (
                    <Badge
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      key={preference}
                      onClick={() => removeDietaryPreference(preference)}
                      variant="secondary"
                    >
                      {preference} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Cuisine Preferences */}
      <FormField
        control={form.control}
        name="cuisinePreferences"
        render={() => (
          <FormItem>
            <FormLabel>Cuisine Preferences</FormLabel>
            <FormDescription>Select cuisines you enjoy</FormDescription>

            <div className="space-y-4">
              <Select onValueChange={addCuisinePreference}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine preferences" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CUISINE_PREFERENCES.filter((cuisine) => !watchedCuisinePreferences.includes(cuisine)).map(
                    (cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              {watchedCuisinePreferences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedCuisinePreferences.map((cuisine) => (
                    <Badge
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      key={cuisine}
                      onClick={() => removeCuisinePreference(cuisine)}
                      variant="outline"
                    >
                      {cuisine} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Excluded Ingredients */}
      <FormField
        control={form.control}
        name="excludedIngredients"
        render={() => (
          <FormItem>
            <FormLabel>Excluded Ingredients</FormLabel>
            <FormDescription>Add ingredients you want to avoid (press Enter to add)</FormDescription>

            <div className="space-y-4">
              <Input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    addExcludedIngredient(target.value);
                    target.value = "";
                  }
                }}
                placeholder="e.g., mushrooms, nuts, dairy"
              />

              {watchedExcludedIngredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedExcludedIngredients.map((ingredient) => (
                    <Badge
                      className="cursor-pointer"
                      key={ingredient}
                      onClick={() => removeExcludedIngredient(ingredient)}
                      variant="destructive"
                    >
                      {ingredient} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Time Constraints */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="maxPrepTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Prep Time (minutes)</FormLabel>
              <FormControl>
                <Input
                  max="180"
                  min="0"
                  placeholder="e.g., 30"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormDescription>Maximum preparation time per recipe</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxCookTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Cook Time (minutes)</FormLabel>
              <FormControl>
                <Input
                  max="240"
                  min="0"
                  placeholder="e.g., 45"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormDescription>Maximum cooking time per recipe</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
