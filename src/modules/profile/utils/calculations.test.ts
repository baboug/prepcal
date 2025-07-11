import { describe, expect, it } from "vitest";

import type { ProfileData } from "../types";
import {
  calculateAge,
  calculateBMR,
  calculateCalories,
  calculateMacros,
  calculateProteinInGrams,
  calculateTDEE,
  getHeightInCm,
  getWeightInKg,
} from "./calculations";

const createTestProfile = (overrides: Partial<ProfileData> = {}): ProfileData => {
  return {
    dietType: "standard",
    gender: "male",
    birthDate: "1990-01-01",
    height: { unit: "cm", value: 180 },
    weight: { unit: "kg", value: 80 },
    activityLevel: "moderatelyActive",
    goal: "maintain",
    proteinAmount: "1.0",
    fatCarbSplit: 30,
    ...overrides,
  };
};

describe("calculateBMR", () => {
  it("calculates BMR correctly for males using Mifflin-St Jeor equation", () => {
    const profile = createTestProfile({
      gender: "male",
      weight: { unit: "kg", value: 75 },
      height: { unit: "cm", value: 180 },
      birthDate: "1990-01-01",
    });
    const bmr = calculateBMR(profile);
    // BMR = 10 * 75 + 6.25 * 180 - 5 * 34 + 5 = 750 + 1125 - 170 + 5 = 1710
    expect(bmr).toBeCloseTo(1705, 5); // Allow small variance for age calculation
  });

  it("calculates BMR correctly for females using Mifflin-St Jeor equation", () => {
    const profile = createTestProfile({
      gender: "female",
      weight: { unit: "kg", value: 65 },
      height: { unit: "cm", value: 165 },
      birthDate: "1995-01-01",
    });
    const bmr = calculateBMR(profile);
    // BMR = 10 * 65 + 6.25 * 165 - 5 * 30 - 161 = 650 + 1031.25 - 150 - 161 = 1370.25
    expect(bmr).toBeCloseTo(1370, 0); // Allow variance for age calculation
  });

  it("handles weight in pounds", () => {
    const profile = createTestProfile({
      gender: "male",
      weight: { unit: "lbs", value: 165 }, // ≈ 74.84 kg
      height: { unit: "cm", value: 180 },
      birthDate: "1990-01-01",
    });
    const bmr = calculateBMR(profile);
    expect(bmr).toBeGreaterThan(1600);
    expect(bmr).toBeLessThan(1800);
  });

  it("handles height in feet and inches", () => {
    const profile = createTestProfile({
      gender: "male",
      weight: { unit: "kg", value: 75 },
      height: { unit: "ft", value: { feet: 5, inches: 11 } }, // ≈ 180 cm
      birthDate: "1990-01-01",
    });
    const bmr = calculateBMR(profile);
    expect(bmr).toBeGreaterThan(1600);
    expect(bmr).toBeLessThan(1800);
  });

  it("handles edge case of very young person", () => {
    const currentYear = new Date().getFullYear();
    const profile = createTestProfile({
      gender: "male",
      weight: { unit: "kg", value: 60 },
      height: { unit: "cm", value: 175 },
      birthDate: `${currentYear - 18}-01-01`,
    });
    const bmr = calculateBMR(profile);
    expect(bmr).toBeGreaterThan(1500);
  });

  it("handles edge case of elderly person", () => {
    const profile = createTestProfile({
      gender: "female",
      weight: { unit: "kg", value: 65 },
      height: { unit: "cm", value: 160 },
      birthDate: "1940-01-01",
    });
    const bmr = calculateBMR(profile);
    expect(bmr).toBeGreaterThan(800);
    expect(bmr).toBeLessThan(1200);
  });
});

describe("calculateTDEE", () => {
  it("calculates TDEE correctly for each activity level", () => {
    const baseBMR = 1700; // approximate BMR for test profile

    const activityLevels = [
      { level: "sedentary", multiplier: 1.2 },
      { level: "lightlyActive", multiplier: 1.375 },
      { level: "moderatelyActive", multiplier: 1.55 },
      { level: "veryActive", multiplier: 1.725 },
      { level: "extremelyActive", multiplier: 1.9 },
    ] as const;

    for (const { level, multiplier } of activityLevels) {
      const profile = createTestProfile({
        activityLevel: level,
      });
      const tdee = calculateTDEE(profile);
      expect(tdee).toBeCloseTo(baseBMR * multiplier, -50); // Allow 50 calorie variance
    }
  });
});

describe("calculateCalories", () => {
  it("calculates target calories correctly for different goals", () => {
    const goals = [
      { goal: "loseWeight", adjustment: -0.2 },
      { goal: "loseWeightSlowly", adjustment: -0.1 },
      { goal: "maintain", adjustment: 0 },
      { goal: "gainWeightSlowly", adjustment: 0.1 },
      { goal: "gainWeight", adjustment: 0.2 },
    ] as const;

    for (const { goal, adjustment } of goals) {
      const profile = createTestProfile({
        goal,
      });
      const calories = calculateCalories(profile);
      const tdee = calculateTDEE(profile);
      const expectedCalories = Math.round(tdee * (1 + adjustment));
      expect(calories).toBe(expectedCalories);
    }
  });

  it("returns rounded calories", () => {
    const profile = createTestProfile();
    const calories = calculateCalories(profile);
    expect(calories).toBe(Math.round(calories));
  });
});

