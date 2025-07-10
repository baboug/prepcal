import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Session } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserFirstName(user: Session["user"]) {
  return user.name?.split(" ")[0] || "";
}
