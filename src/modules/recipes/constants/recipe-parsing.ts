export const TEXT_FRACTION_MAP: Record<string, number> = {
  half: 0.5,
  quarter: 0.25,
  "one quarter": 0.25,
  "three quarters": 0.75,
  "three quarter": 0.75,
  third: 0.333,
  "one third": 0.333,
  "two thirds": 0.667,
  "two third": 0.667,
};

export const UNICODE_FRACTION_MAP: Record<string, number> = {
  "½": 0.5,
  "⅓": 0.333,
  "⅔": 0.667,
  "¼": 0.25,
  "¾": 0.75,
  "⅕": 0.2,
  "⅖": 0.4,
  "⅗": 0.6,
  "⅘": 0.8,
  "⅙": 0.167,
  "⅚": 0.833,
  "⅛": 0.125,
  "⅜": 0.375,
  "⅝": 0.625,
  "⅞": 0.875,
};

export const LOWERCASE_WORDS = new Set([
  "and",
  "or",
  "with",
  "in",
  "de",
  "del",
  "di",
  "le",
  "la",
  "en",
  "of",
  "the",
  "for",
]);

export const REGEX = {
  // Extracts content within parentheses.
  NOTES_PATTERN: /\([^)]*\)/g,

  // Matches a leading comma followed by optional whitespace.
  LEADING_COMMA: /^,\s*/,

  // Matches a number followed by a unicode fraction.
  UNICODE_FRACTION_IN_MIXED_NUMBER: new RegExp(`(\\d+)\\s*([${Object.keys(UNICODE_FRACTION_MAP).join("")}])`),

  // Extracts a metric measurement (e.g., "100g", "5kg").
  METRIC_MEASUREMENT: /(\d+)\s*(g|kg|ml|l|oz)\b/i,

  // Matches a slash surrounded by optional whitespace.
  SLASH_SEPARATOR: /\s*\/\s*/,

  // Matches a metric amount, unit, and optional range.
  METRIC_AMOUNT_AND_UNIT: /^(\d+(?:\.\d+)?(?:\s*[-–—]\s*\d+(?:\.\d+)?)?)\s*([a-zA-Z]+)\b/i,

  // Matches various dash characters.
  DASH: /[-–—]/,

  // Matches leading/trailing commas, spaces, and closing parentheses.
  LEADING_TRAILING_CLEANUP: /^[,\s]+|[,\s)]+$/g,

  // Matches container words like "can", "bottle", etc.
  CONTAINER_WORDS: /\b(?:cans?|bottles?|packs?|boxes?)\s+(?:of\s+)?/i,

  // Matches a leading "of".
  LEADING_OF: /^of\s+/i,

  // Matches "of" surrounded by spaces.
  INFIX_OF: /\s+of\s+/i,

  // Matches a multiplier format (e.g., "2 x 400g").
  MULTIPLIER_FORMAT: /^(\d+(?:\.\d+)?(?:\s*\d+\/\d+)?)\s*x\s*(.+)$/i,

  // Matches metric/imperial format with a slash (e.g., "400g / 14oz").
  METRIC_IMPERIAL_SLASH: /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s*\/\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\b\s*(.*)/i,

  // Extracts the name after a metric measurement and optional "cans".
  NAME_AFTER_METRIC: /(?:g|kg|ml|l|oz)\s*(?:cans?)?\s*([^/]+)$/i,

  // Matches mixed number ranges (e.g., "1 1/2 - 2 1/4").
  MIXED_NUMBER_RANGE:
    /^(\d+\s*[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|\d+(?:\s*\d+\/\d+)?)\s*(?:[-–—]|to)\s*(\d+\s*[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|\d+(?:\s*\d+\/\d+)?)\s+(.*)/i,

  // Matches compound box measurements (e.g., "12 16-oz box").
  COMPOUND_BOX_MEASUREMENT: /^(\d+)\s+(\d+(?:\.\d+)?)-?(?:oz\.?|ounces?)\s+box\s+(.*)/i,

  // Matches container with amount and optional "of" (e.g., "1 can of").
  CONTAINER_AMOUNT: /^(\d+(?:\.\d+)?)\s*(cans?|bottles?|packs?|boxes?)\s+(?:of\s+)?(.*)/i,

  // Matches a full metric/imperial range (e.g., "2-2.25kg / 4-4.5lb").
  FULL_METRIC_IMPERIAL_RANGE:
    /^((?:\d+(?:\.\d+)?(?:\s*[-–—]\s*\d+(?:\.\d+)?)?)\s*[a-zA-Z]+\s*\/\s*(?:\d+(?:\.\d+)?(?:\s*[-–—]\s*\d+(?:\.\d+)?)?)\s*[a-zA-Z]+)\b\s*(.*)/i,

  // Matches hyphenated measurements (e.g., "3-ounce").
  HYPHENATED_MEASUREMENT: /^(\d+(?:\.\d+)?)\s*[-–—]\s*([a-zA-Z]+)\b\s*(.*)/i,

  // Matches fraction ranges (e.g., "1/2-1", "1/2 to 3/4").
  FRACTION_RANGE:
    /^([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|\d+\/\d+|\d+(?:\.\d+)?)\s*(?:[-–—]|to)\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|\d+\/\d+|\d+(?:\.\d+)?)\s+(.*)/i,

  // Matches a mixed number with a unicode fraction.
  MIXED_UNICODE_FRACTION: new RegExp(`^(\\d+\\s*[${Object.keys(UNICODE_FRACTION_MAP).join("")}])\\s+(.*)`),

  // Matches a standalone unicode fraction.
  UNICODE_FRACTION: new RegExp(`^([${Object.keys(UNICODE_FRACTION_MAP).join("")}])\\s+(.*)`),

  // Matches a fraction with a standard unit.
  FRACTION_WITH_UNIT:
    /^(\d+\/\d+|\d+\s+\d+\/\d+|\d+\.\d+|\d+)\s+(teaspoons?|tablespoons?|cups?|ounces?|pounds?|oz\.?|lb\.?s?|tbsp|tsp|g|kg|ml|l|jars?|bottles?|packs?|packages?|boxes?|bunche?s?|heads?|sticks?|pinche?s?|cans?|cloves?|c\.|c)\b\s*(.*)/i,

  // Matches a simple number at the start of a string.
  SIMPLE_NUMBER: /^(\d+(?:\.\d+)?)\s+(.*)/,

  // Matches a single digit, for cases where only a number is provided.
  DIGIT_ONLY: /^\d+$/,

  // Matches compound measurements with bags/containers (e.g., "16 ounces bag").
  COMPOUND_BAG_MEASUREMENT: /^(\d+)\s+(?:ounces?|oz\.?)\s*(bag|pack|box|jar|can|bottle)\b\s*(.*)/i,

  // Additional regexes to fix linter errors
  PARENTHESES: /[()]/g,
  UNICODE_FRACTION_CHARS: /[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/,
  ANY_WHITESPACE: /\s+/g,
  WHITESPACE: /\s+/,
  COMMA_WITH_SPACES: /\s*,\s*/,

  PAREN_CLEANUP_OPEN: /\s*\(\s*,\s*|\s*\(\s*\(\s*/g,
  PAREN_CLEANUP_CLOSE: /\s*\)\s*,\s*|\s*\)\s*\)\s*/g,
  LEADING_DOTS_SPACES: /^[.\s]+/,
  OPTIONAL_TEXT: /\s*\(\s*optional\s*\)\s*/gi,
  COMMA_WITH_SPACES_GLOBAL: /\s*,\s*/g,
  DIGITS: /\d+/,
  SPLIT_BY_SPACE_OR_HYPHEN: /(?<=[-\s])|(?=[-\s])/,
};
