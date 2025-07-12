import type { RecipesGetOne } from "@/modules/recipes/types";

interface IngredientItemProps {
  ingredient: NonNullable<RecipesGetOne>["ingredients"][0];
  index: number;
}

export function IngredientItem({ ingredient, index }: IngredientItemProps) {
  return (
    <div className="flex items-start gap-3" key={index}>
      <span className="text-muted-foreground">→</span>
      <div className="flex-1">
        <span className="font-medium">
          <IngredientAmount amount={ingredient.amount} unit={ingredient.unit} />
          {ingredient.name}
        </span>
        {ingredient.notes && <span className="ml-2 text-muted-foreground">({ingredient.notes})</span>}
      </div>
    </div>
  );
}

function IngredientAmount({ amount, unit }: { amount?: number; unit?: string }) {
  if (amount && unit) {
    return `${amount} ${unit} `;
  }
  if (amount) {
    return `${amount} `;
  }
  return "";
}
