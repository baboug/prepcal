import { z } from "zod";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import { createRecipeSchema, recipeFiltersSchema, scrapeRecipeSchema, updateRecipeSchema } from "../schemas";
import * as recipesService from "./recipes-service";

export const recipesRouter = createTRPCRouter({
  create: protectedProcedure.input(createRecipeSchema).mutation(async ({ ctx, input }) => {
    return await recipesService.createRecipe(ctx.auth.user.id, input);
  }),
  update: protectedProcedure.input(updateRecipeSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    return await recipesService.updateRecipe(id, ctx.auth.user.id, data);
  }),
  getOne: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id;
    return await recipesService.getRecipe(input.id, userId);
  }),
  getMany: protectedProcedure.input(recipeFiltersSchema.optional()).query(async ({ ctx, input }) => {
    return await recipesService.getRecipes(
      ctx.auth.user.id,
      input || {
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: "default",
        sortOrder: "desc",
      }
    );
  }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    return await recipesService.deleteRecipe(input.id, ctx.auth.user.id);
  }),
  scrapeAndCreate: protectedProcedure.input(scrapeRecipeSchema).mutation(async ({ ctx, input }) => {
    return await recipesService.scrapeAndCreateRecipe(ctx.auth.user.id, input);
  }),
});
