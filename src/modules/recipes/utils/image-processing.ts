import type { JsonLdRecipe } from "../types";

const DIMENSIONS_REGEX = /\b\d{2,4}x\d{2,4}\b|[_-]\d{2,4}[_-]/;

function handleStringImage(image: string): string {
  return image;
}

function findUrlWithoutDimensions(urls: string[]): string | null {
  return (
    urls.find((url) => {
      return typeof url === "string" && !DIMENSIONS_REGEX.test(url);
    }) || null
  );
}

function findShortestUrl(urls: string[]): string | null {
  const validUrls = urls.filter((url): url is string => {
    return typeof url === "string";
  });
  if (validUrls.length === 0) {
    return null;
  }

  return validUrls.reduce((shortest, current) => {
    return current.length < shortest.length ? current : shortest;
  });
}

function handleArrayOfStrings(imageArray: string[]): string | null {
  // Try to find a URL without dimensions first
  const withoutDimensions = findUrlWithoutDimensions(imageArray);
  if (withoutDimensions) {
    return withoutDimensions;
  }

  // If all URLs have numbers, find the shortest one
  return findShortestUrl(imageArray);
}

function extractUrlsFromObjects(imageObjects: Array<{ url?: string; contentUrl?: string }>): string[] {
  return imageObjects
    .map((img) => {
      return img.url || img.contentUrl;
    })
    .filter((url): url is string => {
      return typeof url === "string";
    });
}

function handleArrayOfObjects(imageArray: unknown[]): string | null {
  const imageObjects = imageArray.filter((img): img is { url?: string; contentUrl?: string } => {
    return typeof img === "object" && img !== null && ("url" in img || "contentUrl" in img);
  });

  // Try to find a URL without dimensions first
  for (const img of imageObjects) {
    const url = img.url || img.contentUrl;
    if (typeof url === "string" && !DIMENSIONS_REGEX.test(url)) {
      return url;
    }
  }

  // If all URLs have numbers, find the shortest one
  const validUrls = extractUrlsFromObjects(imageObjects);
  return findShortestUrl(validUrls);
}

function handleArrayImage(imageArray: unknown[]): string | null {
  // If it's an array of strings
  if (typeof imageArray[0] === "string") {
    return handleArrayOfStrings(imageArray as string[]);
  }

  // If it's an array of objects with URLs
  return handleArrayOfObjects(imageArray);
}

function handleObjectImage(imageObject: unknown): string | null {
  if (
    typeof imageObject === "object" &&
    imageObject !== null &&
    ("url" in imageObject || "contentUrl" in imageObject)
  ) {
    const imgObj = imageObject as { url?: string; contentUrl?: string };
    const url = imgObj.url || imgObj.contentUrl;
    return typeof url === "string" ? url : null;
  }
  return null;
}

export function getBestImage(image: JsonLdRecipe["image"]): string | null {
  if (!image) {
    return null;
  }

  // Handle string case
  if (typeof image === "string") {
    return handleStringImage(image);
  }

  // Handle array case
  if (Array.isArray(image)) {
    return handleArrayImage(image);
  }

  // Handle single object case
  return handleObjectImage(image);
}
