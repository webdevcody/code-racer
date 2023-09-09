"use server";
//please don't alias these paths, it will break wss
import { type Language } from "../../../config/languages";
import { prisma } from "../../../lib/prisma";
import type { Snippet } from "@prisma/client";

/** TODO:
 *  ---
 *  If we are generating a new random snippet,
 * for example, from a practice race page, we
 *  need to not include the id of the currently
 *  displayed snippet to get a new one.
 */
export async function getRandomSnippet(input: {
  language: Language;
  reportedSnippets?: string[];
}): Promise<Snippet> {
  const itemCount = await prisma.snippet.count({
    where: {
      onReview: false,
      language: input.language,
      NOT: {
        id: {
          in: input.reportedSnippets ?? [],
        },
      },
    },
  });
  const skip =
    itemCount === 1 ? 0 : Math.max(0, Math.floor(Math.random() * itemCount));

  const [snippet] = await prisma.snippet.findMany({
    where: {
      onReview: false,
      language: input.language,
      NOT: {
        id: {
          in: input.reportedSnippets ?? [],
        }
      },
    },
    take: 1,
    skip,
  });

  return snippet;
}

export async function getSnippetById(
  snippetId: string
): Promise<Snippet | null> {
  return await prisma.snippet.findUnique({
    where: {
      id: snippetId,
    },
  });
}
