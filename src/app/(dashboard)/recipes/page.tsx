import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import { loadSearchParams } from "@/modules/recipes/params";
import { RecipesViewHeader } from "@/modules/recipes/ui/components/recipes-view-header";
import { RecipesView, RecipesViewError, RecipesViewSkeleton } from "@/modules/recipes/ui/views/recipes-view";

export const metadata: Metadata = {
  title: "Recipes",
};

interface RecipesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (!session.user.onboardingComplete) {
    return redirect("/onboarding");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.recipes.getMany.queryOptions({ ...filters }));

  return (
    <>
      <RecipesViewHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<RecipesViewSkeleton />}>
          <ErrorBoundary fallback={<RecipesViewError />}>
            <RecipesView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
