"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "better-auth";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Confetti from "@/components/ui/confetti";
import { Form } from "@/components/ui/form";
import { Stepper, StepperIndicator, StepperItem, StepperTrigger } from "@/components/ui/stepper";
import { useTRPC } from "@/lib/trpc/client";
import { getUserFirstName } from "@/lib/utils";
import { profileSchema } from "@/modules/profile/schemas";
import type { ProfileData } from "@/modules/profile/types";
import { OnboardingStep } from "@/modules/profile/types";
import { ActivityLevel } from "@/modules/profile/ui/components/form-fields/activity-level";
import { AdvancedSettings } from "@/modules/profile/ui/components/form-fields/advanced-settings";
import { BasicInfo } from "@/modules/profile/ui/components/form-fields/basic-info";
import { DietType } from "@/modules/profile/ui/components/form-fields/diet-type";
import { Goals } from "@/modules/profile/ui/components/form-fields/goals";
import { PhysicalStats } from "@/modules/profile/ui/components/form-fields/physical-stats";
import { Results } from "@/modules/profile/ui/components/onboarding/results";
import { calculateNutritionProfile } from "@/modules/profile/utils/calculations";
import { ONBOARDING_STEPS } from "@/modules/profile/utils/constants";
import { canGoToNextStep } from "@/modules/profile/utils/validations";

interface OnboardingFormProps {
  user: User;
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createProfile = useMutation(
    trpc.profile.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.profile.get.queryOptions());
        window.scrollTo({ top: 0, behavior: "instant" });
        setShowConfetti(true);
      },
      onError: () => {
        toast.error("Failed to complete onboarding");
      },
    })
  );

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dietType: "standard" as const,
      gender: "male" as const,
      activityLevel: "moderatelyActive" as const,
      goal: "maintain" as const,
      proteinAmount: "1.0" as const,
      fatCarbSplit: 30,
      muscleMass: "standard" as const,
      birthDate: {
        month: 1,
        day: 1,
        year: 1990,
      },
      height: {
        unit: "cm" as const,
        value: 180,
      },
      weight: {
        unit: "kg" as const,
        value: 75,
      },
    },
  });

  const formData = form.watch();

  const { calories, protein, carbs, fat, bmr, tdee } = calculateNutritionProfile(formData as ProfileData);

  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleNextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }

    if (currentStep === ONBOARDING_STEPS.length - 1) {
      const currentFormData = form.watch();
      const dataWithNutrition = {
        ...currentFormData,
        fatCarbSplit: currentFormData.fatCarbSplit ?? 30,
        bmr,
        tdee,
        calories,
        protein,
        carbs,
        fat,
      } as ProfileData;
      createProfile.mutate(dataWithNutrition);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {currentStep === 1 && (
        <div className="mb-4 text-center">
          <h1 className="font-semibold text-3xl text-foreground">👋 Welcome, {getUserFirstName(user)}</h1>
          <p className="text-muted-foreground">Let's create your personalized nutrition plan</p>
        </div>
      )}
      <div className="mb-8">
        <Stepper className="gap-1" onValueChange={setCurrentStep} value={currentStep}>
          {ONBOARDING_STEPS.map((step) => (
            <StepperItem className="flex-1" key={step.id} step={step.id}>
              <StepperTrigger asChild className="w-full flex-col items-start gap-2">
                <StepperIndicator asChild className="h-1 w-full bg-border">
                  <span className="sr-only">Step {step.id}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}
        </Stepper>
      </div>
      <Form {...form}>
        <div className="mb-6">
          {currentStep === OnboardingStep.DIET_TYPE && <DietType />}
          {currentStep === OnboardingStep.BASIC_INFO && <BasicInfo />}
          {currentStep === OnboardingStep.PHYSICAL_STATS && <PhysicalStats />}
          {currentStep === OnboardingStep.ACTIVITY_LEVEL && <ActivityLevel />}
          {currentStep === OnboardingStep.GOALS && <Goals />}
          {currentStep === OnboardingStep.ADVANCED && <AdvancedSettings />}
          {currentStep === OnboardingStep.RESULTS && <Results />}
        </div>
        {currentStep < ONBOARDING_STEPS.length && (
          <div className="flex justify-between">
            <Button
              disabled={currentStep === 1 || createProfile.isPending}
              onClick={handlePrevStep}
              type="button"
              variant="outline"
            >
              <ArrowLeftIcon className="mr-2 size-4" />
              Previous
            </Button>
            <Button
              disabled={
                !canGoToNextStep(formData as ProfileData, ONBOARDING_STEPS[currentStep - 1].id) ||
                createProfile.isPending
              }
              isLoading={createProfile.isPending}
              onClick={handleNextStep}
              type="button"
            >
              Next
              <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          </div>
        )}
      </Form>
      <Confetti duration={5000} isActive={showConfetti} loop={false} zIndex={100} />
    </>
  );
}
