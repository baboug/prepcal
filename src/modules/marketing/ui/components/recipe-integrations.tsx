import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RecipeIntegrations() {
  return (
    <section>
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative mx-auto w-fit bg-muted/50">
            <div className="absolute inset-0 z-10 bg-radial from-transparent to-background" role="presentation" />
            <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
              <IntegrationCard>
                <Image alt="Food Network" height={48} src="/recipe-logos/food-network.png" width={48} />
              </IntegrationCard>
              <IntegrationCard>
                <Image alt="Epicurious" height={48} src="/recipe-logos/epicurious.png" width={48} />
              </IntegrationCard>
              <IntegrationCard>
                <Image alt="AllRecipes" height={48} src="/recipe-logos/allrecipes.png" width={48} />
              </IntegrationCard>
            </div>
            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
              <IntegrationCard>
                <Image alt="Yummly" height={48} src="/recipe-logos/yummly.avif" width={48} />
              </IntegrationCard>
              <IntegrationCard
                borderClassName="shadow-black-950/10 shadow-xl border-black/25 dark:border-white/25"
                className="dark:bg-white/10"
              >
                <svg fill="none" height="48" viewBox="0 0 33 48" width="33" xmlns="http://www.w3.org/2000/svg">
                  <title>PrepCal</title>
                  <path
                    d="M18.5 29C25.4036 29 31 23.4036 31 16.5C31 9.59644 25.4036 4 18.5 4H5C2.79086 4 1 5.79086 1 8V25C1 27.2091 2.79086 29 5 29H18.5Z"
                    fill="#EA580C"
                  />
                  <path
                    d="M1.1094 39.5981L0.653576 8.102C0.605039 4.74833 4.45738 2.82769 7.10648 4.88481L15.8643 11.6856C16.8241 12.4309 17.393 13.572 17.4106 14.787L17.6096 28.535C17.6227 29.4432 17.3264 30.3288 16.7693 31.0462L8.26829 41.9935C5.94922 44.9799 1.16412 43.3788 1.1094 39.5981Z"
                    fill="#8B5CF6"
                  />
                </svg>
              </IntegrationCard>
              <IntegrationCard>
                <Image alt="Simply Recipes" height={48} src="/recipe-logos/simply-recipes.png" width={48} />
              </IntegrationCard>
            </div>
            <div className="mx-auto flex w-fit justify-center gap-2">
              <IntegrationCard>
                <Image alt="Delish" height={48} src="/recipe-logos/delish.webp" width={48} />
              </IntegrationCard>
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-lg space-y-6 text-center">
            <h2 className="text-balance text-3xl tracking-tighter md:text-4xl">
              Import from your favorite recipe sites
            </h2>
            <p className="text-muted-foreground">
              Instantly import recipes from any website with automatic ingredient parsing and nutrition calculation.
            </p>
            <Button asChild variant="outline">
              <Link href="/auth/sign-up">Start importing recipes</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  borderClassName,
}: {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
}) => {
  return (
    <div className={cn("relative flex size-20 rounded-xl bg-background dark:bg-transparent", className)}>
      <div
        className={cn("absolute inset-0 rounded-xl border border-black/20 dark:border-white/25", borderClassName)}
        role="presentation"
      />
      <div className="relative z-20 m-auto size-fit *:size-8">{children}</div>
    </div>
  );
};
