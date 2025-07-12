import { TRPCError } from "@trpc/server";
import z from "zod";

export function handleServiceError(error: unknown, defaultMessage: string) {
  console.error(defaultMessage, error);
  if (error instanceof z.ZodError) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid input data",
      cause: error,
    });
  }

  if (error instanceof TRPCError) {
    throw error;
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: defaultMessage,
  });
}
