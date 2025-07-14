import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import {
  EditMealPlanForm,
  EditMealPlanFormError,
  EditMealPlanFormSkeleton,
} from "@/modules/meal-plans/ui/components/edit-meal-plan-form";

interface EditMealPlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMealPlanPage({ params }: EditMealPlanPageProps) {
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
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h1 className="font-semibold text-3xl tracking-tight">Edit Meal Plan</h1>
        <p className="mt-2 text-muted-foreground">Update your meal plan details and meals</p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<EditMealPlanFormSkeleton />}>
          <ErrorBoundary fallback={<EditMealPlanFormError />}>
            <EditMealPlanForm mealPlanId={mealPlanId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