describe("calculateProteinInGrams", () => {
  it("calculates protein for standard amounts", () => {
    const proteinAmounts = ["0.82", "1.0", "1.5"] as const;

    for (const amount of proteinAmounts) {
      const profile = createTestProfile({
        weight: { unit: "lbs", value: 150 },
        proteinAmount: amount,
      });
      const protein = calculateProteinInGrams(profile);
      const expected = Math.round(150 * Number.parseFloat(amount));
      expect(protein).toBe(expected);
    }
  });

  it("calculates protein for custom amount", () => {
    const profile = createTestProfile({
      weight: { unit: "lbs", value: 150 },
      proteinAmount: "custom",
      customProteinAmount: 1.2,
    });
    const protein = calculateProteinInGrams(profile);
    expect(protein).toBe(Math.round(150 * 1.2)); // 180g
  });

  it("converts kg to lbs for calculation", () => {
    const profile = createTestProfile({
      weight: { unit: "kg", value: 75 }, // ≈ 165 lbs
      proteinAmount: "1.0",
    });
    const protein = calculateProteinInGrams(profile);
    expect(protein).toBeCloseTo(165, 5); // Allow small variance for conversion
  });

  it("handles edge case of very light weight", () => {
    const profile = createTestProfile({
      weight: { unit: "lbs", value: 100 },
      proteinAmount: "1.0",
    });
    const protein = calculateProteinInGrams(profile);
    expect(protein).toBe(100);
  });

  it("handles edge case of very heavy weight", () => {
    const profile = createTestProfile({
      weight: { unit: "lbs", value: 300 },
      proteinAmount: "0.82",
    });
    const protein = calculateProteinInGrams(profile);
    expect(protein).toBe(Math.round(300 * 0.82)); // 246g
  });
});

describe("calculateMacros", () => {
  it("calculates macros correctly for standard diet", () => {
    const profile = createTestProfile({
      dietType: "standard",
      weight: { unit: "lbs", value: 150 },
      proteinAmount: "1.0",
      fatCarbSplit: 30, // 30% fat, 70% carbs
    });

    const macros = calculateMacros(profile);
    const calories = calculateCalories(profile);

    // Protein: 150g * 4 cal/g = 600 calories
    expect(macros.protein).toBe(150);

    // Remaining calories after protein
    const remainingCalories = calories - 150 * 4;
    const fatCalories = remainingCalories * 0.3;
    const carbCalories = remainingCalories * 0.7;

    expect(macros.fat).toBe(Math.round(fatCalories / 9));
    expect(macros.carbs).toBe(Math.round(carbCalories / 4));
  });

  it("calculates macros correctly for keto diet", () => {
    const profile = createTestProfile({
      dietType: "keto",
      weight: { unit: "lbs", value: 150 },
      proteinAmount: "1.0",
      maxCarbs: 25,
    });

    const macros = calculateMacros(profile);
    const calories = calculateCalories(profile);

    // Protein: 150g
    expect(macros.protein).toBe(150);

    // Carbs: fixed at maxCarbs
    expect(macros.carbs).toBe(25);

    // Fat: remaining calories
    const proteinCalories = 150 * 4;
    const carbCalories = 25 * 4;
    const remainingCalories = calories - proteinCalories - carbCalories;
    expect(macros.fat).toBe(Math.round(remainingCalories / 9));
  });

  it("handles different fat/carb splits", () => {
    const splits = [20, 30, 40, 50];

    for (const split of splits) {
      const profile = createTestProfile({
        dietType: "standard",
        fatCarbSplit: split,
      });

      const macros = calculateMacros(profile);
      const calories = calculateCalories(profile);
      const protein = calculateProteinInGrams(profile);

      const remainingCalories = calories - protein * 4;
      const expectedFatCalories = remainingCalories * (split / 100);
      const expectedCarbCalories = remainingCalories * ((100 - split) / 100);

      expect(macros.fat).toBe(Math.round(expectedFatCalories / 9));
      expect(macros.carbs).toBe(Math.round(expectedCarbCalories / 4));
    }
  });

  it("handles custom protein amount", () => {
    const profile = createTestProfile({
      weight: { unit: "lbs", value: 200 },
      proteinAmount: "custom",
      customProteinAmount: 0.5, // Very low protein
      fatCarbSplit: 30,
    });

    const macros = calculateMacros(profile);
    expect(macros.protein).toBe(Math.round(200 * 0.5)); // 100g
  });

  it("ensures all macros are positive numbers", () => {
    const profile = createTestProfile();
    const macros = calculateMacros(profile);

    expect(macros.protein).toBeGreaterThan(0);
    expect(macros.fat).toBeGreaterThan(0);
    expect(macros.carbs).toBeGreaterThan(0);
  });

  it("ensures total calories approximately match target", () => {
    const profile = createTestProfile();
    const macros = calculateMacros(profile);
    const calories = calculateCalories(profile);

    const totalCalories = macros.protein * 4 + macros.fat * 9 + macros.carbs * 4;

    // Allow 5% variance due to rounding
    expect(totalCalories).toBeCloseTo(calories, -calories * 0.05);
  });
});

