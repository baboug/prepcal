import type { inferRouterOutputs } from "@trpc/server";
import type { z } from "zod";

import type { AppRouter } from "@/lib/trpc/routers/_app";
import type { profileSchema } from "@/modules/profile/schemas";

export type ProfileData = z.infer<typeof profileSchema>;

export type ProfileGet = inferRouterOutputs<AppRouter>["profile"]["get"];

export const OnboardingStep = {
  DIET_TYPE: 1,
  BASIC_INFO: 2,
  PHYSICAL_STATS: 3,
  ACTIVITY_LEVEL: 4,
  GOALS: 5,
  ADVANCED: 6,
  RESULTS: 7,
} as const;

export type OnboardingStep = (typeof OnboardingStep)[keyof typeof OnboardingStep];
