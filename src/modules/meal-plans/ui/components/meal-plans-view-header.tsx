"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MealPlanFilters } from "./meal-plan-filters";

export function MealPlansViewHeader() {
  return (
    <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl md:text-2xl">Meal Plans</h1>
        <Link href="/meal-plans/new">
          <Button>
            <PlusIcon className="size-4" />
            New Meal Plan
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <MealPlanFilters />
      </div>
    </div>
  );
}