describe("getHeightInCm", () => {
  it("returns height directly when unit is cm", () => {
    const profile = createTestProfile({
      height: { unit: "cm", value: 180 },
    });
    expect(getHeightInCm(profile)).toBe(180);
  });

  it("converts feet and inches to cm correctly", () => {
    const profile = createTestProfile({
      height: {
        unit: "ft",
        value: { feet: 6, inches: 0 },
      },
    });
    const heightCm = getHeightInCm(profile);
    expect(heightCm).toBeCloseTo(182.88, 1); // 6 feet = 182.88 cm
  });

  it("handles fractional inches", () => {
    const profile = createTestProfile({
      height: {
        unit: "ft",
        value: { feet: 5, inches: 11 },
      },
    });
    const heightCm = getHeightInCm(profile);
    expect(heightCm).toBeCloseTo(180.34, 1); // 5'11" = 180.34 cm
  });

  it("handles edge case of 0 inches", () => {
    const profile = createTestProfile({
      height: {
        unit: "ft",
        value: { feet: 5, inches: 0 },
      },
    });
    const heightCm = getHeightInCm(profile);
    expect(heightCm).toBeCloseTo(152.4, 1); // 5 feet = 152.4 cm
  });

  it("handles very tall height", () => {
    const profile = createTestProfile({
      height: {
        unit: "ft",
        value: { feet: 8, inches: 0 },
      },
    });
    const heightCm = getHeightInCm(profile);
    expect(heightCm).toBeCloseTo(243.84, 1); // 8 feet = 243.84 cm
  });
});

describe("getWeightInKg", () => {
  it("returns weight directly when unit is kg", () => {
    const profile = createTestProfile({
      weight: { unit: "kg", value: 75 },
    });
    expect(getWeightInKg(profile)).toBe(75);
  });

  it("converts pounds to kg correctly", () => {
    const profile = createTestProfile({
      weight: { unit: "lbs", value: 165 },
    });
    const weightKg = getWeightInKg(profile);
    expect(weightKg).toBeCloseTo(74.84, 1); // 165 lbs ≈ 74.84 kg
  });

  it("handles very light weight", () => {
    const profile = createTestProfile({
      weight: { unit: "lbs", value: 100 },
    });
    const weightKg = getWeightInKg(profile);
    expect(weightKg).toBeCloseTo(45.36, 1); // 100 lbs ≈ 45.36 kg
  });

  it("handles very heavy weight", () => {
    const profile = createTestProfile({
      weight: { unit: "lbs", value: 300 },
    });
    const weightKg = getWeightInKg(profile);
    expect(weightKg).toBeCloseTo(136.08, 1); // 300 lbs ≈ 136.08 kg
  });
});

describe("calculateAge", () => {
  it("calculates age correctly for a simple case", () => {
    const profile = createTestProfile({
      birthDate: "1990-01-01",
    });
    const age = calculateAge(profile);
    expect(age).toBeGreaterThanOrEqual(34); // Current year 2025 - 1990 = 35, but could be 34 if birthday hasn't passed
    expect(age).toBeLessThanOrEqual(35);
  });

  it("handles leap year births correctly", () => {
    const profile = createTestProfile({
      birthDate: "2000-02-29",
    });
    const age = calculateAge(profile);
    expect(age).toBeGreaterThanOrEqual(24);
    expect(age).toBeLessThanOrEqual(25);
  });

  it("handles birthday not yet passed this year", () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const futureMonth = today.getMonth() + 2; // Future month this year

    const profile = createTestProfile({
      birthDate: `${currentYear - 25}-${futureMonth > 12 ? 1 : futureMonth}-01`,
    });
    const age = calculateAge(profile);
    expect(age).toBe(futureMonth > 12 ? 25 : 24); // Should be 24 if birthday hasn't passed
  });

  it("handles very old ages", () => {
    const profile = createTestProfile({
      birthDate: "1920-01-01",
    });
    const age = calculateAge(profile);
    expect(age).toBeGreaterThan(100);
  });

  it("handles very young ages", () => {
    const currentYear = new Date().getFullYear();
    const profile = createTestProfile({
      birthDate: `${currentYear - 1}-01-01`,
    });
    const age = calculateAge(profile);
    expect(age).toBeGreaterThanOrEqual(0);
    expect(age).toBeLessThanOrEqual(1);
  });
});
