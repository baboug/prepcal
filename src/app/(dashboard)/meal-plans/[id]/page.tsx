import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import {
  MealPlanDetailView,
  MealPlanDetailViewError,
  MealPlanDetailViewSkeleton,
} from "@/modules/meal-plans/ui/views/meal-plan-detail-view";

interface MealPlanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MealPlanDetailPage({ params }: MealPlanDetailPageProps) {
  const { id } = await params;
  const mealPlanId = Number.parseInt(id, 10);

  if (Number.isNaN(mealPlanId)) {
    notFound();
  }

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

  try {
    void queryClient.prefetchQuery(trpc.mealPlans.getOne.queryOptions({ id: mealPlanId }));
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MealPlanDetailViewSkeleton />}>
        <ErrorBoundary fallback={<MealPlanDetailViewError />}>
          <MealPlanDetailView mealPlanId={mealPlanId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
