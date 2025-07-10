import type { InsertUserProfile, UserProfile } from "@/lib/db/schema";
import type { ProfileData } from "../types";

export const mapProfileDataToDbSchema = (data: ProfileData, userId: string): Omit<InsertUserProfile, "id"> => {
  return {
    userId,
    dietType: data.dietType,
    gender: data.gender,
    birthMonth: data.birthDate.month,
    birthDay: data.birthDate.day,
    birthYear: data.birthDate.year,
    heightUnit: data.height.unit,
    heightValue: typeof data.height.value === "number" ? data.height.value : null,
    heightFeet: typeof data.height.value === "object" ? data.height.value.feet : null,
    heightInches: typeof data.height.value === "object" ? data.height.value.inches : null,
    weightUnit: data.weight.unit,
    weightValue: data.weight.value,
    activityLevel: data.activityLevel,
    goal: data.goal,
    customCalorieDeficit: data.customCalorieDeficit ?? null,
    proteinAmount: data.proteinAmount,
    customProteinAmount: data.customProteinAmount ?? null,
    fatCarbSplit: data.fatCarbSplit,
    bodyFat: data.bodyFat ?? null,
    muscleMass: data.muscleMass ?? null,
    dailySteps: data.dailySteps ?? null,
    maxCarbs: data.maxCarbs ?? null,
    bmr: data.bmr ?? null,
    tdee: data.tdee ?? null,
    calories: data.calories ?? null,
    protein: data.protein ?? null,
    carbs: data.carbs ?? null,
    fat: data.fat ?? null,
  };
};

export const mapProfileToResponse = (profile: UserProfile) => {
  return {
    userId: profile.userId,
    dietType: profile.dietType,
    gender: profile.gender,
    birthDate: {
      month: profile.birthMonth,
      day: profile.birthDay,
      year: profile.birthYear,
    },
    height: {
      unit: profile.heightUnit,
      value:
        profile.heightUnit === "cm"
          ? profile.heightValue
          : {
              feet: profile.heightFeet,
              inches: profile.heightInches,
            },
    },
    weight: {
      unit: profile.weightUnit,
      value: profile.weightValue,
    },
    activityLevel: profile.activityLevel,
    goal: profile.goal,
    customCalorieDeficit: profile.customCalorieDeficit ?? undefined,
    proteinAmount: profile.proteinAmount,
    customProteinAmount: profile.customProteinAmount ?? undefined,
    fatCarbSplit: profile.fatCarbSplit,
    bodyFat: profile.bodyFat ?? undefined,
    muscleMass: profile.muscleMass ?? undefined,
    dailySteps: profile.dailySteps ?? undefined,
    maxCarbs: profile.maxCarbs ?? undefined,
    bmr: profile.bmr ?? undefined,
    tdee: profile.tdee ?? undefined,
    calories: profile.calories ?? undefined,
    protein: profile.protein ?? undefined,
    carbs: profile.carbs ?? undefined,
    fat: profile.fat ?? undefined,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
};
