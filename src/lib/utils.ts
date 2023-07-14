import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";

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
    toast({
      title: "Something went wrong.",
      description: errors.join("\n"),
      variant: "destructive",
    });
  } else if (err instanceof Error) {
    toast({
      title: "Something went wrong.",
      description: err.message,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Something went wrong, please try again later.",
      variant: "destructive",
    });
  }
}
