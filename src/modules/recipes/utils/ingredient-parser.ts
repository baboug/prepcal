import type { Measurement, ParsedIngredient } from "../types";
import { REGEX, STANDARD_UNITS, TEXT_FRACTION_MAP, UNICODE_FRACTION_MAP, UNIT_MAP } from "./constants";
import { capitalizeIngredient, cleanIngredient, cleanText } from "./text-processing";

function extractNotes(ingredient: string): string {
  const matches = ingredient.match(REGEX.NOTES_PATTERN);
  if (!matches) {
    return "";
  }
  return matches
    .map((note) => cleanText(note.replace(REGEX.PARENTHESES, "")))
    .join(" ")
    .replace(REGEX.LEADING_COMMA, ""); // Remove leading comma and whitespace
}

function fractionToDecimal(str: string): number {
  // Check for Unicode fractions first
  if (str.length === 1 && str in UNICODE_FRACTION_MAP) {
    return UNICODE_FRACTION_MAP[str];
  }

  if (str.includes("/")) {
    const [num, denom] = str.split("/").map(Number);
    return num / denom;
  }
  return Number(str);
}

function parseMixedNumber(str: string): number {
  const trimmed = str.trim();
  // Handle unicode fractions in mixed numbers
  const unicodeFractionMatch = trimmed.match(REGEX.UNICODE_FRACTION_IN_MIXED_NUMBER);
  if (unicodeFractionMatch) {
    const [, whole, fraction] = unicodeFractionMatch;
    return Number(whole) + UNICODE_FRACTION_MAP[fraction];
  }

  const parts = trimmed.split(REGEX.WHITESPACE);
  if (parts.length === 2 && parts[1].includes("/")) {
    const whole = Number(parts[0]);
    const fraction = fractionToDecimal(parts[1]);
    return whole + fraction;
  }
  if (str.includes("/")) {
    return fractionToDecimal(str);
  }
  return Number(str);
}

function normalizeUnit(unit: string): string {
  return UNIT_MAP[unit.toLowerCase()] || unit.toLowerCase();
}

function extractMetricMeasurement(str: string): { amount: number; unit: string } | null {
  const match = str.match(REGEX.METRIC_MEASUREMENT);
  if (!match) {
    return null;
  }

  const [, amount, unit] = match;
  return {
    amount: Number(amount),
    unit: normalizeUnit(unit),
  };
}

function handleMetricImperialRange(str: string): { amount: number; unit: string } {
  const parts = str.split(REGEX.SLASH_SEPARATOR);
  if (parts.length !== 2) {
    return { amount: 0, unit: "" };
  }

  const metricMatch = parts[0].match(REGEX.METRIC_AMOUNT_AND_UNIT);
  if (!metricMatch) {
    return { amount: 0, unit: "" };
  }

  const [, metricAmount, metricUnit] = metricMatch;
  const normalizedUnit = normalizeUnit(metricUnit);

  // If it's a range, calculate the average
  if (metricAmount.match(REGEX.DASH)) {
    const [min, max] = metricAmount.split(REGEX.DASH).map((n) => Number(n.trim()));
    return { amount: (min + max) / 2, unit: normalizedUnit };
  }

  return { amount: Number(metricAmount), unit: normalizedUnit };
}

function cleanName(name: string): string {
  return cleanText(name)
    .replace(REGEX.LEADING_TRAILING_CLEANUP, "") // Remove leading/trailing commas, spaces, and closing parentheses
    .replace(REGEX.CONTAINER_WORDS, "") // Remove container words and optional 'of'
    .replace(REGEX.LEADING_OF, "") // Remove leading 'of' if it exists
    .replace(REGEX.INFIX_OF, " "); // Remove 'of' in the middle
}

