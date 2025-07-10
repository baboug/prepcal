import { OnboardingStep, type ProfileData } from "@/modules/profile/types";

export const canGoToNextStep = (data: ProfileData, currentStep: OnboardingStep) => {
  const { dietType, gender, birthDate, height, weight, activityLevel, goal } = data;
  switch (currentStep) {
    case OnboardingStep.DIET_TYPE:
      return !!dietType;
    case OnboardingStep.BASIC_INFO:
      return !!gender && !!birthDate;
    case OnboardingStep.PHYSICAL_STATS:
      return !!height?.unit && !!height?.value && !!weight?.unit && !!weight?.value;
    case OnboardingStep.ACTIVITY_LEVEL:
      return !!activityLevel;
    case OnboardingStep.GOALS:
      return !!goal;
    case OnboardingStep.ADVANCED:
      return true;
    default:
      return true;
  }
};
