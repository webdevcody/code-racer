"use server";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/actions";
import { z } from "zod";
import { downVoteSnippetAction } from "@/app/_actions/snippet";

export async function getRandomSnippet(input: {
  language: string;
  reportedSnippets?: string[];
}) {
  if (input.reportedSnippets) {
    await downVoteSnippetAction({ snippetId: input.reportedSnippets[0] });
  }

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
        },
      },
    },
    take: 1,
    skip,
  });

  return snippet;
}
