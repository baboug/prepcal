import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import * as service from "./billing-service";

export const billingRouter = createTRPCRouter({
  checkout: protectedProcedure.mutation(() => {
    // Using Better Auth client plugin on frontend to redirect; this is a no-op endpoint for type cohesion if needed
    return { slug: service.getCheckoutSlug() };
  }),
  plan: protectedProcedure.query(async ({ ctx }) => {
    const plan = await service.getUserPlan(ctx.auth.user.id);
    return { plan };
  }),
  limits: protectedProcedure.query(async ({ ctx }) => {
    return await service.getLimits(ctx.auth.user.id);
  }),
});
