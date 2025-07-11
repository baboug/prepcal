import * as cheerio from "cheerio";

import type { ScrapedRecipe } from "../types";
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

export async function scrapeRecipe(url: string, throwError = false): Promise<ScrapedRecipe | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error = `Failed to fetch recipe: ${response.statusText}`;
      if (throwError) {
        throw new Error(error);
      }
      console.error(error);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const jsonLd = extractRecipeJsonLd($);
    if (!jsonLd) {
      const error = "No recipe data found on this page";
      if (throwError) {
        throw new Error(error);
      }
      console.error(error);
      return null;
    }

    // Extract recipe data from JSON-LD
    const ingredients = Array.isArray(jsonLd.recipeIngredient) ? jsonLd.recipeIngredient.map(parseIngredient) : [];
    const parsedInstructions = parseInstructions(jsonLd.recipeInstructions);
    const nutrition = parseNutrition(jsonLd.nutrition);

    const instructions = parsedInstructions.map((instruction) => ({
      step: instruction.step,
      video: instruction.video
        ? {
            url: instruction.video,
            duration: "PT0S",
            thumbnailUrl: "",
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
      servings: Number(jsonLd.recipeYield?.[0]?.toString() || jsonLd.recipeYield?.toString() || "1"),
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
  } catch (error) {
    if (throwError) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to scrape recipe. Please try again.");
    }
    console.error(`Error scraping recipe from ${url}:`, error);
    return null;
  }
}
