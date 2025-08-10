import { and, between, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { mealPlan, usageEvent, userBilling } from "@/lib/db/schema";

export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  const [row] = await db.select().from(userBilling).where(eq(userBilling.userId, userId)).limit(1);
  return (row?.plan as "free" | "pro") ?? "free";
}

export async function setUserPlan(userId: string, plan: "free" | "pro") {
  await db
    .insert(userBilling)
    .values({ userId, plan })
    .onConflictDoUpdate({
      target: userBilling.userId,
      set: {
        plan,
        updatedAt: new Date(),
      },
    });
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

export async function consumeAiGenerationWithinLimit(userId: string, limit: number): Promise<boolean> {
  const { start, end } = getCurrentMonthRange();
  const result = await db.execute<{ inserted: number }>(sql`
    WITH c AS (
      SELECT count(*)::int AS used
      FROM ${usageEvent}
      WHERE ${usageEvent.userId} = ${userId}
        AND ${usageEvent.type} = 'ai_generate'
        AND ${usageEvent.createdAt} BETWEEN ${start} AND ${end}
    ),
    ins AS (
      INSERT INTO ${usageEvent} (user_id, type)
      SELECT ${userId}, 'ai_generate'
      FROM c
      WHERE used < ${limit}
      RETURNING 1
    )
    SELECT COALESCE((SELECT 1 FROM ins), 0) AS inserted;
  `);

  const inserted = result.rows?.[0]?.inserted ?? 0;
  return inserted === 1;
}
