"use client";

import { IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Session } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/client";
import { getUserFirstName } from "@/lib/utils";
import { DailyRecipesCarousel } from "@/modules/dashboard/ui/components/daily-recipes-carousel";
import { ProfileOverviewCard } from "@/modules/dashboard/ui/components/profile-overview-card";
import { SiteHeader } from "@/modules/dashboard/ui/components/site-header";

interface DashboardViewProps {
  session: Session;
}

export function DashboardView({ session }: DashboardViewProps) {
  const trpc = useTRPC();

  const { data: currentMealPlan } = useSuspenseQuery(trpc.mealPlans.getCurrentActive.queryOptions());
  const { data: userProfile } = useSuspenseQuery(trpc.profile.get.queryOptions());

  return (
    <>
      <SiteHeader title={`👋 Welcome back, ${getUserFirstName(session.user)}`} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="space-y-6 lg:col-span-3">
                {currentMealPlan ? (
                  <DailyRecipesCarousel mealPlan={currentMealPlan} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Active Meal Plan</CardTitle>
                      <CardDescription>
                        You don't have any active meal plans. Create your first meal plan to get started!
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild>
                        <Link href="/meal-plans/new">
                          <IconPlus className="mr-2 size-4" />
                          Create Meal Plan
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-6">
                <ProfileOverviewCard profile={userProfile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
