import type { JsonLdRecipe } from "../types";

const DIMENSIONS_REGEX = /\d/;

export function getBestImage(image: JsonLdRecipe["image"]): string | null {
  if (!image) {
    return null;
  }

  // Handle string case
  if (typeof image === "string") {
    return image;
  }

  // Handle array case
  if (Array.isArray(image)) {
    // If it's an array of strings
    if (typeof image[0] === "string") {
      // Try to find a URL without dimensions first
      const withoutDimensions = image.find(
        (url): url is string => typeof url === "string" && !DIMENSIONS_REGEX.test(url)
      );
      if (withoutDimensions) {
        return withoutDimensions;
      }

      // If all URLs have numbers, find the shortest one (likely has fewer dimensions)
      const validUrls = image.filter((url): url is string => typeof url === "string");
      if (validUrls.length > 0) {
        return validUrls.reduce((shortest, current) => (current.length < shortest.length ? current : shortest));
      }
    }

    // If it's an array of objects with URLs
    const imageObjects = image.filter(
      (img): img is { url?: string; contentUrl?: string } =>
        typeof img === "object" && img !== null && ("url" in img || "contentUrl" in img)
    );

    // Try to find a URL without dimensions first
    for (const img of imageObjects) {
      const url = img.url || img.contentUrl;
      if (typeof url === "string" && !DIMENSIONS_REGEX.test(url)) {
        return url;
      }
    }

    // If all URLs have numbers, find the shortest one
    const validUrls = imageObjects
      .map((img) => img.url || img.contentUrl)
      .filter((url): url is string => typeof url === "string");

    if (validUrls.length > 0) {
      return validUrls.reduce((shortest, current) => (current.length < shortest.length ? current : shortest));
    }
  }

  // Handle single object case
  if (typeof image === "object" && image !== null && ("url" in image || "contentUrl" in image)) {
    const imgObj = image as { url?: string; contentUrl?: string };
    const url = imgObj.url || imgObj.contentUrl;
    return typeof url === "string" ? url : null;
  }

  return null;
}
