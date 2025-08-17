import { CircleCheckIcon } from "lucide-react";

export function MacrosCard() {
  return (
    <div className="relative h-full flex-1 rounded-lg border border-muted p-6">
      <div className="absolute inset-0 rounded-xl" />
      <div className="flex h-full flex-col justify-between text-foreground">
        <div className="space-y-6">
          <h3 className="font-semibold text-xl">Smart Macro Tracking</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CircleCheckIcon className="size-4" />
              <p className="text-foreground text-sm">Personalized macro calculations based on your goals</p>
            </div>
            <div className="flex items-center gap-3">
              <CircleCheckIcon className="size-4" />
              <p className="text-foreground text-sm">AI-powered meal suggestions that fit your macros</p>
            </div>
            <div className="flex items-center gap-3">
              <CircleCheckIcon className="size-4" />
              <p className="text-foreground text-sm">Recipe database with detailed macro breakdowns</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between rounded-lg bg-gradient-to-br from-muted via-muted/50 to-primary/25 p-3 backdrop-blur-md dark:from-muted/50 dark:via-muted/25 dark:to-primary/15">
          <div className="text-center">
            <div className="text-xs">Protein</div>
            <div className="font-semibold text-lg ">180g</div>
          </div>
          <div className="text-center">
            <div className="text-xs">Carbs</div>
            <div className="font-semibold text-lg ">220g</div>
          </div>
          <div className="text-center">
            <div className="text-xs">Fat</div>
            <div className="font-semibold text-lg ">65g</div>
          </div>
        </div>
      </div>
    </div>
  );
}
