import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl tracking-tighter lg:text-5xl">Simple, transparent pricing</h1>
          <p className="text-muted-foreground">
            Start free and upgrade when you need more AI-powered meal planning and advanced features.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
          <div className="flex flex-col justify-between space-y-8 rounded-(--radius) border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">Free</h2>
                <span className="my-3 block font-semibold text-2xl">$0 / mo</span>
                <p className="text-muted-foreground text-sm">Perfect for getting started</p>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {[
                  "3 AI generated meal plans",
                  "Manual meal planning",
                  "Recipe import from websites",
                  "Basic nutrition tracking",
                  "All diet protocols",
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-(--radius) bg-gradient-to-br from-muted via-muted/50 to-primary/25 p-6 shadow-gray-950/5 shadow-lg md:col-span-3 lg:p-10 dark:from-muted/50 dark:via-muted/25 dark:to-primary/15">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">Pro</h2>
                  <span className="my-3 block font-semibold text-2xl">$10 / mo</span>
                  <p className="text-muted-foreground text-sm">Unlock AI-powered features</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/auth/sign-up">Unlock Pro features</Link>
                </Button>
              </div>
              <div>
                <div className="font-medium text-sm">Everything in free plus:</div>
                <ul className="mt-4 list-outside space-y-3 text-sm">
                  {[
                    "Unlimited AI meal plan generation",
                    "AI-assisted Meal prep optimization",
                    "Advanced nutrition analytics",
                    "Shopping list generation",
                    "Custom recipe creation",
                    "Priority customer support",
                  ].map((item, index) => (
                    <li className="flex items-center gap-2" key={index}>
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
