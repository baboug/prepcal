"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Check as CheckIcon } from "lucide-react";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/lib/trpc/client";

export function BillingView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.billing.plan.queryOptions());
  const isPro = data.plan === "pro";

  return (
    <section className="p-4 lg:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center font-semibold text-4xl lg:text-5xl">Billing</h1>
          <p className="text-muted-foreground">
            Upgrade to increase your monthly meal plan and AI generation limits. Manage your subscription securely in
            the Polar customer portal.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
          <div className="flex flex-col justify-between space-y-8 rounded-(--radius) border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">Free</h2>
                <span className="my-3 block font-semibold text-2xl">$0 / mo</span>
              </div>
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {["3 meal plans per month", "3 AI generations per month", "Manual plan editing"].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <CheckIcon className="size-3" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-(--radius) border bg-secondary p-6 text-secondary-foreground shadow-gray-950/5 shadow-lg md:col-span-3 lg:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">Pro</h2>
                  <span className="my-3 block font-semibold text-2xl">$10 / mo</span>
                </div>
                {isPro ? (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      await authClient.customer.portal();
                    }}
                  >
                    Manage subscription
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      await authClient.checkout({ slug: "pro" });
                    }}
                  >
                    Get Started
                  </Button>
                )}
              </div>
              <div>
                <div className="font-semibold text-sm">Everything in Free plus :</div>
                <ul className="mt-4 list-outside space-y-3 text-sm">
                  {["Higher meal plan limits", "Higher AI generation limits", "Priority support"].map((item, index) => (
                    <li className="flex items-center gap-2" key={index}>
                      <CheckIcon className="size-3" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
