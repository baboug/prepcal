import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import { BillingView } from "@/modules/payments/ui/views/billing-view";

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/auth/sign-in");
  }
  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.payments.plan.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BillingView />
    </HydrationBoundary>
  );
}
