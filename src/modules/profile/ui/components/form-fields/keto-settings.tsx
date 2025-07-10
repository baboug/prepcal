"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function KetoSettings() {
  const form = useFormContext();

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="font-semibold text-foreground text-lg">Ketogenic Diet Settings</h3>
      <FormField
        control={form.control}
        name="maxCarbs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Daily Carbs (grams)</FormLabel>
            <FormDescription>Typical ketogenic range is 20-50g per day. Adjust based on your goals.</FormDescription>
            <FormControl>
              <Input
                className="max-w-32"
                max="100"
                min="5"
                placeholder="25"
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
