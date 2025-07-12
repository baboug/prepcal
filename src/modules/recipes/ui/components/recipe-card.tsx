import { IconBowlSpoonFilled } from "@tabler/icons-react";
import { FlameIcon, TimerIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RecipesGetMany } from "../../types";
import { calculateMacroPercentages } from "../../utils/calculations";

type Recipe = RecipesGetMany[0];

interface RecipeCardProps {
  recipe: Recipe;
  userId: string;
}

export function RecipeCard({ recipe, userId }: RecipeCardProps) {
  return (
    <Link className="block" href={`/recipes/${recipe.id}`}>
      <Card className="!p-0 gap-0 overflow-hidden transition-colors hover:bg-muted/50">
        <CardHeader className="relative gap-0 p-0">
          <RecipeImage recipe={recipe} />
          <RecipeBadges recipe={recipe} userId={userId} />
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="line-clamp-1 font-semibold">{recipe.name}</h3>
            </div>
            {recipe.description && <p className="line-clamp-3 text-muted-foreground text-sm">{recipe.description}</p>}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="grid w-full gap-2 text-sm">{recipe.macros && <RecipeMacros recipe={recipe} />}</div>
        </CardFooter>
      </Card>
    </Link>
  );
}

function RecipeImage({ recipe }: { recipe: Recipe }) {
  return (
    <div className="relative aspect-video overflow-hidden">
      {recipe.imageUrl ? (
        <Image
          alt={recipe.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          height={220}
          src={recipe.imageUrl}
          width={390}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <IconBowlSpoonFilled className="size-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function RecipeBadges({ recipe, userId }: { recipe: Recipe; userId: string }) {
  return (
    <div className="absolute top-2 left-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-2">
      {recipe.userId === userId && (
        <Badge className="flex items-center gap-1.5" variant="accent">
          <UserIcon className="size-3" />
          <span>Your Recipe</span>
        </Badge>
      )}
      {recipe.prepTime && recipe.cookTime ? (
        <Badge className="flex items-center gap-1.5" variant="accent">
          <TimerIcon className="size-3" />
          <span>{recipe.prepTime + recipe.cookTime} min</span>
        </Badge>
      ) : null}
      {recipe.calories ? (
        <Badge className="flex items-center gap-1.5" variant="accent">
          <FlameIcon className="size-3" />
          <span>{recipe.calories} kcal</span>
        </Badge>
      ) : null}
    </div>
  );
}

function RecipeMacros({ recipe }: { recipe: Recipe }) {
  const macroPercentages = calculateMacroPercentages(recipe);

  if (!recipe.macros) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2 border-t pt-2">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-medium">Protein</span>
        <div className="flex min-h-14 w-fit min-w-14 flex-col items-center justify-center rounded-full bg-protein/10 p-2 text-protein-foreground dark:bg-protein/20">
          <span className="text-xs">{recipe.macros.protein}g</span>
          {macroPercentages?.protein && (
            <>
              <Separator className="my-0.5 w-3/4 bg-protein dark:bg-protein-foreground" />
              <span className="text-xs">{Number(macroPercentages?.protein).toFixed(0)}%</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-medium">Carbs</span>
        <div className="flex min-h-14 w-fit min-w-14 flex-col items-center justify-center rounded-full bg-carbs/10 p-2 text-carbs-foreground dark:bg-carbs/20">
          <span className="text-xs">{recipe.macros.carbs}g</span>
          {macroPercentages?.carbs && (
            <>
              <Separator className="my-0.5 w-3/4 bg-carbs dark:bg-carbs-foreground" />
              <span className="text-xs">{Number(macroPercentages?.carbs).toFixed(0)}%</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-medium">Fat</span>
        <div className="flex min-h-14 w-fit min-w-14 flex-col items-center justify-center rounded-full bg-fat/10 p-2 text-fat-foreground dark:bg-fat/20">
          <span className="text-xs">{recipe.macros.fat}g</span>
          {macroPercentages?.fat && (
            <>
              <Separator className="my-0.5 w-3/4 bg-fat dark:bg-fat-foreground" />
              <span className="text-xs">{Number(macroPercentages?.fat).toFixed(0)}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
