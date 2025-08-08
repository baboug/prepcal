"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/lib/trpc/client";

export function BillingView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.payments.plan.queryOptions());
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
            <Button onClick={() => authClient.customer.portal()} type="button">
              Manage subscription
            </Button>
          ) : (
            <Button onClick={() => authClient.checkout({ slug: "pro" })} type="button">
              Upgrade to Pro
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function BillingViewSkeleton() {
  return (
    <div className="p-4 lg:p-6">
      <LoadingState description="Please wait while we load your billing." title="Loading billing" />
    </div>
  );
}

export function BillingViewError() {
  return (
    <div className="p-4 lg:p-6">
      <ErrorState description="Something went wrong. Please try again later." title="Error loading billing" />
    </div>
  );
}

// https://prepcal.com/billing/success?checkout_id=9f2d7195-9474-4bc6-92a4-005cec7482bf&customer_session_token=polar_cst_egDpc1AmCgzAKu8vMzUf0ArINfCWSMOmJyGFs3YE8Vx
