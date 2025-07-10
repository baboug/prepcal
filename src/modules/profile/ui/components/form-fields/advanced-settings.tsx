"use client";

import { Beef, Info } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { PROTEIN_OPTIONS } from "@/modules/profile/utils/constants";
import { KetoSettings } from "./keto-settings";
import { LeangainsSettings } from "./leangains-settings";
import { StandardSettings } from "./standard-settings";

export function AdvancedSettings() {
  const form = useFormContext();

  const proteinAmount = form.watch("proteinAmount");
  const dietType = form.watch("dietType");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-semibold text-2xl">Advanced Settings</h2>
        <p className="text-accent-foreground">Fine-tune your nutrition plan with these optional settings.</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Beef className="size-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-lg">How much protein?</h3>
        </div>
        <FormField
          control={form.control}
          name="proteinAmount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value}>
                  {PROTEIN_OPTIONS.map((option) => (
                    <RadioGroupCard
                      description={option.description}
                      icon={<Beef className="size-4" />}
                      id={option.value}
                      key={option.value}
                      label={option.title}
                      subLabel={
                        option.recommended && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 font-normal text-green-700 text-xs">
                            Recommended
                          </span>
                        )
                      }
                      value={option.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {proteinAmount === "custom" && (
          <FormField
            control={form.control}
            name="customProteinAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom protein amount (g per pound)</FormLabel>
                <FormControl>
                  <Input
                    className="max-w-32"
                    max="3.0"
                    min="0.5"
                    placeholder="1.2"
                    step="0.1"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      {dietType === "leangains" && <LeangainsSettings />}
      {dietType === "keto" && <KetoSettings />}
      {dietType === "standard" && <StandardSettings />}
      <div className="rounded-lg border border-accent-foreground bg-accent/25 p-4 text-sm dark:border-0">
        <div className="flex gap-2">
          <Info className="mt-0.5 size-4 flex-shrink-0 text-accent-foreground" />
          <p className="text-accent-foreground">
            <strong>Optional Settings:</strong> These settings allow you to customize your plan further. The defaults
            work well for most people, so feel free to skip any you're unsure about.
          </p>
        </div>
      </div>
    </div>
  );
}
