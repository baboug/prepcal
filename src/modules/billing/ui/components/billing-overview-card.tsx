"use client";

import { IconCreditCardFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CrownIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/lib/trpc/client";

export function BillingOverviewCard() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.billing.limits.queryOptions());
  const isPro = data.plan === "pro";

  const mealPct = Math.min(100, Math.round((data.mealPlans.used / data.mealPlans.limit) * 100));
  const aiPct = Math.min(100, Math.round((data.aiGenerations.used / data.aiGenerations.limit) * 100));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CrownIcon className="size-5 text-yellow-500" />
            <CardTitle>Plan & Limits</CardTitle>
          </div>
          <Badge className="capitalize" variant={isPro ? "default" : "secondary"}>
            {data.plan}
          </Badge>
        </div>
        <CardDescription>
          {isPro ? "Enjoy higher limits and priority features." : "Upgrade to Pro to lift limits and unlock more."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Meal plans per month</span>
            <span>
              {data.mealPlans.used}/{data.mealPlans.limit}
            </span>
          </div>
          <Progress value={mealPct} />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">AI generations per month</span>
            <span>
              {data.aiGenerations.used}/{data.aiGenerations.limit}
            </span>
          </div>
          <Progress value={aiPct} />
        </div>
        {isPro ? (
          <Link href="/billing">
            <Button className="w-full" size="sm" variant="outline">
              <IconCreditCardFilled className="mr-2 size-4" />
              Manage billing
            </Button>
          </Link>
        ) : (
          <Button className="w-full" onClick={() => authClient.checkout({ slug: "pro" })} type="button">
            Upgrade to Pro
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
