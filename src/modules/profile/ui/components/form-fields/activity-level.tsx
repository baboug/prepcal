"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ACTIVITY_LEVELS } from "@/modules/profile/utils/constants";

export function ActivityLevel() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-semibold text-2xl">How active are you?</h2>
        <p className="text-accent-foreground">
          Select your level of daily physical activity outside of exercise (during work, leisure time, etc).
        </p>
      </div>
      <div className="rounded-lg border border-accent-foreground bg-accent/25 p-4 text-sm">
        <p className="text-accent-foreground">
          <strong>Important:</strong> Most people tend to overestimate their activity level. Base this on what you do
          outside the gym. If you're unsure, choose the lower option.
        </p>
      </div>
      <FormField
        control={form.control}
        name="activityLevel"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value}>
                {ACTIVITY_LEVELS.map((level) => {
                  const Icon = level.icon;
                  return (
                    <RadioGroupCard
                      description={level.description}
                      icon={
                        <div className={cn("rounded-lg p-1 md:p-2", level.bgColor, level.iconColor)}>
                          <Icon className="size-4 md:size-5" />
                        </div>
                      }
                      id={level.value}
                      key={level.value}
                      label={level.title}
                      subLabel={
                        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                          {level.multiplier}
                        </span>
                      }
                      value={level.value}
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
