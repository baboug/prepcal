import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { MealPlanForm } from "@/modules/meal-plans/ui/components/meal-plan-form";

export default async function NewMealPlanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (!session.user.onboardingComplete) {
    return redirect("/onboarding");
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h1 className="font-semibold text-3xl tracking-tight">Create Meal Plan</h1>
        <p className="mt-2 text-muted-foreground">Plan your meals for the week with our step-by-step guide</p>
      </div>
      <MealPlanForm />
    </div>
  );
}
