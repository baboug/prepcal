import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import pLimit from "p-limit";
import postgres from "postgres";
import { z } from "zod";

import { recipe } from "@/lib/db/schema";
import { scrapeRecipe } from "../utils/recipe-scraper";
import { parseSitemap } from "./utils/sitemap-parser";

const configSchema = z.object({
  sitemapUrl: z.string().url(),
  concurrency: z.number().min(1).max(10).default(5),
  batchSize: z.number().min(1).default(100),
  clearDatabase: z.boolean().default(false),
  databaseUrl: z.string(),
});

type Config = z.infer<typeof configSchema>;

async function processBatch(db: ReturnType<typeof drizzle>, urls: string[], limit: ReturnType<typeof pLimit>) {
  const results = await Promise.all(
    urls.map((url) =>
      limit(async () => {
        try {
          const recipeData = await scrapeRecipe(url);
          if (recipeData) {
            await db.insert(recipe).values(recipeData);
            console.log(`Successfully inserted recipe from ${url}`);
            return true;
          }
          console.log(`No recipe data found at ${url}`);
          return false;
        } catch (error) {
          console.error(`Failed to process recipe from ${url}:`, error);
          return false;
        }
      })
    )
  );

  const successCount = results.filter(Boolean).length;
  console.log(`Batch complete: ${successCount}/${urls.length} recipes processed successfully`);
}

export async function seedRecipes(config: Config) {
  const validatedConfig = configSchema.parse(config);

  const client = postgres(validatedConfig.databaseUrl);
  const db = drizzle(client);

  try {
    if (validatedConfig.clearDatabase) {
      console.log("Clearing existing recipes...");
      await db.delete(recipe);
    }

    console.log("Fetching sitemap...");
    let urls: string[] = [];
    try {
      urls = await parseSitemap(validatedConfig.sitemapUrl);
      console.log(`Found ${urls.length} recipe URLs`);
    } catch (error) {
      console.error("Failed to parse sitemap:", error);
      await client.end();
      return;
    }

    const limit = pLimit(validatedConfig.concurrency);

    const promises: Promise<void>[] = [];
    for (let i = 0; i < urls.length; i += validatedConfig.batchSize) {
      const batch = urls.slice(i, i + validatedConfig.batchSize);
      console.log(`Processing batch ${i / validatedConfig.batchSize + 1}...`);
      promises.push(processBatch(db, batch, limit));
    }
    await Promise.all(promises);

    console.log("Seeding complete!");
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  if (!(process.env.SITEMAP_URL && process.env.DATABASE_URL)) {
    console.error("Missing required environment variables: SITEMAP_URL, DATABASE_URL");
    process.exit(1);
  }

  const config = {
    sitemapUrl: process.env.SITEMAP_URL,
    databaseUrl: process.env.DATABASE_URL,
    concurrency: process.env.SCRAPE_CONCURRENCY ? Number(process.env.SCRAPE_CONCURRENCY) : undefined,
    batchSize: process.env.BATCH_SIZE ? Number(process.env.BATCH_SIZE) : undefined,
    clearDatabase: process.env.CLEAR_DATABASE === "true",
  };

  try {
    const validatedConfig = configSchema.parse(config);
    seedRecipes(validatedConfig).catch((error) => {
      console.error("Failed to seed recipes:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Invalid configuration:", error);
    process.exit(1);
  }
}
