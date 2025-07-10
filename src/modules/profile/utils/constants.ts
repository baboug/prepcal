import { Activity, Dumbbell, Footprints, Home, Minus, Target, TrendingDown, TrendingUp, Zap } from "lucide-react";

import { OnboardingStep } from "@/modules/profile/types";

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  extremelyActive: 1.9,
};

export const GOAL_ADJUSTMENTS = {
  loseWeight: -0.2,
  loseWeightSlowly: -0.1,
  maintain: 0,
  gainWeightSlowly: 0.1,
  gainWeight: 0.2,
};

export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const DIET_TYPE_INFO = {
  standard: {
    text: "Standard",
    color: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  leangains: {
    text: "Leangains",
    color: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  keto: {
    text: "Ketogenic",
    color: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
};

export const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    title: "Mostly Sedentary",
    icon: Home,
    multiplier: "1.2x",
    description: "Little or no exercise, office job",
    detail: "In many cases, this would correspond to less than 5,000 steps a day.",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
  },
  {
    value: "lightlyActive",
    title: "Lightly Active",
    icon: Footprints,
    multiplier: "1.375x",
    description: "Light daily activity & exercise 1-3 days per week",
    detail: "Light exercise or sports 1-3 days/week, or light daily activity",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    value: "moderatelyActive",
    title: "Moderately Active",
    icon: Activity,
    multiplier: "1.55x",
    description: "Moderate daily activity & exercise 3-5 days per week",
    detail: "In many cases, this would correspond to 5,000 - 15,000 steps a day.",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    value: "veryActive",
    title: "Very Active",
    icon: Dumbbell,
    multiplier: "1.725x",
    description: "Physically demanding lifestyle & exercise 6-7 days per week",
    detail: "In many cases, this would correspond to more than 15,000 steps a day.",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    value: "extremelyActive",
    title: "Extremely Active",
    icon: Zap,
    multiplier: "1.9x",
    description: "Hard daily exercise/sports & physical job",
    detail: "Very heavy physical work or exercise twice a day, training for marathon, triathlon, etc.",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
];

export const GOALS = [
  {
    value: "loseWeight",
    title: "Lose Weight",
    icon: TrendingDown,
    percentage: "-20%",
    description: "Goal of losing weight at a faster pace",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    value: "loseWeightSlowly",
    title: "Slowly Lose Weight",
    icon: TrendingDown,
    percentage: "-10%",
    description: "Goal of losing weight at a moderate pace",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    value: "maintain",
    title: "Maintain Weight",
    icon: Minus,
    percentage: "0%",
    description: "Goal of maintaining current weight",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    value: "gainWeightSlowly",
    title: "Slowly Gain Weight",
    icon: TrendingUp,
    percentage: "+10%",
    description: "Goal of gaining weight at a moderate pace",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    value: "gainWeight",
    title: "Gain Weight",
    icon: TrendingUp,
    percentage: "+20%",
    description: "Goal of gaining weight at a faster pace",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export const PROTEIN_OPTIONS = [
  {
    value: "0.82",
    title: "0.82g per pound",
    description: "Minimum effective dose for muscle growth",
    detail: "Research-backed minimum for muscle protein synthesis",
  },
  {
    value: "1.0",
    title: "1g per pound",
    description: "Standard recommendation with margin of error",
    detail: "Most popular choice - provides buffer for optimal results",
    recommended: true,
  },
  {
    value: "1.5",
    title: "1.5g per pound",
    description: "Higher protein for enhanced satiety",
    detail: "Great for appetite control and very active individuals",
  },
  {
    value: "custom",
    title: "Custom amount",
    description: "Set your own protein target",
    detail: "Advanced users with specific requirements",
  },
];

export const GOAL_INFO = {
  loseWeight: {
    icon: TrendingDown,
    text: "Lose Weight",
    caloriesText: "Deficit",
    color: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },
  loseWeightSlowly: {
    icon: TrendingDown,
    text: "Lose Weight Slowly",
    caloriesText: "Deficit",
    color: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
  maintain: {
    icon: Target,
    text: "Maintain Weight",
    caloriesText: "Maintenance",
    color: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  gainWeightSlowly: {
    icon: TrendingUp,
    text: "Gain Weight Slowly",
    caloriesText: "Surplus",
    color: "text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  gainWeight: {
    icon: TrendingUp,
    text: "Gain Weight",
    caloriesText: "Surplus",
    color: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

export const ONBOARDING_STEPS = [
  { id: OnboardingStep.DIET_TYPE, title: "Diet Type", description: "Choose your approach" },
  { id: OnboardingStep.BASIC_INFO, title: "Basic Info", description: "Tell us about yourself" },
  { id: OnboardingStep.PHYSICAL_STATS, title: "Physical Stats", description: "Height and weight" },
  { id: OnboardingStep.ACTIVITY_LEVEL, title: "Activity Level", description: "How active are you?" },
  { id: OnboardingStep.GOALS, title: "Goals", description: "What do you want to achieve?" },
  { id: OnboardingStep.ADVANCED, title: "Advanced", description: "Fine-tune your plan" },
  { id: OnboardingStep.RESULTS, title: "Results", description: "Your personalized plan" },
];