function parseMultiplierFormat(cleanedIngredient: string, notes: string): ParsedIngredient | null {
  const match = cleanedIngredient.match(REGEX.MULTIPLIER_FORMAT);
  if (!match) {
    return null;
  }

  const [, multiplier, rest] = match;
  // Handle metric/imperial format with slashes
  const metricImperialMatch = rest.match(REGEX.METRIC_IMPERIAL_SLASH);
  if (metricImperialMatch) {
    const [, amount, unit1, , , remainingText] = metricImperialMatch;
    const normalizedUnit = normalizeUnit(unit1);
    const multiplierValue = parseMixedNumber(multiplier);
    const totalAmount = multiplierValue * Number(amount);

    // Extract name after the measurement
    const name = cleanName(remainingText.split(REGEX.COMMA_WITH_SPACES)[0]);

    return {
      name: capitalizeIngredient(name),
      amount: totalAmount,
      unit: normalizedUnit,
      notes: notes || undefined,
    };
  }

  const metricMatch = extractMetricMeasurement(rest);
  if (!metricMatch) {
    return null;
  }

  const multiplierValue = parseMixedNumber(multiplier);
  const totalAmount = multiplierValue * metricMatch.amount;

  // Extract name after the measurement and "cans"
  const nameMatch = rest.match(REGEX.NAME_AFTER_METRIC);
  const name = nameMatch ? cleanName(nameMatch[1]) : "";

  return {
    name: capitalizeIngredient(name),
    amount: totalAmount,
    unit: metricMatch.unit,
    notes: notes || undefined,
  };
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&#x2013;/g, "-")
    .replace(/&#x2014;/g, "-")
    .replace(/&#45;/g, "-")
    .replace(/&#8212;/g, "-");
}

function extractMeasurement(str: string): Measurement | null {
  // Handle mixed number ranges with unicode fractions (e.g., "1 ½ - 2 ¼")
  const mixedNumberRangeMatch = str.match(REGEX.MIXED_NUMBER_RANGE);
  if (mixedNumberRangeMatch) {
    const [, num1, num2, rest] = mixedNumberRangeMatch;
    const amount1 = parseMixedNumber(num1.trim());
    const amount2 = parseMixedNumber(num2.trim());
    const amount = (amount1 + amount2) / 2;

    // Look for unit in the remaining text
    const unitWords = rest.split(REGEX.WHITESPACE);
    let unit: string | undefined;
    let remainingText = rest;

    // Try to find the longest valid unit
    for (let i = 1; i <= 2; i++) {
      const possibleUnit = unitWords.slice(0, i).join(" ");
      const normalizedUnit = normalizeUnit(possibleUnit);
      if (STANDARD_UNITS.includes(normalizedUnit)) {
        unit = normalizedUnit;
        remainingText = unitWords.slice(i).join(" ");
        break;
      }
    }

    return {
      amount,
      unit,
      remainingText: remainingText.trim(),
    };
  }

  // Handle compound measurements with box and oz first
  const compoundBoxMatch = str.match(REGEX.COMPOUND_BOX_MEASUREMENT);
  if (compoundBoxMatch) {
    const [, _, amount, rest] = compoundBoxMatch;
    return {
      amount: Number(amount),
      unit: "oz",
      remainingText: rest.trim(),
    };
  }

  // Handle container measurements with 'of'
  const containerMatch = str.match(REGEX.CONTAINER_AMOUNT);
  if (containerMatch) {
    const [, amount, container, remainingText] = containerMatch;
    return {
      amount: Number(amount),
      unit: normalizeUnit(container),
      remainingText: remainingText.trim(),
    };
  }

  // Handle metric/imperial format with ranges (e.g., "2-2.25kg/ 4 - 4.5 lb")
  const metricImperialRangeMatch = str.match(REGEX.FULL_METRIC_IMPERIAL_RANGE);
  if (metricImperialRangeMatch) {
    const [, measurement, remainingText] = metricImperialRangeMatch;
    const { amount, unit } = handleMetricImperialRange(measurement);
    return {
      amount,
      unit,
      remainingText: cleanName(remainingText),
    };
  }

  // Handle metric/imperial format with slashes (e.g., "500g / 1lb")
  const metricImperialMatch = str.match(REGEX.METRIC_IMPERIAL_SLASH);
  if (metricImperialMatch) {
    const [, amount1, unit1] = metricImperialMatch;
    const normalizedUnit = normalizeUnit(unit1);
    return {
      amount: Number(amount1),
      unit: normalizedUnit,
      remainingText: metricImperialMatch[5].trim(),
    };
  }

  // Handle hyphenated measurements (e.g., "3-ounce")
  const hyphenatedMatch = str.match(REGEX.HYPHENATED_MEASUREMENT);
  if (hyphenatedMatch) {
    const [, amount, unit, rest] = hyphenatedMatch;
    return {
      amount: Number(amount),
      unit: normalizeUnit(unit),
      remainingText: rest.trim(),
    };
  }

  // Handle fraction ranges (e.g., "1/2-1", "1/2 - 3/4", "½ to 1")
  const fractionRangeMatch = str.match(REGEX.FRACTION_RANGE);
  if (fractionRangeMatch) {
    const [, num1, num2, rest] = fractionRangeMatch;
    const amount1 = num1.match(REGEX.UNICODE_FRACTION_CHARS) ? UNICODE_FRACTION_MAP[num1] : fractionToDecimal(num1);
    const amount2 = num2.match(REGEX.UNICODE_FRACTION_CHARS) ? UNICODE_FRACTION_MAP[num2] : fractionToDecimal(num2);
    const amount = (amount1 + amount2) / 2;

    // Look for unit in the remaining text
    const unitWords = rest.split(REGEX.WHITESPACE);
    let unit: string | undefined;
    let remainingText = rest;

    // Try to find the longest valid unit
    for (let i = 1; i <= 2; i++) {
      const possibleUnit = unitWords.slice(0, i).join(" ");
      const normalizedUnit = normalizeUnit(possibleUnit);
      if (STANDARD_UNITS.includes(normalizedUnit)) {
        unit = normalizedUnit;
        remainingText = unitWords.slice(i).join(" ");
        break;
      }
    }

    return {
      amount,
      unit,
      remainingText: remainingText.trim(),
    };
  }

  // Handle mixed numbers with unicode fractions (e.g., "2½")
  const mixedUnicodeFractionMatch = str.match(REGEX.MIXED_UNICODE_FRACTION);
  if (mixedUnicodeFractionMatch) {
    const [, amount, rest] = mixedUnicodeFractionMatch;
    const parsedAmount = parseMixedNumber(amount);

    // Look for unit in the remaining text
    const unitWords = rest.split(REGEX.WHITESPACE);
    let unit: string | undefined;
    let remainingText = rest;

    // Try to find the longest valid unit
    for (let i = 1; i <= 2; i++) {
      const possibleUnit = unitWords.slice(0, i).join(" ");
      const normalizedUnit = normalizeUnit(possibleUnit);
      if (STANDARD_UNITS.includes(normalizedUnit)) {
        unit = normalizedUnit;
        remainingText = unitWords.slice(i).join(" ");
        break;
      }
    }

    return {
      amount: parsedAmount,
      unit,
      remainingText: remainingText.trim(),
    };
  }

  // Handle simple unicode fractions
  const unicodeFractionMatch = str.match(REGEX.UNICODE_FRACTION);
  if (unicodeFractionMatch) {
    const [, fraction, rest] = unicodeFractionMatch;
    const amount = UNICODE_FRACTION_MAP[fraction];

    // Look for unit in the remaining text
    const unitWords = rest.split(REGEX.WHITESPACE);
    let unit: string | undefined;
    let remainingText = rest;

    // Try to find the longest valid unit
    for (let i = 1; i <= 2; i++) {
      const possibleUnit = unitWords.slice(0, i).join(" ");
      const normalizedUnit = normalizeUnit(possibleUnit);
      if (STANDARD_UNITS.includes(normalizedUnit)) {
        unit = normalizedUnit;
        remainingText = unitWords.slice(i).join(" ");
        break;
      }
    }

    return {
      amount,
      unit,
      remainingText: remainingText.trim(),
    };
  }

  // Handle simple fractions with units (e.g. "1/2 teaspoon", "3/4 cups", "1/4 c.")
  const fractionUnitMatch = str.match(REGEX.FRACTION_WITH_UNIT);
  if (fractionUnitMatch) {
    const [, amount, unit, rest] = fractionUnitMatch;
    const normalizedUnit = normalizeUnit(unit.toLowerCase());
    return {
      amount: parseMixedNumber(amount),
      unit: normalizedUnit,
      remainingText: rest.trim(),
    };
  }

  // Handle text-based fractions before regular measurements
  const textFractionPattern = Object.keys(TEXT_FRACTION_MAP)
    .sort((a, b) => b.length - a.length) // Sort by length to match longer patterns first
    .map((pattern) => pattern.replace(REGEX.ANY_WHITESPACE, "\\s+")) // Make spaces flexible
    .join("|");
  const textFractionMatch = str.match(new RegExp(`^(${textFractionPattern})\\s+(?:of\\s+)?(?:a|an)?\\s+(.*)`, "i"));
  if (textFractionMatch) {
    const [, fraction, rest] = textFractionMatch;
    const amount = TEXT_FRACTION_MAP[fraction.toLowerCase().replace(REGEX.ANY_WHITESPACE, " ")];

    // Look for unit in the remaining text
    const unitWords = rest.split(REGEX.WHITESPACE);
    let unit: string | undefined;
    let remainingText = rest;

    // Try to find the longest valid unit
    for (let i = 1; i <= 2; i++) {
      const possibleUnit = unitWords.slice(0, i).join(" ");
      const normalizedUnit = normalizeUnit(possibleUnit);
      if (STANDARD_UNITS.includes(normalizedUnit)) {
        unit = normalizedUnit;
        remainingText = unitWords.slice(i).join(" ");
        break;
      }
    }

    return {
      amount,
      unit,
      remainingText: remainingText.trim(),
    };
  }

  // Match simple numbers
  const numberMatch = str.match(REGEX.SIMPLE_NUMBER);
  if (numberMatch) {
    const [, amount, rest] = numberMatch;

    // Look for unit in the remaining text
    const unitWords = rest.split(REGEX.WHITESPACE);
    let unit: string | undefined;
    let remainingText = rest;

    // Try to find the longest valid unit
    for (let i = 1; i <= 2; i++) {
      const possibleUnit = unitWords.slice(0, i).join(" ");
      const normalizedUnit = normalizeUnit(possibleUnit);
      if (STANDARD_UNITS.includes(normalizedUnit)) {
        unit = normalizedUnit;
        remainingText = unitWords.slice(i).join(" ");
        break;
      }
    }

    return {
      amount: Number(amount),
      unit,
      remainingText: remainingText.trim(),
    };
  }

  return null;
}

function extractNameFromNotes(notes: string): string {
  const cleanedNotes = cleanText(notes.replace(REGEX.PARENTHESES, ""));
  const firstNotePart = cleanedNotes.split(",")[0];
  if (firstNotePart && !firstNotePart.toLowerCase().startsWith("plus")) {
    return firstNotePart;
  }
  return "";
}

export function parseIngredient(ingredient: string): ParsedIngredient {
  // Decode HTML entities first
  const decodedIngredient = decodeHtmlEntities(ingredient);

  const notes = extractNotes(decodedIngredient);
  const cleanedIngredient = cleanIngredient(decodedIngredient)
    .replace(REGEX.NOTES_PATTERN, "")
    .trim()
    .replace(REGEX.ANY_WHITESPACE, " ");

  // Try multiplier format first (e.g., "2 x 400g")
  const multiplierResult = parseMultiplierFormat(cleanedIngredient, notes);
  if (multiplierResult) {
    return multiplierResult;
  }

  // Handle text-based fractions before regular measurements
  const textFractionPattern = Object.keys(TEXT_FRACTION_MAP)
    .sort((a, b) => b.length - a.length) // Sort by length to match longer patterns first
    .map((pattern) => pattern.replace(REGEX.ANY_WHITESPACE, "\\s+")) // Make spaces flexible
    .join("|");
  const textFractionMatch = cleanedIngredient.match(
    new RegExp(`^(${textFractionPattern})(?:\\s+(?:of\\s+)?(?:a|an)?)?\\s+(.*)`, "i")
  );
  if (textFractionMatch) {
    const [, fraction, rest] = textFractionMatch;
    const amount = TEXT_FRACTION_MAP[fraction.toLowerCase().replace(REGEX.ANY_WHITESPACE, " ")];

    // Split the remaining text into words
    const words = rest.split(REGEX.WHITESPACE);
    let unit: string | undefined;
    let name: string = rest;

    // Try to find a unit in the first word or two
    for (let i = 1; i <= 2 && i <= words.length; i++) {
      const possibleUnit = words.slice(0, i).join(" ");
      const normalizedUnit = normalizeUnit(possibleUnit);
      if (STANDARD_UNITS.includes(normalizedUnit)) {
        unit = normalizedUnit;
        name = words.slice(i).join(" ");
        break;
      }
    }

    return {
      name: capitalizeIngredient(name),
      amount,
      unit,
      notes: notes || undefined,
    };
  }

  // Try regular format
  const measurement = extractMeasurement(cleanedIngredient);
  if (!measurement) {
    // If there's no measurement but there are notes, try to use them as the name
    if (notes && cleanedIngredient.match(REGEX.DIGIT_ONLY)) {
      return {
        name: capitalizeIngredient(notes),
        amount: Number(cleanedIngredient),
        notes: notes || undefined,
      };
    }

    return {
      name: capitalizeIngredient(cleanText(cleanedIngredient)),
      notes: notes || undefined,
    };
  }

  // Get the name from the measurement or notes if empty
  let name = cleanText(measurement.remainingText);
  if (!name && notes) {
    name = extractNameFromNotes(notes);
  }

  // Special handling for compound measurements with bags/containers
  const compoundMatch = name.match(REGEX.COMPOUND_BAG_MEASUREMENT);
  if (compoundMatch) {
    const [, , container, rest] = compoundMatch;
    return {
      name: capitalizeIngredient(rest),
      amount: measurement.amount,
      unit: normalizeUnit(container),
      notes: notes || undefined,
    };
  }

  return {
    name: capitalizeIngredient(name),
    amount: Number(measurement.amount.toFixed(3)),
    unit: measurement.unit,
    notes: notes || undefined,
  };
}
