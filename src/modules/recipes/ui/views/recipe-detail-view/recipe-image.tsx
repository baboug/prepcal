import { CookingPotIcon, PlayIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { RecipesGetOne } from "@/modules/recipes/types";

interface RecipeImageProps {
  recipe: NonNullable<RecipesGetOne>;
}

export function RecipeImage({ recipe }: RecipeImageProps) {
  return (
    <div className="relative">
      {recipe.imageUrl ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image alt={recipe.name} className="object-cover" fill src={recipe.imageUrl} />
          {recipe.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                className="h-16 w-16 rounded-full bg-white/90 text-black hover:bg-white"
                onClick={() => {
                  if (recipe.videoUrl) {
                    window.open(recipe.videoUrl, "_blank");
                  }
                }}
                size="lg"
              >
                <PlayIcon className="size-8 fill-current" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted">
          <CookingPotIcon className="size-16 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
