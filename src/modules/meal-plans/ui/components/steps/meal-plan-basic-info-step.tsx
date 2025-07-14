"use client";

import { CalendarIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DEFAULT_MEALS_PER_DAY, MAX_MEALS_PER_DAY, MIN_MEALS_PER_DAY } from "../../../constants";
import type { MealPlanData } from "../../../types";
import { formatDate } from "../../../utils/date";

interface MealPlanBasicInfoStepProps {
  form: UseFormReturn<MealPlanData>;
}

export function MealPlanBasicInfoStep({ form }: MealPlanBasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meal Plan Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., My Weekly Meal Plan" />
            </FormControl>
            <FormDescription>Give your meal plan a memorable name</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="e.g., High-protein meal plan for muscle building" rows={3} />
            </FormControl>
            <FormDescription>Describe your meal plan goals or notes</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      variant="outline"
                    >
                      {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    mode="single"
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    selected={field.value ? new Date(field.value) : undefined}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When your meal plan starts</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      variant="outline"
                    >
                      {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    disabled={(date) => {
                      const startDate = form.getValues("startDate");
                      if (!startDate) {
                        return true;
                      }
                      return date < new Date(startDate);
                    }}
                    initialFocus
                    mode="single"
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    selected={field.value ? new Date(field.value) : undefined}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When your meal plan ends</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="mealsPerDay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meals Per Day</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select meals per day" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.from({ length: MAX_MEALS_PER_DAY - MIN_MEALS_PER_DAY + 1 }, (_, i) => {
                  const value = MIN_MEALS_PER_DAY + i;
                  return (
                    <SelectItem key={value} value={value.toString()}>
                      {value} {value === 1 ? "meal" : "meals"} per day
                      {value === DEFAULT_MEALS_PER_DAY && " (recommended)"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormDescription>How many meals you want to plan for each day</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
