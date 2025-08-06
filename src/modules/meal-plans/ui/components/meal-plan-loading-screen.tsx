"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { TextShimmer } from "@/components/ui/text-shimmer";

export function MealPlanLoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border p-8 text-center">
      <TextShimmer
        className="font-medium text-xl [--base-color:theme(colors.orange.400)] [--base-gradient-color:theme(colors.orange.200)] dark:[--base-color:theme(colors.orange.500)] dark:[--base-gradient-color:theme(colors.orange.300)]"
        duration={1.2}
      >
        Generating Your Meal Plan...
      </TextShimmer>
      <div className="!mt-0 h-64 w-64">
        <DotLottieReact autoplay loop src={"/animations/cooking-animation.lottie"} />
      </div>
      <p className="text-muted-foreground text-sm">Hang tight, the culinary AI is working its magic!</p>
    </div>
  );
}
