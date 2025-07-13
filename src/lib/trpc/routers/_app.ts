import { mealPlansRouter } from "@/modules/meal-plans/server/meal-plans-router";
import { profileRouter } from "@/modules/profile/server/profile-router";
import { recipesRouter } from "@/modules/recipes/server/recipes-router";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
  recipes: recipesRouter,
  mealPlans: mealPlansRouter,
});

export type AppRouter = typeof appRouter;
