import { z } from "zod";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import { createMealPlanSchema, mealPlanFiltersSchema, updateMealPlanSchema } from "../schemas";
import * as mealPlansService from "./meal-plans-service";

export const mealPlansRouter = createTRPCRouter({
  create: protectedProcedure.input(createMealPlanSchema).mutation(async ({ ctx, input }) => {
    return await mealPlansService.createMealPlan(ctx.auth.user.id, input);
  }),
  update: protectedProcedure.input(updateMealPlanSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    return await mealPlansService.updateMealPlan(id, ctx.auth.user.id, data);
  }),
  getOne: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await mealPlansService.getMealPlan(input.id, ctx.auth.user.id);
  }),
  getMany: protectedProcedure.input(mealPlanFiltersSchema.optional()).query(async ({ ctx, input }) => {
    return await mealPlansService.getMealPlans(
      ctx.auth.user.id,
      input || {
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
        status: "all",
        sortBy: "createdAt",
        sortOrder: "desc",
      }
    );
  }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    return await mealPlansService.deleteMealPlan(input.id, ctx.auth.user.id);
  }),
  updateShoppingList: protectedProcedure
    .input(z.object({ id: z.number(), shoppingList: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await mealPlansService.updateShoppingList(input.id, ctx.auth.user.id, input.shoppingList);
    }),
  updateMealPrepPlan: protectedProcedure
    .input(z.object({ id: z.number(), mealPrepPlan: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await mealPlansService.updateMealPrepPlan(input.id, ctx.auth.user.id, input.mealPrepPlan);
    }),

  // Placeholder for AI generation - will be implemented later
  generateMealPlan: protectedProcedure
    .input(z.object({ preferences: z.record(z.unknown()) }))
    .mutation(({ ctx, input }) => {
      return mealPlansService.generateMealPlan(ctx.auth.user.id, input.preferences);
    }),
  generateShoppingList: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return mealPlansService.generateShoppingList(input.id, ctx.auth.user.id);
  }),
  generateMealPrepGuide: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return mealPlansService.generateMealPrepGuide(input.id, ctx.auth.user.id);
  }),
});
