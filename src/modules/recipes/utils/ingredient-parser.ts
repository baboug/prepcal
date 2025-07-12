import type { Measurement, ParsedIngredient } from "../types";
import { REGEX, STANDARD_UNITS, TEXT_FRACTION_MAP, UNICODE_FRACTION_MAP, UNIT_MAP } from "./constants";
import { capitalizeIngredient, cleanIngredient, cleanText, decodeHtmlEntities } from "./text-processing";

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
    if (Number.isNaN(num) || Number.isNaN(denom) || denom === 0) {
      return 0;
    }
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

function processMetricImperialRange(str: string): { amount: number; unit: string } {
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

function findUnitInText(text: string): { unit?: string; remainingText: string } {
  const unitWords = text.split(REGEX.WHITESPACE);
  let unit: string | undefined;
  let remainingText = text;

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

  return { unit, remainingText: remainingText.trim() };
}

function handleMixedNumberRange(str: string): Measurement | null {
  const mixedNumberRangeMatch = str.match(REGEX.MIXED_NUMBER_RANGE);
  if (!mixedNumberRangeMatch) {
    return null;
  }

  const [, num1, num2, rest] = mixedNumberRangeMatch;
  const amount1 = parseMixedNumber(num1.trim());
  const amount2 = parseMixedNumber(num2.trim());
  const amount = (amount1 + amount2) / 2;

  const { unit, remainingText } = findUnitInText(rest);

  return {
    amount,
    unit,
    remainingText,
  };
}

function handleCompoundBoxMeasurement(str: string): Measurement | null {
  const compoundBoxMatch = str.match(REGEX.COMPOUND_BOX_MEASUREMENT);
  if (!compoundBoxMatch) {
    return null;
  }

  const [, _, amount, rest] = compoundBoxMatch;
  return {
    amount: Number(amount),
    unit: "oz",
    remainingText: rest.trim(),
  };
}

function handleContainerMeasurement(str: string): Measurement | null {
  const containerMatch = str.match(REGEX.CONTAINER_AMOUNT);
  if (!containerMatch) {
    return null;
  }

  const [, amount, container, remainingText] = containerMatch;
  return {
    amount: Number(amount),
    unit: normalizeUnit(container),
    remainingText: remainingText.trim(),
  };
}

function handleMetricImperialRange(str: string): Measurement | null {
  const metricImperialRangeMatch = str.match(REGEX.FULL_METRIC_IMPERIAL_RANGE);
  if (!metricImperialRangeMatch) {
    return null;
  }

  const [, measurement, remainingText] = metricImperialRangeMatch;
  const { amount, unit } = processMetricImperialRange(measurement);
  return {
    amount,
    unit,
    remainingText: cleanName(remainingText),
  };
}

function handleMetricImperialSlash(str: string): Measurement | null {
  const metricImperialMatch = str.match(REGEX.METRIC_IMPERIAL_SLASH);
  if (!metricImperialMatch) {
    return null;
  }

  const [, amount1, unit1] = metricImperialMatch;
  const normalizedUnit = normalizeUnit(unit1);
  return {
    amount: Number(amount1),
    unit: normalizedUnit,
    remainingText: metricImperialMatch[5].trim(),
  };
}

function handleHyphenatedMeasurement(str: string): Measurement | null {
  const hyphenatedMatch = str.match(REGEX.HYPHENATED_MEASUREMENT);
  if (!hyphenatedMatch) {
    return null;
  }

  const [, amount, unit, rest] = hyphenatedMatch;
  return {
    amount: Number(amount),
    unit: normalizeUnit(unit),
    remainingText: rest.trim(),
  };
}

function handleFractionRange(str: string): Measurement | null {
  const fractionRangeMatch = str.match(REGEX.FRACTION_RANGE);
  if (!fractionRangeMatch) {
    return null;
  }

  const [, num1, num2, rest] = fractionRangeMatch;
  const amount1 = num1.match(REGEX.UNICODE_FRACTION_CHARS) ? UNICODE_FRACTION_MAP[num1] : fractionToDecimal(num1);
  const amount2 = num2.match(REGEX.UNICODE_FRACTION_CHARS) ? UNICODE_FRACTION_MAP[num2] : fractionToDecimal(num2);
  const amount = (amount1 + amount2) / 2;

  const { unit, remainingText } = findUnitInText(rest);

  return {
    amount,
    unit,
    remainingText,
  };
}

function handleMixedUnicodeFraction(str: string): Measurement | null {
  const mixedUnicodeFractionMatch = str.match(REGEX.MIXED_UNICODE_FRACTION);
  if (!mixedUnicodeFractionMatch) {
    return null;
  }

  const [, amount, rest] = mixedUnicodeFractionMatch;
  const parsedAmount = parseMixedNumber(amount);

  const { unit, remainingText } = findUnitInText(rest);

  return {
    amount: parsedAmount,
    unit,
    remainingText,
  };
}

function handleUnicodeFraction(str: string): Measurement | null {
  const unicodeFractionMatch = str.match(REGEX.UNICODE_FRACTION);
  if (!unicodeFractionMatch) {
    return null;
  }

  const [, fraction, rest] = unicodeFractionMatch;
  const amount = UNICODE_FRACTION_MAP[fraction];

  const { unit, remainingText } = findUnitInText(rest);

  return {
    amount,
    unit,
    remainingText,
  };
}

function handleFractionWithUnit(str: string): Measurement | null {
  const fractionUnitMatch = str.match(REGEX.FRACTION_WITH_UNIT);
  if (!fractionUnitMatch) {
    return null;
  }

  const [, amount, unit, rest] = fractionUnitMatch;
  const normalizedUnit = normalizeUnit(unit.toLowerCase());
  return {
    amount: parseMixedNumber(amount),
    unit: normalizedUnit,
    remainingText: rest.trim(),
  };
}

function handleTextFraction(str: string): Measurement | null {
  const textFractionPattern = Object.keys(TEXT_FRACTION_MAP)
    .sort((a, b) => b.length - a.length)
    .map((pattern) => pattern.replace(REGEX.ANY_WHITESPACE, "\\s+"))
    .join("|");

  const textFractionMatch = str.match(new RegExp(`^(${textFractionPattern})\\s+(?:of\\s+)?(?:a|an)?\\s+(.*)`, "i"));
  if (!textFractionMatch) {
    return null;
  }

  const [, fraction, rest] = textFractionMatch;
  const amount = TEXT_FRACTION_MAP[fraction.toLowerCase().replace(REGEX.ANY_WHITESPACE, " ")];

  const { unit, remainingText } = findUnitInText(rest);

  return {
    amount,
    unit,
    remainingText,
  };
}

function handleSimpleNumber(str: string): Measurement | null {
  const numberMatch = str.match(REGEX.SIMPLE_NUMBER);
  if (!numberMatch) {
    return null;
  }

  const [, amount, rest] = numberMatch;
  const { unit, remainingText } = findUnitInText(rest);

  return {
    amount: Number(amount),
    unit,
    remainingText,
  };
}

function extractMeasurement(str: string): Measurement | null {
  // Try each measurement type in order
  return (
    handleMixedNumberRange(str) ||
    handleCompoundBoxMeasurement(str) ||
    handleContainerMeasurement(str) ||
    handleMetricImperialRange(str) ||
    handleMetricImperialSlash(str) ||
    handleHyphenatedMeasurement(str) ||
    handleFractionRange(str) ||
    handleMixedUnicodeFraction(str) ||
    handleUnicodeFraction(str) ||
    handleFractionWithUnit(str) ||
    handleTextFraction(str) ||
    handleSimpleNumber(str)
  );
}

function extractNameFromNotes(notes: string): string {
  const cleanedNotes = cleanText(notes.replace(REGEX.PARENTHESES, ""));
  const firstNotePart = cleanedNotes.split(",")[0];
  if (firstNotePart && !firstNotePart.toLowerCase().startsWith("plus")) {
    return firstNotePart;
  }
  return "";
}

function parseTextBasedFraction(cleanedIngredient: string): ParsedIngredient | null {
  const textFractionPattern = Object.keys(TEXT_FRACTION_MAP)
    .sort((a, b) => b.length - a.length)
    .map((pattern) => pattern.replace(REGEX.ANY_WHITESPACE, "\\s+"))
    .join("|");

  const textFractionMatch = cleanedIngredient.match(
    new RegExp(`^(${textFractionPattern})(?:\\s+(?:of\\s+)?(?:a|an)?)?\\s+(.*)`, "i")
  );

  if (!textFractionMatch) {
    return null;
  }

  const [, fraction, rest] = textFractionMatch;
  const amount = TEXT_FRACTION_MAP[fraction.toLowerCase().replace(REGEX.ANY_WHITESPACE, " ")];

  const words = rest.split(REGEX.WHITESPACE);
  let unit: string | undefined;
  let name: string = rest;

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
  };
}

