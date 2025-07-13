"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRightIcon, ClockIcon, CookingPotIcon, EditIcon, PlayIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import type { Session } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/client";
import type { RecipesGetOne } from "../../types";
import { RecipeDeleteDialog } from "../components/recipe-delete-dialog";
import { IngredientItem } from "../components/recipe-detail/ingredient-item";
import { NutritionCard } from "../components/recipe-detail/nutrition-card";
import { RecipeBreadcrumb } from "../components/recipe-detail/recipe-breadcrumb";
import { RecipeImage } from "../components/recipe-detail/recipe-image";
import { RecipeEditDialog } from "../components/recipe-edit-dialog";

interface RecipeDetailViewProps {
  recipeId: number;
  session: Session;
}

export function RecipeDetailView({ recipeId, session }: RecipeDetailViewProps) {
  const trpc = useTRPC();
  const { data: recipe } = useSuspenseQuery(trpc.recipes.getOne.queryOptions({ id: recipeId }));

  if (!recipe) {
    notFound();
  }

  const recipeData = recipe as NonNullable<RecipesGetOne>;

  const [isIngredientsOpen, setIsIngredientsOpen] = useState(true);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);

  const totalTime = (recipeData.prepTime || 0) + (recipeData.cookTime || 0);
  const canEdit = session?.user.id === recipeData.userId;

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-6">
        <RecipeBreadcrumb recipe={recipeData} />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="md:hidden">
            <RecipeImage recipe={recipeData} />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h1 className="mb-4 font-bold text-3xl">{recipeData.name}</h1>
              {canEdit && (
                <div className="flex gap-2">
                  <RecipeEditDialog recipe={recipeData}>
                    <Button size="sm" variant="outline">
                      <EditIcon className="mr-2 size-4" />
                      Edit
                    </Button>
                  </RecipeEditDialog>
                  <RecipeDeleteDialog recipe={recipeData} redirectOnDelete={true}>
                    <Button size="sm" variant="outline">
                      <TrashIcon className="mr-2 size-4" />
                      Delete
                    </Button>
                  </RecipeDeleteDialog>
                </div>
              )}
              {recipeData.description && <p className="text-lg text-muted-foreground">{recipeData.description}</p>}
              <div className="lg:hidden">
                <NutritionCard recipe={recipeData} />
              </div>
              <div className="flex flex-wrap gap-4">
                {recipeData.prepTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <CookingPotIcon className="size-4" />
                    <span>Prep time: {recipeData.prepTime} min</span>
                  </div>
                )}
                {recipeData.cookTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="size-4" />
                    <span>Cook time: {recipeData.cookTime} min</span>
                  </div>
                )}
                {totalTime > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="size-4" />
                    <span>Total time: {totalTime} min</span>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <RecipeImage recipe={recipeData} />
            </div>
          </div>
          <Collapsible className="mt-8" onOpenChange={setIsIngredientsOpen} open={isIngredientsOpen}>
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="ghost">
                <h2 className="font-bold text-2xl">Ingredients</h2>
                <ChevronRightIcon className={`size-6 transition-transform ${isIngredientsOpen ? "rotate-90" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                {recipeData.ingredients.map((ingredient, index) => (
                  <IngredientItem
                    index={index}
                    ingredient={ingredient}
                    key={ingredient.name || `ingredient-${index}`}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="mt-8" onOpenChange={setIsInstructionsOpen} open={isInstructionsOpen}>
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="ghost">
                <h2 className="font-bold text-2xl">Instructions</h2>
                <ChevronRightIcon className={`size-6 transition-transform ${isInstructionsOpen ? "rotate-90" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                {recipeData.instructions.map((instruction, index) => (
                  <div className="flex items-start gap-4" key={instruction.step || `instruction-${index}`}>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="leading-relaxed">{instruction.step}</p>
                      {instruction.video && (
                        <Button
                          className="mt-2 h-auto p-0"
                          onClick={() => {
                            if (instruction.video?.url) {
                              window.open(instruction.video.url, "_blank");
                            }
                          }}
                          variant="link"
                        >
                          <PlayIcon className="mr-2 size-4" />
                          Watch video
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          {recipeData.keywords.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 font-semibold text-lg">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipeData.keywords.map((keyword) => (
                  <span className="rounded-full bg-muted px-3 py-1 text-sm" key={keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
          {recipeData.sourceUrl && (
            <div className="mt-8">
              <h3 className="mb-3 font-semibold text-lg">Source</h3>
              <Link
                className="text-primary hover:underline"
                href={recipeData.sourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {recipeData.sourceUrl}
              </Link>
            </div>
          )}
        </div>
        <div className="hidden lg:col-span-1 lg:block">
          <NutritionCard recipe={recipeData} />
        </div>
      </div>
    </div>
  );
}

export function RecipeDetailViewSkeleton() {
  return (
    <div className="w-full px-4 py-6">
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <Skeleton className="mb-4 h-8 w-64" />
              <Skeleton className="mb-2 h-6 w-full" />
              <Skeleton className="mb-6 h-6 w-3/4" />
              <div className="mb-6 flex gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="md:order-first">
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function RecipeDetailViewError() {
  return (
    <div className="w-full px-4 py-6">
      <ErrorState description="Something went wrong while loading the recipe details." title="Error loading recipe" />
    </div>
  );
}
