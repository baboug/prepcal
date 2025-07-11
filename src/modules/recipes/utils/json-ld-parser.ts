import type { CheerioAPI } from "cheerio";

import type { JsonLdRecipe } from "../types";

function parseJsonLdScript(content: unknown): JsonLdRecipe | null {
  if (!content || typeof content !== "object") {
    return null;
  }

  // Handle direct Recipe objects
  if ((content as JsonLdRecipe)["@type"] === "Recipe") {
    return content as JsonLdRecipe;
  }

  // Handle @graph arrays
  if ("@graph" in content && Array.isArray((content as { "@graph": unknown[] })["@graph"])) {
    return (content as { "@graph": JsonLdRecipe[] })["@graph"].find((item) => item["@type"] === "Recipe") || null;
  }

  return null;
}

export function extractRecipeJsonLd($: CheerioAPI): JsonLdRecipe | null {
  const jsonLdScripts = $('script[type="application/ld+json"]')
    .toArray()
    .map((element) => {
      try {
        const content = JSON.parse($(element).html() || "");
        return parseJsonLdScript(content);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return jsonLdScripts[0] || null;
}

export function parseNutrition(nutrition: Record<string, unknown> = {}): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  return {
    calories: Math.round(Number.parseInt((nutrition.calories as string) || "0", 10)),
    protein: Math.round(Number.parseInt((nutrition.proteinContent as string) || "0", 10)),
    carbs: Math.round(Number.parseInt((nutrition.carbohydrateContent as string) || "0", 10)),
    fat: Math.round(Number.parseInt((nutrition.fatContent as string) || "0", 10)),
  };
}
