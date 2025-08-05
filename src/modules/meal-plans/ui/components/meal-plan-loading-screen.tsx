"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { format } from "date-fns";
import { TextShimmer } from "@/components/ui/text-shimmer";

interface MealPlanLoadingScreenProps {
  startDate?: Date;
  endDate?: Date;
  mealsPerDay?: number;
}

export function MealPlanLoadingScreen({ startDate, endDate, mealsPerDay }: MealPlanLoadingScreenProps) {
  const formattedStartDate = startDate ? format(startDate, "PPP") : "...";
  const formattedEndDate = endDate ? format(endDate, "PPP") : "...";

  return (
    <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border p-8 text-center">
      <TextShimmer
        className="font-medium text-xl [--base-color:theme(colors.orange.400)] [--base-gradient-color:theme(colors.orange.200)] dark:[--base-color:theme(colors.orange.500)] dark:[--base-gradient-color:theme(colors.orange.300)]"
        duration={1.2}
      >
        Generating Your Meal Plan...
      </TextShimmer>
      <p className="text-muted-foreground">
        Crafting a delicious and nutritious plan from <span className="font-medium">{formattedStartDate}</span> to{" "}
        <span className="font-medium">{formattedEndDate}</span> with{" "}
        <span className="font-medium">{mealsPerDay ?? "your specified number of"}</span> meals per day.
      </p>
      <div className="!mt-0 h-64 w-64">
        <DotLottieReact autoplay loop src={"/animations/cooking-animation.lottie"} />
      </div>
      <p className="text-muted-foreground text-sm">Hang tight, the culinary AI is working its magic!</p>
    </div>
  );
}
