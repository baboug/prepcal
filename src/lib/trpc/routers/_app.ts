import { mealPlansRouter } from "@/modules/meal-plans/server/meal-plans-router";
import { paymentsRouter } from "@/modules/payments/server/payments-router";
import { profileRouter } from "@/modules/profile/server/profile-router";
import { recipesRouter } from "@/modules/recipes/server/recipes-router";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
  recipes: recipesRouter,
  mealPlans: mealPlansRouter,
  payments: paymentsRouter,
});

export type AppRouter = typeof appRouter;
