import type { RecipeInstruction } from "../types";

export function getVideoFromInstruction(
  instruction: RecipeInstruction
): { url: string; duration: string; thumbnailUrl: string } | null {
  if (typeof instruction === "object" && "video" in instruction && instruction.video) {
    const video = instruction.video;
    if (typeof video === "object" && "contentUrl" in video && "duration" in video && "thumbnailUrl" in video) {
      const contentUrl = video.contentUrl;
      const duration = video.duration;
      const thumbnailUrl = video.thumbnailUrl;

      if (
        typeof contentUrl === "string" &&
        typeof duration === "string" &&
        (typeof thumbnailUrl === "string" || Array.isArray(thumbnailUrl))
      ) {
        return {
          url: contentUrl,
          duration,
          thumbnailUrl: Array.isArray(thumbnailUrl) ? thumbnailUrl[0] : thumbnailUrl,
        };
      }
    }
  }
  return null;
}
