"use client";

import { FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEAL_TYPES } from "../../constants";
import type { MealData } from "../../types";

interface MealCardEditFormProps {
  meal: MealData;
  index: number;
  onUpdate: (index: number, updates: Partial<MealData>) => void;
}

export function MealCardEditForm({ meal, index, onUpdate }: MealCardEditFormProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormItem>
        <FormLabel>Meal Type</FormLabel>
        <Select
          onValueChange={(value) => {
            onUpdate(index, { mealType: value as MealData["mealType"] });
          }}
          value={meal.mealType}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {MEAL_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
      <FormItem>
        <FormLabel>Serving Size</FormLabel>
        <FormControl>
          <Input
            max="10"
            min="0.1"
            onChange={(e) => {
              const value = Number.parseFloat(e.target.value);
              if (!Number.isNaN(value)) {
                onUpdate(index, { servingSize: value });
              }
            }}
            step="0.1"
            type="number"
            value={meal.servingSize}
          />
        </FormControl>
        <FormDescription>Multiplier for recipe portions</FormDescription>
      </FormItem>
    </div>
  );
}
