"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/modules/profile/types";
import { NutritionTargetsCard } from "@/modules/profile/ui/components/nutrition-targets-card";
import { CalorieComparisonChart } from "@/modules/profile/ui/components/onboarding/calorie-comparison-chart";
import { MacronutrientChart } from "@/modules/profile/ui/components/onboarding/macronutrient-chart";
import { NextStepsCard } from "@/modules/profile/ui/components/onboarding/next-steps-card";
import { calculateNutritionProfile } from "@/modules/profile/utils/calculations";
import { GOAL_INFO } from "@/modules/profile/utils/constants";

export function Results() {
  const form = useFormContext<ProfileData>();
  const formData = form.watch();
  const router = useRouter();

  const { bmr, tdee, calories, protein, carbs, fat } = calculateNutritionProfile(formData);

  const handleComplete = () => {
    router.push("/dashboard");
  };

  const goalInfo = GOAL_INFO[formData.goal];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-semibold text-3xl">🎉 Your Personalized Plan</h2>
        <p className="text-muted-foreground">
          Based on your {formData.dietType} approach and {goalInfo.text.toLowerCase()} goal
        </p>
      </div>
      <NutritionTargetsCard calories={calories} carbs={carbs} fat={fat} protein={protein} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MacronutrientChart
          calories={calories}
          carbs={carbs}
          dietType={formData.dietType}
          fat={fat}
          protein={protein}
        />
        <CalorieComparisonChart bmr={bmr} calories={calories} goal={formData.goal} tdee={tdee} />
      </div>
      <NextStepsCard />
      <div className="flex justify-end">
        <Button onClick={handleComplete} size="lg">
          <CheckCircle className="size-4" />
          Complete Setup
        </Button>
      </div>
      <div className="rounded-lg border border-muted bg-muted p-4 text-center dark:border-0">
        <p className="text-muted-foreground text-sm">
          <strong>Disclaimer:</strong> This is an estimate based on established formulas. Individual results may vary.
          Consult a healthcare provider before making significant dietary changes.
        </p>
      </div>
    </div>
  );
}
