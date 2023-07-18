import { z } from "zod";
import { snippetLanguages } from "@/config/languages";

export const snippetSchema = z.object({
  language: z.enum(
    snippetLanguages.map((lang) => lang.value) as [string, ...string[]],
  ),
  code: z
    .string()
    .max(511, {
      message: "Code must be less than 511 symbols long.",
    })
    .refine((value) => value.replace(/[\n\t\s]/g, "").length >= 30, {
      message:
        "Code must have a minimum length of 30 characters (excluding spaces and tabs)",
      path: ["code"],
    }),
  onReview: z.boolean().optional(),
});
