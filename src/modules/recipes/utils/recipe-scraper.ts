import * as cheerio from "cheerio";

import type { JsonLdRecipe, ScrapedRecipe } from "../types";
import { REGEX } from "./constants";
import { getBestImage } from "./image-processing";
import { parseIngredient } from "./ingredient-parser";
import { parseInstructions } from "./instruction-parser";
import { extractRecipeJsonLd, parseNutrition } from "./json-ld-parser";
import { cleanText, formatKeyword } from "./text-processing";

function parseRecipeField(field: string | string[] | undefined): string[] {
  if (Array.isArray(field)) {
    return field.map(formatKeyword);
  }
  if (typeof field === "string") {
    return [formatKeyword(field)];
  }
  return [];
}

function parseKeywords(keywords: string | string[] | undefined): string[] {
  if (Array.isArray(keywords)) {
    return keywords.map(formatKeyword);
  }
  if (typeof keywords === "string") {
    return cleanText(keywords)
      .split(",")
      .map((k) => formatKeyword(k.trim()))
      .filter(Boolean);
  }
  return [];
}

function processRecipeData(jsonLd: JsonLdRecipe, url: string): ScrapedRecipe {
  const ingredients = Array.isArray(jsonLd.recipeIngredient) ? jsonLd.recipeIngredient.map(parseIngredient) : [];
  const parsedInstructions = parseInstructions(jsonLd.recipeInstructions);
  const nutrition = parseNutrition(jsonLd.nutrition);

  const instructions = parsedInstructions.map((instruction) => ({
    step: instruction.step,
    video: instruction.video
      ? {
          url: instruction.video,
          duration: undefined,
          thumbnailUrl: undefined,
        }
      : undefined,
  }));

  return {
    name: cleanText(jsonLd.name || ""),
    description: cleanText(jsonLd.description || ""),
    category: parseRecipeField(jsonLd.recipeCategory),
    cuisine: parseRecipeField(jsonLd.recipeCuisine),
    keywords: parseKeywords(jsonLd.keywords),
    ingredients,
    instructions,
    prepTime: Number(jsonLd.prepTime?.match(REGEX.DIGITS)?.[0] || "0"),
    cookTime: Number(jsonLd.cookTime?.match(REGEX.DIGITS)?.[0] || "0"),
    servings: Number(Array.isArray(jsonLd.recipeYield) ? jsonLd.recipeYield[0] : (jsonLd.recipeYield ?? 1)),
    calories: nutrition.calories,
    macros: {
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
    },
    sourceUrl: url,
    imageUrl: getBestImage(jsonLd.image),
    videoUrl: jsonLd.video?.contentUrl || jsonLd.video?.embedUrl,
    isPublic: true,
  };
}

function handleFetchError(response: Response, throwError: boolean): void {
  const error = `Failed to fetch recipe: ${response.statusText}`;
  if (throwError) {
    throw new Error(error);
  }
  console.error(error);
}

function handleMissingRecipeData(throwError: boolean): void {
  const error = "No recipe data found on this page";
  if (throwError) {
    throw new Error(error);
  }
  console.error(error);
}

function handleScrapingError(error: unknown, url: string, throwError: boolean): void {
  if (throwError) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to scrape recipe. Please try again.");
  }
  console.error(`Error scraping recipe from ${url}:`, error);
}

export async function scrapeRecipe(url: string, throwError = false): Promise<ScrapedRecipe | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      handleFetchError(response, throwError);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const jsonLd = extractRecipeJsonLd($);
    if (!jsonLd) {
      handleMissingRecipeData(throwError);
      return null;
    }

    return processRecipeData(jsonLd, url);
  } catch (error) {
    handleScrapingError(error, url, throwError);
    return null;
  }
}
