// No external imports needed here
import * as repo from "./payments-repository";

// Limits (per month)
const FREE_LIMITS = {
  mealPlans: 3,
  aiGenerations: 3,
};

const PRO_LIMITS = {
  mealPlans: 1000, // practically unlimited
  aiGenerations: 1000,
};

export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  return await repo.getUserPlan(userId);
}

export async function canCreateMealPlan(userId: string): Promise<boolean> {
  const plan = await repo.getUserPlan(userId);
  const count = await repo.countMealPlansThisMonth(userId);
  const limit = plan === "pro" ? PRO_LIMITS.mealPlans : FREE_LIMITS.mealPlans;
  return count < limit;
}

export async function canUseAiGeneration(userId: string): Promise<boolean> {
  const plan = await repo.getUserPlan(userId);
  const count = await repo.countAiGenerationsThisMonth(userId);
  const limit = plan === "pro" ? PRO_LIMITS.aiGenerations : FREE_LIMITS.aiGenerations;
  return count < limit;
}

export async function recordAiGeneration(userId: string) {
  await repo.recordAiGeneration(userId);
}

export async function setPlanBySubscription(userId: string, hasActivePro: boolean) {
  await repo.setUserPlan(userId, hasActivePro ? "pro" : "free");
}

export function getCheckoutSlug(): string {
  return "pro"; // slug configured in auth plugin
}

export async function getLimits(userId: string) {
  const plan = await repo.getUserPlan(userId);
  const mealPlansUsed = await repo.countMealPlansThisMonth(userId);
  const aiUsed = await repo.countAiGenerationsThisMonth(userId);
  const mealPlansLimit = plan === "pro" ? PRO_LIMITS.mealPlans : FREE_LIMITS.mealPlans;
  const aiLimit = plan === "pro" ? PRO_LIMITS.aiGenerations : FREE_LIMITS.aiGenerations;
  return {
    plan,
    mealPlans: { used: mealPlansUsed, limit: mealPlansLimit, canCreate: mealPlansUsed < mealPlansLimit },
    aiGenerations: { used: aiUsed, limit: aiLimit, canGenerate: aiUsed < aiLimit },
  } as const;
}
