import { CARB_CALORIES_PER_GRAM, FAT_CALORIES_PER_GRAM, PROTEIN_CALORIES_PER_GRAM } from "@/lib/constants";
import type { ProfileData } from "../types";
import { ACTIVITY_MULTIPLIERS, CM_TO_IN, FT_TO_CM, GOAL_ADJUSTMENTS, KG_TO_LBS, LBS_TO_KG } from "./constants";

export function calculateNutritionProfile(data: ProfileData) {
  const calories = calculateCalories(data);
  const macros = calculateMacros(data);
  const bmr = calculateBMR(data);
  const tdee = calculateTDEE(data);

  return { calories, ...macros, bmr, tdee };
}

// Calculate BMR using Mifflin-St Jeor equation
export const calculateBMR = (formData: ProfileData) => {
  const weightKg = getWeightInKg(formData);
  const heightCm = getHeightInCm(formData);
  const age = calculateAge(formData);

  if (formData.gender === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
};

export const calculateTDEE = (formData: ProfileData) => {
  const bmr = calculateBMR(formData);
  const multiplier = ACTIVITY_MULTIPLIERS[formData.activityLevel];
  return bmr * multiplier;
};

export const calculateCalories = (formData: ProfileData) => {
  const tdee = calculateTDEE(formData);
  const adjustment = GOAL_ADJUSTMENTS[formData.goal];
  return Math.round(tdee * (1 + adjustment));
};

export const calculateProteinInGrams = (formData: ProfileData) => {
  const weightLbs = formData.weight.unit === "lbs" ? formData.weight.value : formData.weight.value * KG_TO_LBS;

  let proteinPerPound: number;
  if (formData.proteinAmount === "custom" && formData.customProteinAmount) {
    proteinPerPound = formData.customProteinAmount;
  } else {
    proteinPerPound = Number.parseFloat(formData.proteinAmount);
  }

  return Math.round(weightLbs * proteinPerPound);
};

export const calculateMacros = (formData: ProfileData) => {
  const calories = calculateCalories(formData);
  const protein = calculateProteinInGrams(formData);
  const proteinCalories = protein * PROTEIN_CALORIES_PER_GRAM;

  let carbs: number;
  let fat: number;

  if (formData.dietType === "keto") {
    carbs = formData.maxCarbs || 25;
    const carbCalories = carbs * CARB_CALORIES_PER_GRAM;
    const remainingCalories = calories - proteinCalories - carbCalories;
    fat = Math.round(remainingCalories / FAT_CALORIES_PER_GRAM);
  } else {
    const remainingCalories = calories - proteinCalories;
    const fatPercentage = formData.fatCarbSplit / 100;
    const fatCalories = remainingCalories * fatPercentage;
    const carbCalories = remainingCalories * (1 - fatPercentage);

    fat = Math.round(fatCalories / FAT_CALORIES_PER_GRAM);
    carbs = Math.round(carbCalories / CARB_CALORIES_PER_GRAM);
  }

  return { protein, carbs, fat };
};

export const getHeightInCm = (formData: ProfileData) => {
  if (formData.height.unit === "cm") {
    return Number(formData.height.value);
  }
  const heightObj = formData.height.value as { feet: number; inches: number };
  return heightObj.feet * FT_TO_CM + heightObj.inches * CM_TO_IN;
};

export const getWeightInKg = (formData: ProfileData) => {
  if (formData.weight.unit === "kg") {
    return formData.weight.value;
  }
  return formData.weight.value * LBS_TO_KG;
};

export const calculateAge = (formData: ProfileData) => {
  const today = new Date();
  const birthDate = new Date(formData.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
