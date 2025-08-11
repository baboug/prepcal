"use client";

import { IconChefHatFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/client";
import { getUserFirstName } from "@/lib/utils";
import { DailyRecipesCarousel } from "@/modules/dashboard/ui/components/daily-recipes-carousel";
import { MacroDistributionChart } from "@/modules/dashboard/ui/components/macro-distribution-chart";
import { NutritionOverviewChart } from "@/modules/dashboard/ui/components/nutrition-overview-chart";
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
        <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
          {currentMealPlan ? (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                <NutritionOverviewChart />
                <MacroDistributionChart />
                <ProfileOverviewCard profile={userProfile} />
              </div>
              <div className="space-y-6 lg:col-span-2 xl:col-span-3">
                <DailyRecipesCarousel mealPlan={currentMealPlan} />
              </div>
            </>
          ) : (
            <EmptyState
              description="Create your first meal plan to get started with organized meal planning."
              icon={<IconChefHatFilled className="size-8" />}
              title="Create your first meal plan"
            >
              <div className="mt-6 flex gap-2">
                <Link href="/meal-plans/new">
                  <Button>
                    <PlusIcon />
                    Create Meal Plan
                  </Button>
                </Link>
              </div>
            </EmptyState>
          )}
        </div>
      </div>
    </>
  );
}
