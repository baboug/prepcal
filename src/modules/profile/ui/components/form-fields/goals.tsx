"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { GOALS } from "@/modules/profile/utils/constants";

export function Goals() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-semibold text-2xl">What is your goal?</h2>
        <p className="text-accent-foreground">Select your current goal. This determines your daily calorie target.</p>
      </div>
      <FormField
        control={form.control}
        name="goal"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value}>
                {GOALS.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <RadioGroupCard
                      description={goal.description}
                      icon={
                        <div className={cn("rounded-lg p-1 md:p-2", goal.bgColor, goal.iconColor)}>
                          {Icon && <Icon className="size-4 md:size-5" />}
                        </div>
                      }
                      id={goal.value}
                      key={goal.value}
                      label={goal.title}
                      subLabel={
                        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                          {goal.percentage}
                        </span>
                      }
                      value={goal.value}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
