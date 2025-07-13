import type { MealPlansGetMany } from "@/modules/meal-plans/types";
import { MealPlanCard } from "./meal-plan-card";

interface MealPlanListProps {
  mealPlans: MealPlansGetMany;
}

export function MealPlanList({ mealPlans }: MealPlanListProps) {
  return (
    <div className="flex flex-col gap-4">
      {mealPlans.map((mealPlan) => (
        <MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />
      ))}
    </div>
  );
}
