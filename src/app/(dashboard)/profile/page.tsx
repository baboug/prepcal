import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import { ProfileView, ProfileViewError, ProfileViewSkeleton } from "@/modules/profile/ui/views/profile-view";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (!session.user.onboardingComplete) {
    return redirect("/onboarding");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.profile.get.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProfileViewSkeleton />}>
        <ErrorBoundary fallback={<ProfileViewError />}>
          <ProfileView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
