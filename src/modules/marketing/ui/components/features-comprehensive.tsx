import { BarChart3, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FeaturesComprehensive() {
  return (
    <section className="bg-gradient-to-br from-muted via-muted/50 to-primary/10 py-16 md:py-32 dark:from-muted/25 dark:via-muted/15 dark:to-primary/10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto grid gap-2 sm:grid-cols-5">
          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="md:p-6">
                <p className="font-medium">Comprehensive meal planning system</p>
                <p className="mt-3 max-w-sm text-muted-foreground text-sm">
                  From weekly planning to shopping lists, everything you need for perfect nutrition is built into one
                  platform.
                </p>
              </div>
            </CardHeader>
            <div className="relative h-fit pl-6 md:pl-12">
              <div className="-inset-6 absolute [background:radial-gradient(75%_95%_at_50%_0%,transparent,var(--color-background)_100%)]" />
              <div className="overflow-hidden rounded-tl-lg border-t border-l bg-background pt-2 pl-2 dark:bg-zinc-950">
                <div className="h-64 w-full rounded bg-muted p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Week of Jan 15-21</h3>
                    <div className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-white text-xs">
                      <Target className="size-3" />
                      On Track
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <div className="rounded bg-background p-2 text-center" key={day}>
                        <div className="font-medium">{day}</div>
                        <div className="mt-1 text-[10px] opacity-70">{i + 15}</div>
                        <div className="mt-2 space-y-1">
                          <div className="h-1 rounded bg-calories" />
                          <div className="h-1 rounded bg-protein" />
                          <div className="h-1 rounded bg-carbs" />
                          <div className="h-1 rounded bg-fat" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            <p className="mx-auto my-6 max-w-md text-balance px-6 text-center font-semibold text-lg sm:text-2xl md:p-6">
              Smart shopping lists with meal prep optimization
            </p>
            <CardContent className="mt-auto h-fit">
              <div className="relative mb-6 sm:mb-0">
                <div className="-inset-6 absolute [background:radial-gradient(50%_75%_at_75%_50%,transparent,var(--color-background)_100%)]" />
                <div className="aspect-76/59 overflow-hidden rounded-r-lg border">
                  <div className="h-full bg-muted p-4">
                    <h4 className="mb-3 font-medium">Shopping List</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input className="size-3" type="checkbox" />
                        <span>Chicken breast - 2 lbs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input className="size-3" type="checkbox" />
                        <span>Brown rice - 2 cups</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input className="size-3" type="checkbox" />
                        <span>Broccoli - 1 head</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input className="size-3" type="checkbox" />
                        <span>Sweet potatoes - 3 medium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="group p-6 shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
            <p className="mx-auto mb-12 max-w-md text-balance text-center font-semibold text-lg sm:text-2xl">
              Track your progress with detailed analytics
            </p>
            <div className="flex justify-center gap-6">
              <div className=" flex aspect-square size-16 items-center justify-center rounded-[7px] border bg-muted/35 p-3 shadow-lg dark:inset-shadow-white/5 dark:shadow-white/5">
                <BarChart3 className="size-4" />
              </div>
              <div className="inset-shadow-sm flex aspect-square size-16 items-center justify-center rounded-[7px] border bg-muted/35 p-3 shadow-lg dark:inset-shadow-white/5 dark:shadow-white/5">
                <TrendingUp className="size-4" />
              </div>
            </div>
          </Card>
          <Card className="group relative shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
            <CardHeader className="p-6 md:p-12">
              <p className="font-medium">Multiple diet protocols supported</p>
              <p className="mt-2 max-w-sm text-muted-foreground text-sm">
                Standard, Keto, and Leangains with specialized calculations for each approach.
              </p>
            </CardHeader>
            <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="flex aspect-square items-center justify-center rounded-(--radius) border bg-muted/50 p-4">
                  <div className="text-center">
                    <div className="font-medium text-xs">Standard</div>
                    <div className="text-[10px] opacity-70">Flexible</div>
                  </div>
                </div>
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="flex aspect-square items-center justify-center rounded-(--radius) border bg-muted/50 p-4">
                  <div className="text-center">
                    <div className="font-medium text-xs">Keto</div>
                  </div>
                </div>
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="flex aspect-square items-center justify-center rounded-(--radius) border bg-muted/50 p-4">
                  <div className="text-center">
                    <div className="font-medium text-xs">Leangains</div>
                    <div className="text-[10px] opacity-70">Protein</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg">Start meal planning</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
