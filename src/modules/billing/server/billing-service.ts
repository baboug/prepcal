import { FREE_LIMITS, PRO_LIMITS } from "../constants";
import * as billingRepository from "./billing-repository";

export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  return await billingRepository.getUserPlan(userId);
}

export async function canCreateMealPlan(userId: string): Promise<boolean> {
  const plan = await billingRepository.getUserPlan(userId);
  const count = await billingRepository.countMealPlansThisMonth(userId);
  const limit = plan === "pro" ? PRO_LIMITS.mealPlans : FREE_LIMITS.mealPlans;
  return count < limit;
}

export async function canUseAiGeneration(userId: string): Promise<boolean> {
  const plan = await billingRepository.getUserPlan(userId);
  const limit = plan === "pro" ? PRO_LIMITS.aiGenerations : FREE_LIMITS.aiGenerations;
  const consumed = await billingRepository.countAiGenerationsThisMonth(userId);
  return consumed < limit;
}

export async function recordAiGeneration(userId: string) {
  const plan = await getUserPlan(userId);
  const limit = plan === "pro" ? PRO_LIMITS.aiGenerations : FREE_LIMITS.aiGenerations;
  const consumed = await billingRepository.consumeAiGenerationWithinLimit(userId, limit);
  if (!consumed) {
    throw new Error("AI generation limit exceeded");
  }
}

export async function setPlanBySubscription(userId: string, hasActivePro: boolean) {
  await billingRepository.setUserPlan(userId, hasActivePro ? "pro" : "free");
}

export function getCheckoutSlug(): string {
  return "pro";
}

export async function getLimits(userId: string) {
  const plan = await billingRepository.getUserPlan(userId);
  const mealPlansUsed = await billingRepository.countMealPlansThisMonth(userId);
  const aiUsed = await billingRepository.countAiGenerationsThisMonth(userId);
  const mealPlansLimit = plan === "pro" ? PRO_LIMITS.mealPlans : FREE_LIMITS.mealPlans;
  const aiLimit = plan === "pro" ? PRO_LIMITS.aiGenerations : FREE_LIMITS.aiGenerations;
  return {
    plan,
    mealPlans: { used: mealPlansUsed, limit: mealPlansLimit, canCreate: mealPlansUsed < mealPlansLimit },
    aiGenerations: { used: aiUsed, limit: aiLimit, canGenerate: aiUsed < aiLimit },
  } as const;
}
