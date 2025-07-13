import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import { loadMealPlanFilters } from "@/modules/meal-plans/params";
import { MealPlansViewHeader } from "@/modules/meal-plans/ui/components/meal-plans-view-header";
import {
  MealPlansView,
  MealPlansViewError,
  MealPlansViewSkeleton,
} from "@/modules/meal-plans/ui/views/meal-plans-view";

export const metadata: Metadata = {
  title: "Meal Plans",
};

interface MealPlansPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function MealPlansPage({ searchParams }: MealPlansPageProps) {
  const filters = await loadMealPlanFilters(searchParams);

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
  void queryClient.prefetchQuery(trpc.mealPlans.getMany.queryOptions({ ...filters }));

  return (
    <>
      <MealPlansViewHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MealPlansViewSkeleton />}>
          <ErrorBoundary fallback={<MealPlansViewError />}>
            <MealPlansView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
