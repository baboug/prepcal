"use client";

import { Beef, Info, Settings } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupCard, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { PROTEIN_OPTIONS } from "@/modules/profile/utils/constants";

export function AdvancedSettings() {
  const form = useFormContext();
  const [showOptionalSettings, setShowOptionalSettings] = useState(false);

  const proteinAmount = form.watch("proteinAmount");
  const dietType = form.watch("dietType");
  const gender = form.watch("gender");

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
      {dietType === "leangains" && (
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
                <FormDescription>
                  Use a pedometer or phone app for accuracy. Default is 5,000 if unsure.
                </FormDescription>
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
      )}
      {dietType === "keto" && (
        <div className="space-y-6 border-t pt-6">
          <h3 className="font-semibold text-foreground text-lg">Ketogenic Diet Settings</h3>
          <FormField
            control={form.control}
            name="maxCarbs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Daily Carbs (grams)</FormLabel>
                <FormDescription>
                  Typical ketogenic range is 20-50g per day. Adjust based on your goals.
                </FormDescription>
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
      )}
      {dietType === "standard" && (
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
      )}
      <div className="rounded-lg border border-accent-foreground bg-accent/25 p-4 text-sm">
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
