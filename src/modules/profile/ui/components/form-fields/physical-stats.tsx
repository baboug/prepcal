"use client";

import { Ruler, Scale } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CM_TO_IN, KG_TO_LBS } from "@/modules/profile/utils/constants";

export function PhysicalStats() {
  const form = useFormContext();

  const handleHeightUnitChange = (unit: "cm" | "ft") => {
    const currentHeight = form.getValues("height");
    let newValue: number | { feet: number; inches: number };

    if (unit === "cm") {
      if (currentHeight?.unit === "ft" && typeof currentHeight.value === "object") {
        // Convert ft/inches to cm
        const totalInches = (currentHeight.value.feet || 0) * 12 + (currentHeight.value.inches || 0);
        newValue = Math.round(totalInches * CM_TO_IN);
      } else {
        newValue = 180; // default
      }
      form.setValue("height", {
        unit: "cm",
        value: newValue,
      });
    } else {
      if (currentHeight?.unit === "cm" && typeof currentHeight.value === "number") {
        // Convert cm to ft/inches
        const totalInches = Math.round(currentHeight.value / CM_TO_IN);
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        newValue = { feet, inches };
      } else {
        newValue = { feet: 5, inches: 11 }; // default
      }
      form.setValue("height", {
        unit: "ft",
        value: newValue,
      });
    }
  };

  const handleWeightUnitChange = (unit: "kg" | "lbs") => {
    const currentWeight = form.getValues("weight");
    let newWeightValue: number;

    if (unit === "lbs" && currentWeight?.unit === "kg" && typeof currentWeight.value === "number") {
      newWeightValue = Math.round(currentWeight.value * KG_TO_LBS);
    } else if (unit === "kg" && currentWeight?.unit === "lbs" && typeof currentWeight.value === "number") {
      newWeightValue = Math.round(currentWeight.value / KG_TO_LBS);
    } else {
      newWeightValue = unit === "kg" ? 70 : 150; // default
    }

    form.setValue("weight", {
      unit,
      value: newWeightValue,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-semibold text-2xl">Physical Information</h2>
        <p className="text-accent-foreground">Your height and weight help us calculate your baseline calorie needs.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Ruler className="size-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-lg">What is your height?</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Your height will be used to inform some of your dietary targets.
          </p>
        </div>
        <Tabs defaultValue="cm">
          <TabsList>
            <TabsTrigger onClick={() => handleHeightUnitChange("cm")} value="cm">
              Centimeters
            </TabsTrigger>
            <TabsTrigger onClick={() => handleHeightUnitChange("ft")} value="ft">
              Feet and Inches
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cm">
            <div className="max-w-xs">
              <FormField
                control={form.control}
                name="height.value"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="no-spinner py-6 text-center text-xl"
                          placeholder="180"
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={typeof field.value === "number" ? field.value : ""}
                        />
                      </FormControl>
                      <div className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground">cm</div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value="ft">
            <div className="max-w-xs">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feet</FormLabel>
                      <FormControl>
                        <Input
                          className="no-spinner text-center"
                          onChange={(e) =>
                            field.onChange({
                              feet: Number(e.target.value),
                              inches: typeof field.value === "object" ? field.value.inches : 0,
                            })
                          }
                          placeholder="5"
                          type="number"
                          value={typeof field.value === "object" ? field.value.feet : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inches</FormLabel>
                      <FormControl>
                        <Input
                          className="no-spinner text-center"
                          onChange={(e) =>
                            field.onChange({
                              feet: typeof field.value === "object" ? field.value.feet : 0,
                              inches: Number(e.target.value),
                            })
                          }
                          placeholder="11"
                          type="number"
                          value={typeof field.value === "object" ? field.value.inches : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale className="size-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-lg">What is your weight?</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            It is best to measure your weight at the same time each day, ideally in the morning.
          </p>
        </div>
        <Tabs defaultValue="kg">
          <TabsList>
            <TabsTrigger onClick={() => handleWeightUnitChange("kg")} value="kg">
              Kilograms
            </TabsTrigger>
            <TabsTrigger onClick={() => handleWeightUnitChange("lbs")} value="lbs">
              Pounds
            </TabsTrigger>
          </TabsList>
          <div className="max-w-xs">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        className="no-spinner py-6 text-center"
                        placeholder={field.value.unit === "kg" ? "70" : "150"}
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange({
                            ...field.value,
                            value: Number(e.target.value),
                          })
                        }
                        value={field.value.value ?? ""}
                      />
                    </FormControl>
                    <div className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground">
                      {field.value.unit}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
}
