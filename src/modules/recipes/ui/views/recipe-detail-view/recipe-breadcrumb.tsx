import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { RecipesGetOne } from "@/modules/recipes/types";

interface RecipeBreadcrumbProps {
  recipe: NonNullable<RecipesGetOne>;
}

export function RecipeBreadcrumb({ recipe }: RecipeBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/recipes">Recipes</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {recipe.category.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{recipe.category[0]}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {recipe.cuisine.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{recipe.cuisine[0]}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{recipe.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
