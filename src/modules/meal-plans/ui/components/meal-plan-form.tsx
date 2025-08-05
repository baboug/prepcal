"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/lib/trpc/client";
import { MEAL_PLAN_STEPS } from "../../constants";
import { type MealPlanData, MealPlanStep, type SortByOption } from "../../types";
import { getDaysFromNowISO, getTomorrowISO } from "../../utils/date";
import { validateStep } from "../../utils/validation";
import { MealPlanNutritionCard } from "./meal-plan-nutrition-card";

import { MealPlanAiGenerationStep } from "./steps/meal-plan-ai-generation-step";
import { MealPlanBasicInfoStep } from "./steps/meal-plan-basic-info-step";
import { MealPlanMealsStep } from "./steps/meal-plan-meals-step";
import { MealPlanPreferencesStep } from "./steps/meal-plan-preferences-step";
import { MealPlanPreviewStep } from "./steps/meal-plan-preview-step";

interface MealPlanFormProps {
  onSuccess?: () => void;
}

interface RecipeFilters {
  search: string;
  category: string;
  cuisine: string;
  myRecipes: boolean;
  sortBy: SortByOption;
  sortOrder: "asc" | "desc";
}

export function MealPlanForm({ onSuccess }: MealPlanFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<MealPlanStep>(MealPlanStep.BASIC_INFO);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [recipeFilters, setRecipeFilters] = useState<RecipeFilters>({
    search: "",
    category: "",
    cuisine: "",
    myRecipes: false,
    sortBy: "default",
    sortOrder: "desc",
  });

  const { data: recipesData } = useQuery(
    trpc.recipes.getMany.queryOptions({
      search: recipeFilters.search,
      category: recipeFilters.category,
      cuisine: recipeFilters.cuisine,
      myRecipes: recipeFilters.myRecipes,
      sortBy: recipeFilters.sortBy,
      sortOrder: recipeFilters.sortOrder,
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm<MealPlanData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      startDate: getTomorrowISO(),
      endDate: getDaysFromNowISO(7),
      mealsPerDay: 3,
      dietaryPreferences: [],
      cuisinePreferences: [],
      excludedIngredients: [],
      meals: [],
    },
  });

  const createMealPlan = useMutation(
    trpc.mealPlans.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.mealPlans.getMany.queryOptions({}));
        router.push("/meal-plans");
        onSuccess?.();
      },
      onError: () => {
        form.setError("root", {
          message: "Failed to create meal plan. Please try again.",
        });
      },
    })
  );

  const currentStepData = MEAL_PLAN_STEPS.find((step) => step.id === currentStep);
  const currentStepOrder = currentStepData?.order || 1;
  const totalSteps = MEAL_PLAN_STEPS.length;
  const progress = (currentStepOrder / totalSteps) * 100;

  const validateCurrentStep = async () => {
    const formData = form.getValues();
    const { isValid, errors } = await validateStep(currentStep, formData);

    if (!isValid && errors) {
      for (const issue of errors.issues) {
        const fieldPath = issue.path.join(".");
        if (fieldPath in form.getValues()) {
          form.setError(fieldPath as keyof MealPlanData, { message: issue.message });
        }
      }
    }

    return isValid;
  };

  const getNextStep = (current: MealPlanStep): MealPlanStep | null => {
    const currentOrder = MEAL_PLAN_STEPS.find((step) => step.id === current)?.order || 1;
    const nextStep = MEAL_PLAN_STEPS.find((step) => step.order === currentOrder + 1);
    return nextStep?.id || null;
  };

  const getPreviousStep = (current: MealPlanStep): MealPlanStep | null => {
    const currentOrder = MEAL_PLAN_STEPS.find((step) => step.id === current)?.order || 1;
    const previousStep = MEAL_PLAN_STEPS.find((step) => step.order === currentOrder - 1);
    return previousStep?.id || null;
  };

  const isFirstStep = currentStepOrder === 1;
  const isLastStep = currentStepOrder === totalSteps;

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      const nextStep = getNextStep(currentStep);
      if (nextStep) {
        setCurrentStep(nextStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      setCurrentStep(previousStep);
    }
  };

  const handleAiStepCompletion = () => {
    const nextStep = getNextStep(currentStep);

    if (nextStep) {
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async () => {
    if (isLastStep) {
      const formData = form.getValues();
      createMealPlan.mutate(formData);
    } else {
      await handleNext();
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>
              Step {currentStepOrder} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress className="h-2" value={progress} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{currentStepData?.title}</CardTitle>
            <CardDescription>{currentStepData?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                {currentStep === MealPlanStep.BASIC_INFO && <MealPlanBasicInfoStep form={form} />}
                {currentStep === MealPlanStep.PREFERENCES && <MealPlanPreferencesStep form={form} />}
                {currentStep === MealPlanStep.MEALS && (
                  <MealPlanMealsStep
                    form={form}
                    onRecipeFiltersChange={setRecipeFilters}
                    onSelectedDayChange={setSelectedDay}
                    recipeFilters={recipeFilters}
                    recipes={recipesData?.items || []}
                    selectedDay={selectedDay}
                  />
                )}
                {currentStep === MealPlanStep.AI_GENERATION && (
                  <MealPlanAiGenerationStep
                    form={form}
                    onSkipAI={handleAiStepCompletion}
                    onSuccess={handleAiStepCompletion}
                  />
                )}
                {currentStep === MealPlanStep.PREVIEW && <MealPlanPreviewStep form={form} />}
                <div className="flex justify-between pt-6">
                  <Button disabled={isFirstStep} onClick={handlePrevious} type="button" variant="outline">
                    Previous
                  </Button>
                  <Button disabled={createMealPlan.isPending} isLoading={createMealPlan.isPending} type="submit">
                    {isLastStep ? "Create Meal Plan" : "Next"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <Form {...form}>
            <MealPlanNutritionCard isPreviewStep={currentStep === MealPlanStep.PREVIEW} selectedDay={selectedDay} />
          </Form>
        </div>
      </div>
    </div>
  );
}
