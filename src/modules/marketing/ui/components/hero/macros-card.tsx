import { CircleCheckIcon } from "lucide-react";

export function MacrosCard() {
  return (
    <div className="relative h-full flex-1 rounded-lg border border-muted p-6">
      <div className="absolute inset-0 rounded-xl [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-orange-600),var(--color-white)_100%)]" />
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
        <div className="mt-6 flex items-center justify-between rounded-lg bg-black/5 p-3 backdrop-blur-md">
          <div className="text-center">
            <div className="text-white text-xs">Protein</div>
            <div className="font-semibold text-lg text-white">180g</div>
          </div>
          <div className="text-center">
            <div className="text-white text-xs">Carbs</div>
            <div className="font-semibold text-lg text-white">220g</div>
          </div>
          <div className="text-center">
            <div className="text-white text-xs">Fat</div>
            <div className="font-semibold text-lg text-white">65g</div>
          </div>
        </div>
      </div>
    </div>
  );
}
