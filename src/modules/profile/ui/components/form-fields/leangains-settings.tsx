"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function LeangainsSettings() {
  const form = useFormContext();
  const gender = form.watch("gender");

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="font-semibold text-foreground text-lg">Leangains Settings</h3>
      <FormField
        control={form.control}
        name="bodyFat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Body Fat Percentage (optional)</FormLabel>
            <FormDescription>Use body fat calipers for accurate measurement. Skip if unsure.</FormDescription>
            <FormControl>
              <Input
                className="max-w-32"
                max="50"
                min="5"
                placeholder="15"
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="muscleMass"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Muscle Mass Level</FormLabel>
            <FormControl>
              <RadioGroup className="flex gap-4" onValueChange={field.onChange} value={field.value}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="muscle-standard" value="standard" />
                  <FormLabel htmlFor="muscle-standard">Standard</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="muscle-muscular" value="muscular" />
                  <FormLabel htmlFor="muscle-muscular">Muscular</FormLabel>
                </div>
                {gender === "male" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="muscle-very" value="veryMuscular" />
                    <FormLabel htmlFor="muscle-very">Very Muscular</FormLabel>
                  </div>
                )}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dailySteps"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Daily Steps (optional)</FormLabel>
            <FormDescription>Use a pedometer or phone app for accuracy. Default is 5,000 if unsure.</FormDescription>
            <FormControl>
              <Input
                className="max-w-32"
                max="30000"
                min="1000"
                placeholder="8000"
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
