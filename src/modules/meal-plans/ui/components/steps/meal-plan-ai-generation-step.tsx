"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc/client";
import type { MealPlanData } from "@/modules/meal-plans/types";
import { MealPlanLoadingScreen } from "../meal-plan-loading-screen";

interface MealPlanAiGenerationStepProps {
  form: UseFormReturn<MealPlanData>;
  onSkipAI?: () => void;
  onSuccess?: () => void;
}

export function MealPlanAiGenerationStep({ form, onSkipAI, onSuccess }: MealPlanAiGenerationStepProps) {
  const trpc = useTRPC();
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: userProfile } = useQuery(trpc.profile.get.queryOptions());

  const generateMeals = useMutation(
    trpc.mealPlans.generateMeals.mutationOptions({
      onSuccess: (generatedMeals) => {
        form.setValue("meals", generatedMeals);

        toast.success(`Generated ${generatedMeals.length} meals for your meal plan!`);
        setIsGenerating(false);

        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      },
      onError: (error) => {
        toast.error(
          error.message || "AI generation limit reached this month. Upgrade to Pro on the Billing page to continue."
        );
        setIsGenerating(false);
      },
    })
  );

  const handleGenerateMeals = () => {
    if (!userProfile) {
      toast.error("Please complete your profile first to get nutrition targets.");
      return;
    }

    if (!(userProfile.calories && userProfile.protein && userProfile.carbs && userProfile.fat)) {
      toast.error("Your profile is missing nutrition targets. Please update your profile.");
      return;
    }

    const formData = form.getValues();

    const generateRequest = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      mealsPerDay: formData.mealsPerDay,
      dietaryPreferences: formData.dietaryPreferences,
      cuisinePreferences: formData.cuisinePreferences,
      excludedIngredients: formData.excludedIngredients,
      maxPrepTime: formData.maxPrepTime,
      maxCookTime: formData.maxCookTime,
      nutritionTargets: {
        calories: userProfile.calories,
        protein: userProfile.protein,
        carbs: userProfile.carbs,
        fat: userProfile.fat,
      },
    };

    setIsGenerating(true);
    generateMeals.mutate(generateRequest);
  };

  if (isGenerating) {
    return <MealPlanLoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="font-medium text-lg">Choose Your Approach</h3>
        <p className="text-muted-foreground">
          Let AI generate your meal plan or continue manually to select recipes yourself
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="size-5 text-primary" />
              <CardTitle className="text-primary">AI Generation</CardTitle>
            </div>
            <CardDescription>
              Let our AI create a personalized meal plan based on your preferences and nutrition targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-center space-x-2">
                <div className="size-1.5 rounded-full bg-primary" />
                <span>Optimized for your nutrition goals</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="size-1.5 rounded-full bg-primary" />
                <span>Respects dietary preferences</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="size-1.5 rounded-full bg-primary" />
                <span>Balanced meal variety</span>
              </li>
            </ul>

            <Button
              className="w-full"
              disabled={generateMeals.isPending || !userProfile}
              onClick={handleGenerateMeals}
              size="lg"
            >
              <SparklesIcon className="mr-2 size-4" />
              Generate with AI
            </Button>

            {!userProfile && (
              <p className="text-center text-muted-foreground text-xs">
                Complete your profile to enable AI meal generation
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ArrowRightIcon className="size-5" />
              <CardTitle>Manual Selection</CardTitle>
            </div>
            <CardDescription>Continue to the next step to manually select and customize your meals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-center space-x-2">
                <div className="size-1.5 rounded-full bg-muted-foreground" />
                <span>Full control over recipe selection</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="size-1.5 rounded-full bg-muted-foreground" />
                <span>Customize serving sizes</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="size-1.5 rounded-full bg-muted-foreground" />
                <span>Add or remove meals as needed</span>
              </li>
            </ul>
            <Button className="w-full" onClick={onSkipAI} size="lg" variant="outline">
              Continue Manually
              <ArrowRightIcon className="ml-2 size-4" />
            </Button>
            <p className="text-center text-muted-foreground text-xs">
              Hitting limits?{" "}
              <Link className="underline" href="/billing">
                Upgrade to Pro
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="text-center text-muted-foreground text-sm">
        <p>You can always regenerate meals with AI later or manually adjust them in the next step</p>
      </div>
    </div>
  );
}
