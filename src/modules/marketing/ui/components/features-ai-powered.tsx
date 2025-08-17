import { Bot, Brain, Clock, Target, Zap } from "lucide-react";

export function FeaturesAIPowered() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-4xl tracking-tighter lg:text-5xl">AI-Powered Meal Planning</h2>
              <p className="mt-6 text-muted-foreground">
                Let artificial intelligence create perfect meal plans tailored to your exact nutritional needs and
                preferences, saving you hours every week.
              </p>
            </div>
            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <Brain className="size-5" />
                Intelligent meal plan generation
              </li>
              <li>
                <Clock className="size-5" />
                Save 5+ hours weekly
              </li>
              <li>
                <Target className="size-5" />
                95% macro accuracy guarantee
              </li>
              <li>
                <Zap className="size-5" />
                Instant shopping lists
              </li>
            </ul>
          </div>
          <div className="relative rounded-3xl border border-border/50 p-3 lg:col-span-3">
            <div className="relative rounded-2xl bg-linear-to-b from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <div className="flex h-full items-center justify-center rounded-[15px] bg-background p-4 md:p-8">
                <div className="w-full max-w-md rounded-lg p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Bot className="size-3" />
                    <span className="font-medium text-sm">AI Meal Plan Generated</span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Target Calories</span>
                        <span className="font-medium">2,200 kcal</span>
                      </div>
                      <div className="h-2 rounded-full bg-background">
                        <div className="h-full w-[98%] rounded-full bg-calories" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Protein (173g)</span>
                        <span className="font-medium">100%</span>
                      </div>
                      <div className="h-2 rounded-full bg-background">
                        <div className="h-full w-full rounded-full bg-protein" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Carbs (183g)</span>
                        <span className="font-medium">97%</span>
                      </div>
                      <div className="h-2 rounded-full bg-background">
                        <div className="h-full w-[97%] rounded-full bg-carbs" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fats (81g)</span>
                        <span className="font-medium">100%</span>
                      </div>
                      <div className="h-2 rounded-full bg-background">
                        <div className="h-full w-[100%] rounded-full bg-fat" />
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                      <p className="text-center text-xs">
                        AI analyzed 1,247 recipe combinations to find your perfect match
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
