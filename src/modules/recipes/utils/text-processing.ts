import { decode } from "html-entities";

import { capitalizeWords } from "@/lib/utils";
import { LOWERCASE_WORDS, REGEX } from "@/modules/recipes/constants";

export function decodeHtmlEntities(str: string): string {
  return decode(str);
}

export function cleanText(text: string): string {
  return (
    decodeHtmlEntities(text)
      // Clean up parentheses formatting
      .replace(REGEX.PAREN_CLEANUP_OPEN, " (")
      .replace(REGEX.PAREN_CLEANUP_CLOSE, " )")

      // Clean up leading periods and spaces
      .replace(REGEX.LEADING_DOTS_SPACES, "")

      // Clean up multiple spaces and trim
      .replace(REGEX.ANY_WHITESPACE, " ")
      .trim()
  );
}

export function cleanIngredient(ingredient: string): string {
  return cleanText(ingredient)
    .replace(REGEX.OPTIONAL_TEXT, " (optional)")
    .replace(REGEX.COMMA_WITH_SPACES_GLOBAL, ", ");
}

export function formatKeyword(keyword: string): string {
  return capitalizeWords(cleanText(keyword));
}

export function capitalizeIngredient(text: string): string {
  if (!text) {
    return text;
  }

  // Split by spaces and hyphens, preserving the separators
  const words = text.split(REGEX.SPLIT_BY_SPACE_OR_HYPHEN);

  return words
    .map((word, index) => {
      const trimmedWord = word.trim();
      if (!trimmedWord) {
        return word; // Preserve spaces and hyphens
      }

      // Keep lowercase words lowercase unless they're at the start
      if (index !== 0 && LOWERCASE_WORDS.has(trimmedWord.toLowerCase())) {
        return trimmedWord.toLowerCase();
      }

      // Default capitalization
      return trimmedWord.charAt(0).toUpperCase() + trimmedWord.slice(1).toLowerCase();
    })
    .join("");
}
