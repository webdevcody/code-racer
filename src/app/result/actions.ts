"use server";

import { prisma } from "@/lib/prisma";
import type { Snippet } from "@prisma/client";
import type { User } from "next-auth";
import { revalidatePath } from "next/cache";

// when snippets rating hits this number
// it will no longer be on the race
// and will be reviewed by admin on the review page
const SNIPPET_RATING_THRESHOLD = -10;

export async function upvoteSnippetAction(input: {
  snippetId: Snippet["id"];
  userId: User["id"];
}) {
  const snippet = await prisma.snippet.findUnique({
    where: {
      id: input.snippetId,
    },
  });

  if (!snippet) {
    throw new Error("Snippet not found.");
  }

  if (snippet.onReview) {
    throw new Error("Snippet is already on review.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.snippetVote.upsert({
      where: {
        userId_snippetId: {
          userId: input.userId,
          snippetId: input.snippetId,
        },
      },
      update: {
        type: "UP",
      },
      create: {
        userId: input.userId,
        snippetId: input.snippetId,
        type: "UP",
      },
    });

    await tx.snippet.update({
      where: {
        id: input.snippetId,
      },
      data: {
        rating: {
          increment: 1,
        },
      },
    });
  });

  revalidatePath("/result");
}

export async function downvoteSnippetAction(input: {
  snippetId: Snippet["id"];
  userId: User["id"];
}) {
  const snippet = await prisma.snippet.findUnique({
    where: {
      id: input.snippetId,
    },
  });

  if (!snippet) {
    throw new Error("Snippet not found.");
  }

  if (snippet.onReview) {
    throw new Error("Snippet is already on review.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.snippetVote.upsert({
      where: {
        userId_snippetId: {
          userId: input.userId,
          snippetId: input.snippetId,
        },
      },
      update: {
        type: "DOWN",
      },
      create: {
        userId: input.userId,
        snippetId: input.snippetId,
        type: "DOWN",
      },
    });

    const updatedSnippet = await tx.snippet.update({
      where: {
        id: input.snippetId,
      },
      data: {
        rating: {
          decrement: 1,
        },
      },
    });

    if (updatedSnippet.rating === SNIPPET_RATING_THRESHOLD) {
      await tx.snippet.update({
        where: {
          id: input.snippetId,
        },
        data: {
          onReview: true,
        },
      });
    }
  });

  revalidatePath("/result");
}
