import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";

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

function BillingView() {
  "use client";
  const trpcClient = require("@/lib/trpc/client");
  const { useSuspenseQuery } = require("@tanstack/react-query");
  const { authClient } = require("@/lib/auth/auth-client");

  const trpc = trpcClient.useTRPC();
  const { data } = useSuspenseQuery(trpc.payments.plan.queryOptions());

  const handleManage = async () => {
    await authClient.customer.portal();
  };
  const handleUpgrade = async () => {
    await authClient.checkout({ slug: "pro" });
  };

  const isPro = data.plan === "pro";

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Manage your subscription and plan</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-muted-foreground text-sm">Current plan</div>
            <div className="font-semibold text-xl capitalize">{isPro ? "Pro" : "Free"}</div>
          </div>
          {isPro ? (
            <Button onClick={handleManage} type="button">
              Manage subscription
            </Button>
          ) : (
            <Button onClick={handleUpgrade} type="button">
              Upgrade to Pro
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
