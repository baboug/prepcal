"use client";

import { IconCreditCardFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="gap-0 bg-sidebar p-2">
      <CardHeader className="gap-0 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Limits per month</CardTitle>
          </div>
          <Badge className="capitalize" variant={isPro ? "default" : "secondary"}>
            {data.plan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 p-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Meal plans</span>
            <span>
              {data.mealPlans.used}/{data.mealPlans.limit}
            </span>
          </div>
          <Progress value={mealPct} />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">AI generations</span>
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
          <Button className="w-full" onClick={() => authClient.checkout({ slug: "pro" })} size="sm" type="button">
            Upgrade to Pro
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
