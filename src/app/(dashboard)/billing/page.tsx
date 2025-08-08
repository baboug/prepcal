import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import { BillingView, BillingViewError, BillingViewSkeleton } from "@/modules/payments/ui/views/billing-view";

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.payments.plan.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<BillingViewSkeleton />}>
        <ErrorBoundary fallback={<BillingViewError />}>
          <BillingView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
