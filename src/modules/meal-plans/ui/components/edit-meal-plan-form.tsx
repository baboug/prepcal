"use client";

import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc/client";
import { MEAL_PLAN_STEPS } from "../../constants";
import { type MealPlanData, MealPlanStep, type SortByOption } from "../../types";
import { validateStep } from "../../utils/validation";
import { MealPlanNutritionCard } from "./meal-plan-nutrition-card";
import { MealPlanBasicInfoStep } from "./steps/meal-plan-basic-info-step";
import { MealPlanMealsStep } from "./steps/meal-plan-meals-step";
import { MealPlanPreferencesStep } from "./steps/meal-plan-preferences-step";
import { MealPlanPreviewStep } from "./steps/meal-plan-preview-step";

interface RecipeFilters {
  search: string;
  category: string;
  cuisine: string;
  myRecipes: boolean;
  sortBy: SortByOption;
  sortOrder: "asc" | "desc";
}

interface EditMealPlanFormProps {
  mealPlanId: number;
  onSuccess?: () => void;
}

export function EditMealPlanForm({ mealPlanId, onSuccess }: EditMealPlanFormProps) {
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

  // Filter out AI_GENERATION step for editing and reorder
  const editSteps = MEAL_PLAN_STEPS.filter((step) => step.id !== MealPlanStep.AI_GENERATION).map((step, index) => ({
    ...step,
    order: index + 1,
  }));

  const { data: existingMealPlan } = useSuspenseQuery(trpc.mealPlans.getOne.queryOptions({ id: mealPlanId }));

  const { data: recipesData } = useQuery(
    trpc.recipes.getMany.queryOptions({
      search: recipeFilters.search,
      category: recipeFilters.category,
      cuisine: recipeFilters.cuisine,
      myRecipes: recipeFilters.myRecipes,
      sortBy: recipeFilters.sortBy,
      sortOrder: recipeFilters.sortOrder,
      page: 1,
      pageSize: 50,
    })
  );

  const form = useForm<MealPlanData>({
    mode: "onChange",
    defaultValues: {
      name: existingMealPlan?.name || "",
      description: existingMealPlan?.description || "",
      startDate: existingMealPlan?.startDate || "",
      endDate: existingMealPlan?.endDate || "",
      mealsPerDay: existingMealPlan?.mealsPerDay || 0,
      dietaryPreferences: [],
      cuisinePreferences: [],
      excludedIngredients: [],
      meals: existingMealPlan?.meals.map((meal) => ({
        id: meal.id,
        recipeId: meal.recipeId,
        day: meal.day,
        mealType: meal.mealType,
        servingSize: meal.servingSize,
        sortOrder: meal.sortOrder,
        recipe: meal.recipe,
      })),
    },
  });

  const updateMealPlan = useMutation(
    trpc.mealPlans.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.mealPlans.getMany.queryOptions({}));
        await queryClient.invalidateQueries(trpc.mealPlans.getOne.queryOptions({ id: mealPlanId }));
        toast.success("Meal plan updated successfully");
        router.push("/meal-plans");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update meal plan");
        form.setError("root", {
          message: "Failed to update meal plan. Please try again.",
        });
      },
    })
  );

  const currentStepData = editSteps.find((step) => step.id === currentStep);
  const currentStepOrder = currentStepData?.order || 1;
  const totalSteps = editSteps.length;
  const progress = (currentStepOrder / totalSteps) * 100;

  const validateCurrentStep = async () => {
    const formData = form.getValues();
    const { isValid, errors } = await validateStep(currentStep, formData);

    if (!isValid && errors) {
      for (const issue of errors.issues) {
        const fieldPath = issue.path.join(".") as keyof MealPlanData;
        const formValues = form.getValues();
        if (fieldPath in formValues && typeof fieldPath === "string") {
          form.setError(fieldPath, { message: issue.message });
        }
      }
    }

    return isValid;
  };

  const getNextStep = (current: MealPlanStep): MealPlanStep | null => {
    const currentIndex = editSteps.findIndex((step) => step.id === current);
    const nextStep = editSteps[currentIndex + 1];
    return nextStep?.id || null;
  };

  const getPreviousStep = (current: MealPlanStep): MealPlanStep | null => {
    const currentIndex = editSteps.findIndex((step) => step.id === current);
    const previousStep = editSteps[currentIndex - 1];
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

  const onSubmit = async () => {
    if (isLastStep) {
      const formData = form.getValues();
      updateMealPlan.mutate({
        id: mealPlanId,
        ...formData,
      });
    } else {
      await handleNext();
    }
  };

  if (!existingMealPlan) {
    return <ErrorState description="Meal plan not found" title="Meal plan not found" />;
  }

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
                {currentStep === MealPlanStep.PREVIEW && <MealPlanPreviewStep form={form} />}
                <div className="flex justify-between pt-6">
                  <Button disabled={isFirstStep} onClick={handlePrevious} type="button" variant="outline">
                    Previous
                  </Button>
                  <Button disabled={updateMealPlan.isPending} isLoading={updateMealPlan.isPending} type="submit">
                    {isLastStep ? "Update Meal Plan" : "Next"}
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

export function EditMealPlanFormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function EditMealPlanFormError() {
  return (
    <ErrorState description="We couldn't load the meal plan data. Please try again." title="Error loading meal plan" />
  );
}
