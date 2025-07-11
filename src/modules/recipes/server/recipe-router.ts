import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import { createRecipeSchema, recipeFiltersSchema, scrapeRecipeSchema, updateRecipeSchema } from "../schemas";
import * as recipeService from "./recipe-service";

export const recipeRouter = createTRPCRouter({
  create: protectedProcedure.input(createRecipeSchema).mutation(async ({ ctx, input }) => {
    return await recipeService.createRecipe(ctx.auth.user.id, input);
  }),
  update: protectedProcedure.input(updateRecipeSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    return await recipeService.updateRecipe(id, ctx.auth.user.id, data);
  }),
  get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id;
    return await recipeService.getRecipe(input.id, userId);
  }),
  getUserRecipes: protectedProcedure.input(recipeFiltersSchema.optional()).query(async ({ ctx, input }) => {
    return await recipeService.getUserRecipes(ctx.auth.user.id, input || {});
  }),
  getPublicRecipes: protectedProcedure.input(recipeFiltersSchema.optional()).query(async ({ input }) => {
    return await recipeService.getPublicRecipes(input || {});
  }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    return await recipeService.deleteRecipe(input.id, ctx.auth.user.id);
  }),
  scrapeAndCreate: protectedProcedure.input(scrapeRecipeSchema).mutation(async ({ ctx, input }) => {
    return await recipeService.scrapeAndCreateRecipe(ctx.auth.user.id, input);
  }),
});
