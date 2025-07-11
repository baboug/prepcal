import { beforeEach, describe, expect, test, vi } from "vitest";

import { seedRecipes } from "./seed-recipes";
import { parseSitemap } from "./utils/sitemap-parser";

vi.mock("postgres", () => ({
  default: vi.fn(() => ({
    end: vi.fn(),
  })),
}));

const mockDelete = vi.fn();
const mockInsert = vi.fn().mockReturnValue({ values: vi.fn() });

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: vi.fn(() => ({
    delete: mockDelete,
    insert: mockInsert,
  })),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Recipe seeding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("parseSitemap", () => {
    test("successfully parses sitemap", async () => {
      const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/recipes/1</loc>
    <lastmod>2024-01-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/recipes/2</loc>
    <lastmod>2024-01-02</lastmod>
  </url>
</urlset>`;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockXml),
      });

      const urls = await parseSitemap("https://example.com/sitemap.xml");
      expect(urls).toEqual(["https://example.com/recipes/1", "https://example.com/recipes/2"]);
    });

    test("handles invalid sitemap", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("<invalid>xml</invalid>"),
      });

      await expect(parseSitemap("https://example.com/sitemap.xml")).rejects.toThrow("Invalid sitemap format");
    });

    test("handles fetch error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(parseSitemap("https://example.com/sitemap.xml")).rejects.toThrow(
        "Failed to fetch sitemap: Not Found"
      );
    });
  });

  describe("seedRecipes", () => {
    const mockConfig = {
      sitemapUrl: "https://example.com/sitemap.xml",
      concurrency: 2,
      batchSize: 2,
      clearDatabase: true,
      databaseUrl: "postgres://localhost:5432/test",
    };

    test("successfully seeds recipes", async () => {
      // Mock sitemap response
      const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/recipes/1</loc>
  </url>
  <url>
    <loc>https://example.com/recipes/2</loc>
  </url>
</urlset>`;

      // Mock recipe responses
      const mockRecipe = {
        "@type": "Recipe",
        name: "Test Recipe",
        description: "A test recipe",
        recipeIngredient: ["1 cup flour", "2 eggs"],
        recipeInstructions: [{ "@type": "HowToStep", text: "Mix ingredients" }],
        recipeCategory: ["Dessert"],
        recipeCuisine: ["American"],
        keywords: "easy, quick",
        prepTime: "PT15M",
        cookTime: "PT30M",
        recipeYield: "4",
        nutrition: {
          calories: "400 calories",
          proteinContent: "10g",
          carbohydrateContent: "50g",
          fatContent: "20g",
        },
      };

      const mockHtml = `
<html>
  <script type="application/ld+json">
    ${JSON.stringify(mockRecipe)}
  </script>
</html>`;

      // Set up fetch mocks
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXml),
        })
        .mockResolvedValue({
          ok: true,
          text: () => Promise.resolve(mockHtml),
        });

      await seedRecipes(mockConfig);

      // Verify database operations
      expect(mockFetch).toHaveBeenCalledTimes(3); // Once for sitemap, twice for recipes
      expect(mockDelete).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalledTimes(2);
    });

    test("handles recipe scraping errors", async () => {
      // Mock sitemap response
      const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/recipes/1</loc>
  </url>
</urlset>`;

      // Mock fetch responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXml),
        })
        .mockResolvedValueOnce({
          ok: false,
          statusText: "Not Found",
        });

      await seedRecipes(mockConfig);

      // Verify that the script continues despite errors
      expect(mockFetch).toHaveBeenCalledTimes(2); // Once for sitemap, once for recipe
      expect(mockDelete).toHaveBeenCalled(); // Database should still be cleared
      expect(mockInsert).not.toHaveBeenCalled(); // No recipes should be inserted
    });

    test("respects concurrency limit", async () => {
      // Mock sitemap response with many URLs
      const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${Array.from(
    { length: 5 },
    (_, i) => `
  <url>
    <loc>https://example.com/recipes/${i + 1}</loc>
  </url>`
  ).join("")}
</urlset>`;

      // Create a promise to track concurrent requests
      let concurrentRequests = 0;
      let maxConcurrentRequests = 0;

      // Mock fetch responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXml),
        })
        .mockImplementation(async () => {
          concurrentRequests++;
          maxConcurrentRequests = Math.max(maxConcurrentRequests, concurrentRequests);

          // Simulate some async work
          await new Promise((resolve) => setTimeout(resolve, 10));

          concurrentRequests--;

          return Promise.resolve({
            ok: true,
            text: () =>
              Promise.resolve(`
<html>
  <script type="application/ld+json">
    {"@type": "Recipe", "name": "Test Recipe"}
  </script>
</html>`),
          });
        });

      const config = { ...mockConfig, concurrency: 2, batchSize: 5 };
      await seedRecipes(config);

      // Verify that the maximum number of concurrent requests never exceeded the limit
      expect(maxConcurrentRequests).toBeLessThanOrEqual(config.concurrency);
      expect(mockInsert).toHaveBeenCalledTimes(5); // All recipes should be processed
    });
  });
});