function handleNoMeasurement(cleanedIngredient: string, notes: string): ParsedIngredient {
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

function buildFinalIngredient(measurement: Measurement, notes: string): ParsedIngredient {
  let name = cleanText(measurement.remainingText);
  if (!name && notes) {
    name = extractNameFromNotes(notes);
  }

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
    amount: Math.round(measurement.amount * 1000) / 1000,
    unit: measurement.unit,
    notes: notes || undefined,
  };
}

export function parseIngredient(ingredient: string): ParsedIngredient {
  const decodedIngredient = decodeHtmlEntities(ingredient);
  const notes = extractNotes(decodedIngredient);
  const cleanedIngredient = cleanIngredient(decodedIngredient)
    .replace(REGEX.NOTES_PATTERN, "")
    .trim()
    .replace(REGEX.ANY_WHITESPACE, " ");

  // Try multiplier format first
  const multiplierResult = parseMultiplierFormat(cleanedIngredient, notes);
  if (multiplierResult) {
    return multiplierResult;
  }

  // Handle text-based fractions
  const textFractionResult = parseTextBasedFraction(cleanedIngredient);
  if (textFractionResult) {
    return {
      ...textFractionResult,
      notes: notes || undefined,
    };
  }

  // Try regular measurement format
  const measurement = extractMeasurement(cleanedIngredient);
  if (!measurement) {
    return handleNoMeasurement(cleanedIngredient, notes);
  }

  return buildFinalIngredient(measurement, notes);
}
