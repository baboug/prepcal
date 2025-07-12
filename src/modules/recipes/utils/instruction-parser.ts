import type { ParsedInstruction, RecipeInstruction } from "../types";
import { cleanText } from "./text-processing";
import { getVideoFromInstruction } from "./video-processing";

function getVideoUrl(instruction: RecipeInstruction): string | undefined {
  const video = getVideoFromInstruction(instruction);
  return video?.url;
}

function parseInstructionStep(instruction: string | RecipeInstruction): ParsedInstruction[] {
  if (typeof instruction === "string") {
    return [{ step: cleanText(instruction) }];
  }

  if (
    typeof instruction === "object" &&
    instruction !== null &&
    "text" in instruction &&
    typeof instruction.text === "string"
  ) {
    return [
      {
        step: cleanText(instruction.text),
        video: getVideoUrl(instruction),
      },
    ];
  }

  if ("itemListElement" in instruction && Array.isArray(instruction.itemListElement)) {
    return instruction.itemListElement.map((step) => ({
      step: cleanText(step.text ?? step.name ?? ""),
      video: getVideoUrl(step),
    }));
  }

  return [];
}

export function parseInstructions(instructions: unknown): ParsedInstruction[] {
  if (!Array.isArray(instructions)) {
    return [];
  }

  return instructions.flatMap(parseInstructionStep);
}
