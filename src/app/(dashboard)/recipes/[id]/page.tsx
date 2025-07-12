import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import {
  RecipeDetailView,
  RecipeDetailViewError,
  RecipeDetailViewSkeleton,
} from "@/modules/recipes/ui/views/recipe-detail-view";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const recipeId = Number.parseInt(id, 10);

  if (Number.isNaN(recipeId)) {
    return { title: "Recipe Not Found" };
  }

  try {
    const queryClient = getQueryClient();
    const recipe = await queryClient.fetchQuery(trpc.recipes.getOne.queryOptions({ id: recipeId }));

    if (!recipe) {
      return { title: "Recipe Not Found" };
    }

    return {
      title: recipe.name,
      description: recipe.description || `${recipe.name} recipe`,
    };
  } catch {
    return { title: "Recipe Not Found" };
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipeId = Number.parseInt(id, 10);

  if (Number.isNaN(recipeId)) {
    notFound();
  }

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

  try {
    void queryClient.prefetchQuery(trpc.recipes.getOne.queryOptions({ id: recipeId }));
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RecipeDetailViewSkeleton />}>
        <ErrorBoundary fallback={<RecipeDetailViewError />}>
          <RecipeDetailView recipeId={recipeId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
