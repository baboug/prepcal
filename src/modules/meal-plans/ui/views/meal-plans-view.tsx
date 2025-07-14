"use client";

import { IconBowlSpoonFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc/client";
import { MealPlanList } from "../components/meal-plan-list";
import { useMealPlanFilters } from "../hooks/use-meal-plan-filters";

export function MealPlansView() {
  const trpc = useTRPC();
  const [filters, setFilters] = useMealPlanFilters();
  const { data } = useSuspenseQuery(trpc.mealPlans.getMany.queryOptions({ ...filters }));

  return (
    <div className="p-4 lg:p-6">
      {data.items.length > 0 ? (
        <>
          <MealPlanList mealPlans={data.items} />
          <Pagination onPageChange={(page) => setFilters({ page })} page={filters.page} totalPages={data.totalPages} />
        </>
      ) : (
        <EmptyState
          description="Create your first meal plan to get started with organized meal planning."
          icon={<IconBowlSpoonFilled className="size-8" />}
          title="No meal plans found"
        >
          <div className="mt-6 flex gap-2">
            <Link href="/meal-plans/new">
              <Button variant="outline">
                <PlusIcon />
                Create Meal Plan
              </Button>
            </Link>
          </div>
        </EmptyState>
      )}
    </div>
  );
}

export function MealPlansViewSkeleton() {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton className="h-[230px] w-full" key={i} />
        ))}
      </div>
    </div>
  );
}

export function MealPlansViewError() {
  return (
    <div className="p-4 lg:p-6">
      <ErrorState
        description="Something went wrong while loading your meal plans. Please try again."
        title="Error loading meal plans"
      />
    </div>
  );
}
