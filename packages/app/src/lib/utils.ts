import z from "zod";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { toast } from "@/components/ui/use-toast";

export function raise(message: string): never {
  throw new Error(message);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return toast({
      title: "Error",
      description: errors.join("\n"),
      variant: "destructive",
    });
  } else if (err instanceof Error) {
    return toast({
      title: "Error",
      description: err.message,
      variant: "destructive",
    });
  } else {
    return toast({
      title: "Error",
      description: "Something went wrong, please try again later.",
      variant: "destructive",
    });
  }
}

export const isActiveRoute = (
  currentRouteHref: string,
  providedRouteHref: string
) => currentRouteHref.startsWith(providedRouteHref);

export function camelCaseToCapitalized(str: string) {
  // Check if the string has any white spaces
  if (/\s/.test(str)) {
    return str;
  }

  // Insert space before each capital letter using a regular expression
  const capitalizedStr = str.replace(/([A-Z])/g, " $1");
  return capitalizedStr.charAt(0).toUpperCase() + capitalizedStr.slice(1);
}

export function isValidUUID(value: string) {
  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(value);
}

export const searchForLineBreak = (string: string) => {
  let amountOfLineBreaks = 0;
  for (let idx = 0; idx < string.length; ++idx) {
    if (string[idx] === "\n") {
      amountOfLineBreaks += 1;
    }
  }

  return amountOfLineBreaks;
};
