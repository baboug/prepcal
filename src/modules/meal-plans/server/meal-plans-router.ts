import { z } from "zod";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import { createMealPlanSchema, generateMealPlanSchema, mealPlanFiltersSchema, updateMealPlanSchema } from "../schemas";
import * as mealPlansAiService from "./meal-plans-ai-service";
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
  generateMeals: protectedProcedure.input(generateMealPlanSchema).mutation(async ({ input }) => {
    return await mealPlansAiService.generateMealPlan(input);
  }),
});
