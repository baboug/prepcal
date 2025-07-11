import { describe, expect, test } from "vitest";

import { parseIngredient } from "./ingredient-parser";

describe("parseIngredient", () => {
  describe("basic measurements", () => {
    test("parses simple number with unit", () => {
      expect(parseIngredient("2 cups flour")).toEqual({
        name: "Flour",
        amount: 2,
        unit: "cup",
        notes: undefined,
      });
    });
    test("parses decimal numbers", () => {
      expect(parseIngredient("1.5 cups sugar")).toEqual({
        name: "Sugar",
        amount: 1.5,
        unit: "cup",
        notes: undefined,
      });
    });

    test("handles ingredient without measurement", () => {
      expect(parseIngredient("salt to taste")).toEqual({
        name: "Salt To Taste",
        notes: undefined,
      });
    });
  });

  describe("fractions", () => {
    test("parses simple fractions", () => {
      expect(parseIngredient("1/2 cup milk")).toEqual({
        name: "Milk",
        amount: 0.5,
        unit: "cup",
        notes: undefined,
      });
    });

    test("parses mixed numbers with fractions", () => {
      expect(parseIngredient("1 1/2 cups flour")).toEqual({
        name: "Flour",
        amount: 1.5,
        unit: "cup",
        notes: undefined,
      });
    });

    test("parses unicode fractions", () => {
      expect(parseIngredient("½ cup sugar")).toEqual({
        name: "Sugar",
        amount: 0.5,
        unit: "cup",
        notes: undefined,
      });
    });

    test("parses mixed numbers with unicode fractions", () => {
      expect(parseIngredient("2 ½ cups flour")).toEqual({
        name: "Flour",
        amount: 2.5,
        unit: "cup",
        notes: undefined,
      });
    });

    test("parses mixed number ranges with unicode fractions", () => {
      expect(parseIngredient("1 ½ - 2 ¼ cups milk")).toEqual({
        name: "Milk",
        amount: 1.875,
        unit: "cup",
        notes: undefined,
      });
    });
  });

  describe("text-based fractions", () => {
    test("parses 'half'", () => {
      expect(parseIngredient("half a cucumber")).toEqual({
        name: "Cucumber",
        amount: 0.5,
        notes: undefined,
      });
    });

    test("parses 'quarter of an'", () => {
      expect(parseIngredient("quarter of an onion")).toEqual({
        name: "Onion",
        amount: 0.25,
        notes: undefined,
      });
    });

    test("parses 'one third'", () => {
      expect(parseIngredient("one third cup sugar")).toEqual({
        name: "Sugar",
        amount: 0.333,
        unit: "cup",
        notes: undefined,
      });
    });

    test("parses 'three quarters'", () => {
      expect(parseIngredient("three quarters cup milk")).toEqual({
        name: "Milk",
        amount: 0.75,
        unit: "cup",
        notes: undefined,
      });
    });

    test("parses 'two thirds'", () => {
      expect(parseIngredient("two thirds cup flour")).toEqual({
        name: "Flour",
        amount: 0.667,
        unit: "cup",
        notes: undefined,
      });
    });

    test("parses text fraction with unit and notes", () => {
      expect(parseIngredient("half a cup flour (all-purpose, sifted)")).toEqual({
        name: "Flour",
        amount: 0.5,
        unit: "cup",
        notes: "all-purpose, sifted",
      });
    });
  });

  describe("unit normalization", () => {
    test("normalizes tablespoons to tbsp", () => {
      expect(parseIngredient("2 tablespoons olive oil")).toEqual({
        name: "Olive Oil",
        amount: 2,
        unit: "tbsp",
        notes: undefined,
      });
    });

    test("normalizes teaspoons to tsp", () => {
      expect(parseIngredient("1 teaspoon salt")).toEqual({
        name: "Salt",
        amount: 1,
        unit: "tsp",
        notes: undefined,
      });
    });

    test("normalizes pounds to lb", () => {
      expect(parseIngredient("2 pounds potatoes")).toEqual({
        name: "Potatoes",
        amount: 2,
        unit: "lb",
        notes: undefined,
      });
    });

    test("normalizes ounces to oz", () => {
      expect(parseIngredient("8 oz. cream cheese")).toEqual({
        name: "Cream Cheese",
        amount: 8,
        unit: "oz",
        notes: undefined,
      });
    });
  });

  describe("ranges", () => {
    test("handles ranges with 'to'", () => {
      expect(parseIngredient("2 to 3 cups flour")).toEqual({
        name: "Flour",
        amount: 2.5,
        unit: "cup",
        notes: undefined,
      });
    });

    test("handles ranges with dash", () => {
      expect(parseIngredient("2-3 tablespoons sugar")).toEqual({
        name: "Sugar",
        amount: 2.5,
        unit: "tbsp",
        notes: undefined,
      });
    });

    test("handles ranges with en-dash", () => {
      expect(parseIngredient("2–3 cups milk")).toEqual({
        name: "Milk",
        amount: 2.5,
        unit: "cup",
        notes: undefined,
      });
    });
  });

  describe("multiplier format", () => {
    test("parses basic multiplier", () => {
      expect(parseIngredient("2 x 400g tomatoes")).toEqual({
        name: "Tomatoes",
        amount: 800,
        unit: "g",
        notes: undefined,
      });
    });

    test("parses multiplier with fraction", () => {
      expect(parseIngredient("1 1/2 x 400g flour")).toEqual({
        name: "Flour",
        amount: 600,
        unit: "g",
        notes: undefined,
      });
    });

    test("parses decimal multiplier", () => {
      expect(parseIngredient("1.5 x 400g sugar")).toEqual({
        name: "Sugar",
        amount: 600,
        unit: "g",
        notes: undefined,
      });
    });
  });

  describe("notes handling", () => {
    test("extracts notes in parentheses", () => {
      expect(parseIngredient("2 cups flour (all-purpose)")).toEqual({
        name: "Flour",
        amount: 2,
        unit: "cup",
        notes: "all-purpose",
      });
    });

    test("extracts multiple notes", () => {
      expect(parseIngredient("1 onion (medium) (diced)")).toEqual({
        name: "Onion",
        amount: 1,
        notes: "medium diced",
      });
    });

    test("uses notes for name when main part is empty", () => {
      expect(parseIngredient("2 (14 oz cans diced tomatoes)")).toEqual({
        name: "14 Oz Cans Diced Tomatoes",
        amount: 2,
        notes: "14 oz cans diced tomatoes",
      });
    });

    test("handles nested parentheses in notes", () => {
      expect(parseIngredient("1 cup rice (jasmine (or basmati))")).toEqual({
        name: "Rice",
        amount: 1,
        unit: "cup",
        notes: "jasmine or basmati",
      });
    });

    test("handles trailing units in notes", () => {
      expect(parseIngredient("1 chicken breast (about 200g)")).toEqual({
        name: "Chicken Breast",
        amount: 1,
        notes: "about 200g",
      });
    });
  });

  describe("compound measurements", () => {
    test("handles bag measurements", () => {
      expect(parseIngredient("2 16 oz bag frozen peas")).toEqual({
        name: "Frozen Peas",
        amount: 2,
        unit: "bag",
        notes: undefined,
      });
    });

    test("handles can measurements", () => {
      expect(parseIngredient("3 14 oz can diced tomatoes")).toEqual({
        name: "Diced Tomatoes",
        amount: 3,
        unit: "can",
        notes: undefined,
      });
    });

    test("handles compound measurements with notes", () => {
      expect(parseIngredient("2 16 oz can chickpeas (drained and rinsed)")).toEqual({
        name: "Chickpeas",
        amount: 2,
        unit: "can",
        notes: "drained and rinsed",
      });
    });

    test("handles 'of' in container measurements", () => {
      expect(parseIngredient("2 cans of tomatoes")).toEqual({
        name: "Tomatoes",
        amount: 2,
        unit: "can",
        notes: undefined,
      });
    });

    test("handles bottle measurements", () => {
      expect(parseIngredient("1 bottle white wine")).toEqual({
        name: "White Wine",
        amount: 1,
        unit: "bottle",
        notes: undefined,
      });
    });

    test("handles package measurements", () => {
      expect(parseIngredient("2 packages active dry yeast")).toEqual({
        name: "Active Dry Yeast",
        amount: 2,
        unit: "pack",
        notes: undefined,
      });
    });

    test("handles box measurements", () => {
      expect(parseIngredient("1 box cake mix")).toEqual({
        name: "Cake Mix",
        amount: 1,
        unit: "box",
        notes: undefined,
      });
    });
  });

  describe("HTML entity decoding", () => {
    test("decodes basic HTML entities", () => {
      expect(parseIngredient("2 cups &quot;00&quot; flour")).toEqual({
        name: '"00" Flour',
        amount: 2,
        unit: "cup",
        notes: undefined,
      });
    });

    test("decodes dash entities", () => {
      expect(parseIngredient("2&ndash;3 cups flour")).toEqual({
        name: "Flour",
        amount: 2.5,
        unit: "cup",
        notes: undefined,
      });
    });

    test("decodes HTML en-dash in ranges", () => {
      expect(parseIngredient("1 1/2 &#8211; 2 cups chicken broth")).toEqual({
        name: "Chicken Broth",
        amount: 1.75,
        unit: "cup",
        notes: undefined,
      });
    });

    test("decodes apostrophe entities", () => {
      expect(parseIngredient("2 tbsp baker&#39;s yeast")).toEqual({
        name: "Baker's Yeast",
        amount: 2,
        unit: "tbsp",
        notes: undefined,
      });
    });
  });

  describe("metric/imperial format", () => {
    test("parses metric/imperial format with slash", () => {
      expect(
        parseIngredient("500g / 1lb chicken breast (, skinless boneless, tenderloin or boneless thighs (Note 1))")
      ).toEqual({
        name: "Chicken Breast",
        amount: 500,
        unit: "g",
        notes: "skinless boneless, tenderloin or boneless thighs Note 1",
      });
    });

    test("parses metric/imperial format with ranges", () => {
      expect(
        parseIngredient(
          "2-2.25kg/ 4 - 4.5 lb lamb shoulder (, bone in, excess fat trimmed (but leave thin fat layer on (Note 1)))"
        )
      ).toEqual({
        name: "Lamb Shoulder",
        amount: 2.125,
        unit: "kg",
        notes: "bone in, excess fat trimmed but leave thin fat layer on Note 1",
      });
    });

    test("parses multiplier with metric/imperial format", () => {
      expect(parseIngredient("2 x 400g / 14 oz cans chickpeas (, well drained (Note 2 for dried))")).toEqual({
        name: "Chickpeas",
        amount: 800,
        unit: "g",
        notes: "well drained Note 2 for dried",
      });
    });
  });

  describe("hyphenated measurements", () => {
    test("parses hyphenated measurements", () => {
      expect(parseIngredient("3-ounce chunk of cotjia cheese")).toEqual({
        name: "Chunk of Cotjia Cheese",
        amount: 3,
        unit: "oz",
        notes: undefined,
      });
    });
  });

  describe("edge cases", () => {
    test("handles empty string", () => {
      expect(parseIngredient("")).toEqual({
        name: "",
        notes: undefined,
      });
    });

    test("handles whitespace only", () => {
      expect(parseIngredient("   ")).toEqual({
        name: "",
        notes: undefined,
      });
    });

    test("handles invalid numbers", () => {
      expect(parseIngredient("abc cups flour")).toEqual({
        name: "Abc Cups Flour",
        notes: undefined,
      });
    });

    test("handles missing unit", () => {
      expect(parseIngredient("2 carrots")).toEqual({
        name: "Carrots",
        amount: 2,
        notes: undefined,
      });
    });

    test("handles mixed case units", () => {
      expect(parseIngredient("2 TaBlEsPoOnS sugar")).toEqual({
        name: "Sugar",
        amount: 2,
        unit: "tbsp",
        notes: undefined,
      });
    });

    test("handles extra spaces in metric/imperial format", () => {
      expect(parseIngredient("500g   /    1lb chicken")).toEqual({
        name: "Chicken",
        amount: 500,
        unit: "g",
        notes: undefined,
      });
    });
  });

  describe("additional unit normalization", () => {
    test("normalizes 'table spoon' to tbsp", () => {
      expect(parseIngredient("2 table spoons sugar")).toEqual({
        name: "Sugar",
        amount: 2,
        unit: "tbsp",
        notes: undefined,
      });
    });

    test("normalizes 'tea spoon' to tsp", () => {
      expect(parseIngredient("1 tea spoon vanilla extract")).toEqual({
        name: "Vanilla Extract",
        amount: 1,
        unit: "tsp",
        notes: undefined,
      });
    });

    test("normalizes 'lbs.' to lb", () => {
      expect(parseIngredient("2 lbs. potatoes")).toEqual({
        name: "Potatoes",
        amount: 2,
        unit: "lb",
        notes: undefined,
      });
    });

    test("normalizes metric units", () => {
      expect(parseIngredient("500 grams flour")).toEqual({
        name: "Flour",
        amount: 500,
        unit: "g",
        notes: undefined,
      });
    });

    test("normalizes volume units", () => {
      expect(parseIngredient("2 liters water")).toEqual({
        name: "Water",
        amount: 2,
        unit: "l",
        notes: undefined,
      });
    });
  });

  describe("additional edge cases", () => {
    test("handles ingredient with only notes", () => {
      expect(parseIngredient("fresh basil leaves (chopped)")).toEqual({
        name: "Fresh Basil Leaves",
        notes: "chopped",
      });
    });

    test("handles ingredient with multiple commas in notes", () => {
      expect(parseIngredient("chicken breast (skinless, boneless, cut into 1-inch pieces)")).toEqual({
        name: "Chicken Breast",
        notes: "skinless, boneless, cut into 1-inch pieces",
      });
    });

    test("handles ingredient with plus in notes", () => {
      expect(parseIngredient("water (plus more as needed)")).toEqual({
        name: "Water",
        notes: "plus more as needed",
      });
    });

    test("handles ingredient with nested measurements in notes", () => {
      expect(parseIngredient("onion (1 medium, about 150g)")).toEqual({
        name: "Onion",
        notes: "1 medium, about 150g",
      });
    });

    test("handles ingredient with temperature in notes", () => {
      expect(parseIngredient("water (110°F)")).toEqual({
        name: "Water",
        notes: "110°F",
      });
    });
  });

  describe("abbreviated measurements and complex ranges", () => {
    test("handles abbreviated cup measurement", () => {
      expect(parseIngredient("1/4 c. coarsely chopped fresh basil")).toEqual({
        name: "Coarsely Chopped Fresh Basil",
        amount: 0.25,
        unit: "cup",
        notes: undefined,
      });
    });

    test("handles compound measurements with box", () => {
      expect(parseIngredient("1 8.5-oz. box corn muffin mix (preferably Jiffy)")).toEqual({
        name: "Corn Muffin Mix",
        amount: 8.5,
        unit: "oz",
        notes: "preferably Jiffy",
      });
    });

    test("handles range with unicode fraction", () => {
      expect(parseIngredient("½ to 1 cup fresh strawberries (thinly sliced)")).toEqual({
        name: "Fresh Strawberries",
        amount: 0.75,
        unit: "cup",
        notes: "thinly sliced",
      });
    });

    test("handles mixed number with unicode fraction", () => {
      expect(parseIngredient("2½ cups chicken broth")).toEqual({
        name: "Chicken Broth",
        amount: 2.5,
        unit: "cup",
        notes: undefined,
      });
    });

    test("handles hyphenated range with fractions", () => {
      expect(parseIngredient("1/2-1 teaspoon Italian seasoning (or mixed herbs)")).toEqual({
        name: "Italian Seasoning",
        amount: 0.75,
        unit: "tsp",
        notes: "or mixed herbs",
      });
    });

    test("handles hyphenated range with fractions and abbreviated unit", () => {
      expect(parseIngredient("3/4-1 tsp sea salt")).toEqual({
        name: "Sea Salt",
        amount: 0.875,
        unit: "tsp",
        notes: undefined,
      });
    });

    test("handles tablespoon abbreviation with notes", () => {
      expect(parseIngredient("1 TB kosher salt (plus more to taste)")).toEqual({
        name: "Kosher Salt",
        amount: 1,
        unit: "tbsp",
        notes: "plus more to taste",
      });
    });

    test("handles fraction range with divided note", () => {
      expect(parseIngredient("1/2 - 3/4 cup grated Parmesan cheese (divided)")).toEqual({
        name: "Grated Parmesan Cheese",
        amount: 0.625,
        unit: "cup",
        notes: "divided",
      });
    });
  });
});
