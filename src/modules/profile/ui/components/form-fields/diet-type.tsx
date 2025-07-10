"use client";

import { Calculator, Target, Zap } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";

export function DietType() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-semibold text-2xl">Choose your diet type</h2>
        <p className="text-accent-foreground">Different approaches for different goals.</p>
      </div>
      <FormField
        control={form.control}
        name="dietType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value}>
                <RadioGroupCard
                  description="Perfect for beginners and most users. Provides accurate calorie estimates for weight loss, maintenance, or gain."
                  icon={
                    <div className="rounded-lg bg-blue-100 p-1 text-blue-600 md:p-2">
                      <Calculator className="size-4 md:size-5" />
                    </div>
                  }
                  id="standard"
                  label="Standard"
                  subLabel={
                    <span className="ml-2 hidden rounded-full bg-green-100 px-2 py-0.5 font-normal text-green-700 text-xs md:block">
                      Recommended
                    </span>
                  }
                  value="standard"
                />
                <RadioGroupCard
                  description="Ideal for lean bulking or cutting. Features higher protein recommendations and considers body composition factors."
                  icon={
                    <div className="rounded-lg bg-amber-100 p-1 text-amber-600 md:p-2">
                      <Target className="size-4 md:size-5" />
                    </div>
                  }
                  id="leangains"
                  label="Leangains"
                  value="leangains"
                />
                <RadioGroupCard
                  description="Allows you to set carb limits and optimizes fat intake for ketosis while maintaining adequate protein."
                  icon={
                    <div className="rounded-lg bg-purple-100 p-1 text-purple-600 md:p-2">
                      <Zap className="size-4 md:size-5" />
                    </div>
                  }
                  id="keto"
                  label="Ketogenic"
                  value="keto"
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
