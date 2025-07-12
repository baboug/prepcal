import type { RecipeInstruction } from "../types";

export function getVideoFromInstruction(
  instruction: RecipeInstruction
): { url: string; duration: string; thumbnailUrl: string } | null {
  if (typeof instruction !== "object" || !instruction || !("video" in instruction) || !instruction.video) {
    return null;
  }

  const video = instruction.video;

  if (typeof video !== "object" || !("contentUrl" in video) || !("duration" in video) || !("thumbnailUrl" in video)) {
    return null;
  }

  const { contentUrl, duration, thumbnailUrl } = video;

  if (
    typeof contentUrl !== "string" ||
    typeof duration !== "string" ||
    (typeof thumbnailUrl !== "string" && !Array.isArray(thumbnailUrl))
  ) {
    return null;
  }

  return {
    url: contentUrl,
    duration,
    thumbnailUrl: Array.isArray(thumbnailUrl) ? thumbnailUrl[0] : thumbnailUrl,
  };
}
