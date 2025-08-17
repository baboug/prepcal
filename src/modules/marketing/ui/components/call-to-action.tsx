import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-muted/50 px-8 py-16 text-center md:px-16 md:py-24 dark:bg-muted/25">
          <div aria-hidden="true" className="absolute inset-0" />
          <div className="relative z-10 mx-auto max-w-3xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl tracking-tighter lg:text-5xl">Ready to transform your nutrition?</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Join thousands of fitness enthusiasts who've revolutionized their meal planning with AI. Start for free
                today and see the difference precision nutrition makes.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Start meal planning</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
