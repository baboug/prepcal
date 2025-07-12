import type { RecipesGetMany } from "@/modules/recipes/types";
import { RecipeCard } from "@/modules/recipes/ui/components/recipe-card";

interface RecipeGridProps {
  recipes: RecipesGetMany;
  userId: string;
}

export function RecipeGrid({ recipes, userId }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} userId={userId} />
      ))}
    </div>
  );
}
