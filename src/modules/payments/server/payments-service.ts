import { FREE_LIMITS, PRO_LIMITS } from "../constants";
import * as paymentsRepository from "./payments-repository";

export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  return await paymentsRepository.getUserPlan(userId);
}

export async function canCreateMealPlan(userId: string): Promise<boolean> {
  const plan = await paymentsRepository.getUserPlan(userId);
  const count = await paymentsRepository.countMealPlansThisMonth(userId);
  const limit = plan === "pro" ? PRO_LIMITS.mealPlans : FREE_LIMITS.mealPlans;
  return count < limit;
}

export async function canUseAiGeneration(userId: string): Promise<boolean> {
  const plan = await paymentsRepository.getUserPlan(userId);
  const limit = plan === "pro" ? PRO_LIMITS.aiGenerations : FREE_LIMITS.aiGenerations;
  const consumed = await paymentsRepository.consumeAiGenerationWithinLimit(userId, limit);
  return consumed;
}

export async function recordAiGeneration(userId: string) {
  const plan = await getUserPlan(userId);
  const limit = plan === "pro" ? PRO_LIMITS.aiGenerations : FREE_LIMITS.aiGenerations;
  const consumed = await paymentsRepository.consumeAiGenerationWithinLimit(userId, limit);
  if (!consumed) {
    throw new Error("AI generation limit exceeded");
  }
}

export async function setPlanBySubscription(userId: string, hasActivePro: boolean) {
  await paymentsRepository.setUserPlan(userId, hasActivePro ? "pro" : "free");
}

export function getCheckoutSlug(): string {
  return "pro";
}

export async function getLimits(userId: string) {
  const plan = await paymentsRepository.getUserPlan(userId);
  const mealPlansUsed = await paymentsRepository.countMealPlansThisMonth(userId);
  const aiUsed = await paymentsRepository.countAiGenerationsThisMonth(userId);
  const mealPlansLimit = plan === "pro" ? PRO_LIMITS.mealPlans : FREE_LIMITS.mealPlans;
  const aiLimit = plan === "pro" ? PRO_LIMITS.aiGenerations : FREE_LIMITS.aiGenerations;
  return {
    plan,
    mealPlans: { used: mealPlansUsed, limit: mealPlansLimit, canCreate: mealPlansUsed < mealPlansLimit },
    aiGenerations: { used: aiUsed, limit: aiLimit, canGenerate: aiUsed < aiLimit },
  } as const;
}
