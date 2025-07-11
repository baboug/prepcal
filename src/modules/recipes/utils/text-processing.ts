import { capitalizeWords } from "@/lib/utils";
import { LOWERCASE_WORDS, REGEX } from "@/modules/recipes/utils/constants";

export function cleanText(text: string): string {
  return (
    text
      // HTML entities for quotes and apostrophes
      .replace(/&#39;/g, "'")
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x22;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&lsquo;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")

      // Common HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")

      // Dashes and hyphens
      .replace(/&#8211;/g, "-")
      .replace(/&#8212;/g, "—")
      .replace(/&ndash;/g, "-")
      .replace(/&mdash;/g, "—")

      // Fractions and special characters
      .replace(/&frac12;/g, "½")
      .replace(/&frac14;/g, "¼")
      .replace(/&frac34;/g, "¾")
      .replace(/&deg;/g, "°")

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
