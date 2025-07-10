import { profileRouter } from "@/modules/profile/server/profile-router";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
