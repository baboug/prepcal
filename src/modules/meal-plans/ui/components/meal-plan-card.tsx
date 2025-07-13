"use client";

import { CalendarIcon, ClockIcon, UtensilsIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealPlansGetMany } from "../../types";

interface MealPlanCardProps {
  mealPlan: MealPlansGetMany[0];
}

export function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysCount = () => {
    const start = new Date(mealPlan.startDate);
    const end = new Date(mealPlan.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const isActive = new Date(mealPlan.endDate) >= new Date();

  return (
    <Link href={`/meal-plans/${mealPlan.id}`}>
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="line-clamp-1 text-lg">{mealPlan.name}</CardTitle>
              {mealPlan.description && (
                <CardDescription className="mt-1 line-clamp-2">{mealPlan.description}</CardDescription>
              )}
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Archived"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {formatDate(mealPlan.startDate)} - {formatDate(mealPlan.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>{getDaysCount()} days</span>
            </div>
            <div className="flex items-center gap-1">
              <UtensilsIcon className="h-4 w-4" />
              <span>{mealPlan.mealsPerDay} meals/day</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
