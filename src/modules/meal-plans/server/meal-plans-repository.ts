import { and, asc, desc, eq, gte, ilike, lte, or, type SQL, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { meal, mealPlan, recipe } from "@/lib/db/schema";
import type { CreateMealPlanData, MealPlanFilters } from "../types";

export async function createMealPlan(userId: string, data: CreateMealPlanData) {
  const [createdMealPlan] = await db
    .insert(mealPlan)
    .values({
      userId,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      mealsPerDay: data.mealsPerDay,
    })
    .returning();

  if (data.meals.length > 0) {
    await db.insert(meal).values(
      data.meals.map((mealData) => ({
        mealPlanId: createdMealPlan.id,
        recipeId: mealData.recipeId,
        day: mealData.day,
        mealType: mealData.mealType,
        servingSize: mealData.servingSize,
        sortOrder: mealData.sortOrder,
      }))
    );
  }

  return createdMealPlan;
}

export async function updateMealPlan(mealPlanId: number, userId: string, data: CreateMealPlanData) {
  const [updatedMealPlan] = await db
    .update(mealPlan)
    .set({
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      mealsPerDay: data.mealsPerDay,
    })
    .where(and(eq(mealPlan.id, mealPlanId), eq(mealPlan.userId, userId)))
    .returning();

  if (!updatedMealPlan) {
    throw new Error("Meal plan not found or unauthorized");
  }

  await db.delete(meal).where(eq(meal.mealPlanId, mealPlanId));

  if (data.meals.length > 0) {
    await db.insert(meal).values(
      data.meals.map((mealData) => ({
        mealPlanId: updatedMealPlan.id,
        recipeId: mealData.recipeId,
        day: mealData.day,
        mealType: mealData.mealType,
        servingSize: mealData.servingSize,
        sortOrder: mealData.sortOrder,
      }))
    );
  }

  return updatedMealPlan;
}

export async function getMealPlan(mealPlanId: number, userId: string) {
  const mealPlanData = await db
    .select({
      id: mealPlan.id,
      name: mealPlan.name,
      description: mealPlan.description,
      startDate: mealPlan.startDate,
      endDate: mealPlan.endDate,
      mealsPerDay: mealPlan.mealsPerDay,
      targetCalories: mealPlan.targetCalories,
      targetProtein: mealPlan.targetProtein,
      targetCarbs: mealPlan.targetCarbs,
      targetFat: mealPlan.targetFat,
      shoppingList: mealPlan.shoppingList,
      mealPrepPlan: mealPlan.mealPrepPlan,
      createdAt: mealPlan.createdAt,
      updatedAt: mealPlan.updatedAt,
    })
    .from(mealPlan)
    .where(and(eq(mealPlan.id, mealPlanId), eq(mealPlan.userId, userId)))
    .limit(1);

  if (!mealPlanData || mealPlanData.length === 0) {
    throw new Error("Meal plan not found");
  }

  const mealsData = await db
    .select({
      id: meal.id,
      day: meal.day,
      mealType: meal.mealType,
      servingSize: meal.servingSize,
      sortOrder: meal.sortOrder,
      recipe: {
        id: recipe.id,
        name: recipe.name,
        calories: recipe.calories,
        macros: recipe.macros,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        imageUrl: recipe.imageUrl,
      },
    })
    .from(meal)
    .innerJoin(recipe, eq(meal.recipeId, recipe.id))
    .where(eq(meal.mealPlanId, mealPlanId))
    .orderBy(asc(meal.day), asc(meal.sortOrder));

  return {
    ...mealPlanData[0],
    meals: mealsData.map((m) => ({
      id: m.id,
      recipeId: m.recipe.id,
      day: m.day,
      mealType: m.mealType,
      servingSize: m.servingSize,
      sortOrder: m.sortOrder,
      recipe: m.recipe,
    })),
  };
}

export async function getMealPlans(userId: string, filters: MealPlanFilters) {
  const { search, page, pageSize, status, sortBy, sortOrder } = filters;

  const whereConditions = [eq(mealPlan.userId, userId)];

  if (search) {
    const searchCondition = or(ilike(mealPlan.name, `%${search}%`), ilike(mealPlan.description, `%${search}%`));
    if (searchCondition) {
      whereConditions.push(searchCondition);
    }
  }

  if (status !== "all") {
    const now = new Date().toISOString();
    if (status === "active") {
      whereConditions.push(gte(mealPlan.endDate, now));
    } else if (status === "archived") {
      whereConditions.push(lte(mealPlan.endDate, now));
    }
  }

  let orderByClause: SQL;
  const direction = sortOrder === "asc" ? asc : desc;

  switch (sortBy) {
    case "name":
      orderByClause = direction(mealPlan.name);
      break;
    case "startDate":
      orderByClause = direction(mealPlan.startDate);
      break;
    case "endDate":
      orderByClause = direction(mealPlan.endDate);
      break;
    default:
      orderByClause = direction(mealPlan.createdAt);
  }

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(mealPlan)
    .where(and(...whereConditions));

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const items = await db
    .select({
      id: mealPlan.id,
      name: mealPlan.name,
      description: mealPlan.description,
      startDate: mealPlan.startDate,
      endDate: mealPlan.endDate,
      mealsPerDay: mealPlan.mealsPerDay,
      createdAt: mealPlan.createdAt,
      updatedAt: mealPlan.updatedAt,
    })
    .from(mealPlan)
    .where(and(...whereConditions))
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    items,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize,
  };
}

export async function deleteMealPlan(mealPlanId: number, userId: string) {
  const result = await db
    .delete(mealPlan)
    .where(and(eq(mealPlan.id, mealPlanId), eq(mealPlan.userId, userId)))
    .returning({ id: mealPlan.id });

  if (!result || result.length === 0) {
    throw new Error("Meal plan not found or you don't have permission to delete it");
  }

  return result[0];
}

export async function updateMealPlanShoppingList(mealPlanId: number, userId: string, shoppingList: string) {
  const [updated] = await db
    .update(mealPlan)
    .set({
      shoppingList,
      updatedAt: new Date(),
    })
    .where(and(eq(mealPlan.id, mealPlanId), eq(mealPlan.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Meal plan not found or you don't have permission to update it");
  }

  return updated;
}

export async function updateMealPlanMealPrep(mealPlanId: number, userId: string, mealPrepPlan: string) {
  const [updated] = await db
    .update(mealPlan)
    .set({
      mealPrepPlan,
      updatedAt: new Date(),
    })
    .where(and(eq(mealPlan.id, mealPlanId), eq(mealPlan.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Meal plan not found or you don't have permission to update it");
  }

  return updated;
}
