import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";

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
  providedRouteHref: string,
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
