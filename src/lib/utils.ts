import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Session } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserFirstName(user: Session["user"]) {
  return user.name?.split(" ")[0] || "";
}

const WHITESPACE = /\s+/;

export function capitalizeWords(text: string): string {
  if (!text?.trim()) {
    return text;
  }
  return text
    .split(WHITESPACE)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
