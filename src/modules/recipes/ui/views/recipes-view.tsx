"use client";

import { IconBowlSpoonFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc/client";
import { RecipeGrid } from "../components/recipe-grid";
import { useRecipesFilters } from "../hooks/use-recipes-filters";

export function RecipesView() {
  const trpc = useTRPC();
  const { filters, setFilters } = useRecipesFilters();
  const { data } = useSuspenseQuery(trpc.recipes.getMany.queryOptions({ ...filters }));

  return (
    <div className="p-4 lg:p-6">
      {data.items.length > 0 ? (
        <>
          <RecipeGrid recipes={data.items} />
          <Pagination onPageChange={(page) => setFilters({ page })} page={filters.page} totalPages={data.totalPages} />
        </>
      ) : (
        <EmptyState
          description="Try adjusting your search or filter criteria to find what you're looking for."
          icon={<IconBowlSpoonFilled className="size-8" />}
          title="No recipes found"
        >
          <div className="mt-6 flex gap-2">
            <Link href="/recipes/add">
              <Button variant="outline">
                <PlusIcon />
                Create Recipe
              </Button>
            </Link>
          </div>
        </EmptyState>
      )}
    </div>
  );
}

export function RecipesViewSkeleton() {
  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="flex flex-col space-y-3" key={i}>
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecipesViewError() {
  return (
    <div className="p-4 lg:p-6">
      <ErrorState description="Something went wrong. Please try again later." title="Error loading recipes" />
    </div>
  );
}
