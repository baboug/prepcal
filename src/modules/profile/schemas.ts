import { z } from "zod";

export const profileSchema = z.object({
  dietType: z.enum(["standard", "leangains", "keto"]),
  gender: z.enum(["male", "female"]),
  birthDate: z.object({
    month: z.number().min(1).max(12),
    day: z.number().min(1).max(31),
    year: z.number().min(1900).max(new Date().getFullYear()),
  }),
  height: z.object({
    unit: z.enum(["cm", "ft"]),
    value: z.union([
      z.number().min(100).max(250),
      z.object({
        feet: z.number().min(3).max(8),
        inches: z.number().min(0).max(11),
      }),
    ]),
  }),
  weight: z.object({
    unit: z.enum(["kg", "lbs"]),
    value: z.number().min(30).max(300),
  }),
  activityLevel: z.enum(["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "extremelyActive"]),
  goal: z.enum(["loseWeight", "loseWeightSlowly", "maintain", "gainWeightSlowly", "gainWeight"]),
  customCalorieDeficit: z.number().optional(),
  proteinAmount: z.enum(["0.82", "1.0", "1.5", "custom"]),
  customProteinAmount: z.number().optional(),
  fatCarbSplit: z.number().min(0).max(100).default(30),
  bodyFat: z.number().min(5).max(50).optional(),
  muscleMass: z.enum(["standard", "muscular", "veryMuscular"]).optional(),
  dailySteps: z.number().min(1000).max(30_000).optional(),
  maxCarbs: z.number().min(5).max(100).optional(),
  bmr: z.number().optional(),
  tdee: z.number().optional(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
});
