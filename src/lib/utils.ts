import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** To avoid repeatedly writing "console.error()". */
export function throwError(error: Error) {
  console.error(error);
  throw error;
}
