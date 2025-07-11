import { XMLParser } from "fast-xml-parser";
import { z } from "zod";

const sitemapSchema = z.object({
  urlset: z.object({
    url: z
      .array(
        z.object({
          loc: z.string().url(),
          lastmod: z.string().optional(),
          changefreq: z.string().optional(),
          priority: z.string().optional(),
        })
      )
      .or(
        z.object({
          loc: z.string().url(),
          lastmod: z.string().optional(),
          changefreq: z.string().optional(),
          priority: z.string().optional(),
        })
      ),
  }),
});

export async function parseSitemap(url: string): Promise<string[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      removeNSPrefix: true,
      parseTagValue: true,
      trimValues: true,
    });

    const parsed = parser.parse(xml);
    const result = sitemapSchema.safeParse(parsed);

    if (!result.success) {
      throw new Error("Invalid sitemap format");
    }

    // Handle both array and single object cases
    const urls = Array.isArray(result.data.urlset.url) ? result.data.urlset.url : [result.data.urlset.url];

    return urls.map((entry) => entry.loc);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse sitemap: ${error.message}`);
    }
    throw new Error("Failed to parse sitemap");
  }
}
