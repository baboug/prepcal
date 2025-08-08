import { and, between, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { type InsertUserBilling, mealPlan, usageEvent, userBilling } from "@/lib/db/schema";

export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  const [row] = await db.select().from(userBilling).where(eq(userBilling.userId, userId)).limit(1);
  return (row?.plan as "free" | "pro") ?? "free";
}

export async function setUserPlan(userId: string, plan: "free" | "pro") {
  const [existing] = await db.select().from(userBilling).where(eq(userBilling.userId, userId)).limit(1);
  if (existing) {
    await db.update(userBilling).set({ plan, updatedAt: new Date() }).where(eq(userBilling.userId, userId));
  } else {
    const row: InsertUserBilling = { userId, plan };
    await db.insert(userBilling).values(row).onConflictDoNothing({ target: userBilling.userId });
  }
}

export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export async function countMealPlansThisMonth(userId: string): Promise<number> {
  const { start, end } = getCurrentMonthRange();
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(mealPlan)
    .where(and(eq(mealPlan.userId, userId), between(mealPlan.createdAt, start, end)));
  return Number(count ?? 0);
}

export async function countAiGenerationsThisMonth(userId: string): Promise<number> {
  const { start, end } = getCurrentMonthRange();
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(usageEvent)
    .where(
      and(eq(usageEvent.userId, userId), eq(usageEvent.type, "ai_generate"), between(usageEvent.createdAt, start, end))
    );
  return Number(count ?? 0);
}

export async function recordAiGeneration(userId: string) {
  await db.insert(usageEvent).values({ userId, type: "ai_generate" });
}
