import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import { profileSchema } from "../schemas";
import * as profileService from "./profile-service";

export const profileRouter = createTRPCRouter({
  create: protectedProcedure.input(profileSchema).mutation(async ({ ctx, input }) => {
    return await profileService.createProfile(ctx.auth.user.id, input);
  }),
  update: protectedProcedure.input(profileSchema.partial()).mutation(async ({ ctx, input }) => {
    return await profileService.updateProfile(ctx.auth.user.id, input);
  }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return await profileService.getProfile(ctx.auth.user.id);
  }),
});
