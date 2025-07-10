"use client";

import { Settings } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

export function StandardSettings() {
  const form = useFormContext();
  const [showOptionalSettings, setShowOptionalSettings] = useState(false);

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          onClick={() => setShowOptionalSettings(!showOptionalSettings)}
          type="button"
        >
          <Settings className="size-4" />
          {showOptionalSettings ? "Hide" : "Show"} Optional Settings
        </button>
      </div>
      {showOptionalSettings && (
        <FormField
          control={form.control}
          name="fatCarbSplit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Fat/Carb Split ({field.value}% fat, {100 - field.value}% carbs)
              </FormLabel>
              <FormDescription>
                Adjust the ratio of fat to carbohydrates in your remaining calories after protein.
              </FormDescription>
              <FormControl>
                <Slider
                  className="w-full"
                  max={60}
                  min={20}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={5}
                  value={[field.value]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
