"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zact } from "zact/server";

// when snippets rating hits this number
// it will no longer be on the race
// and will be reviewed by admin on the review page

const snippetVoteSchema = z.object({
  snippetId: z.string(),
  userId: z.string(),
});

const SNIPPET_RATING_THRESHOLD = -10;

export const upvoteSnippetAction = zact(snippetVoteSchema)(async (input) => {
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

  const previousVote = await prisma.snippetVote.findUnique({
    where: {
      userId_snippetId: {
        userId: input.userId,
        snippetId: input.snippetId,
      },
    },
  });

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
          // if user downvoted before, decrement by 2
          increment: 1 + Number(!!previousVote),
        },
      },
    });
  });

  revalidatePath("/result");
});

export const downvoteSnippetAction = zact(snippetVoteSchema)(async (input) => {
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

  const previousVote = await prisma.snippetVote.findUnique({
    where: {
      userId_snippetId: {
        userId: input.userId,
        snippetId: input.snippetId,
      },
    },
  });

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
          // if user upvoted before, decrement by 2
          decrement: 1 + Number(!!previousVote),
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
});

export const deleteVoteAction = zact(snippetVoteSchema)(async (input) => {
  const snippet = await prisma.snippet.findUnique({
    where: {
      id: input.snippetId,
    },
  });

  if (!snippet) {
    throw new Error("Snippet doesnt exist.");
  }

  const previousVote = await prisma.snippetVote.findUnique({
    where: {
      userId_snippetId: {
        userId: input.userId,
        snippetId: input.snippetId,
      },
    },
  });

  if (!previousVote) {
    throw new Error("Something went wrong...");
  }

  await prisma.$transaction(async (tx) => {
    await tx.snippetVote.delete({
      where: {
        userId_snippetId: {
          userId: input.userId,
          snippetId: input.snippetId,
        },
      },
    });

    if (previousVote!.type === "DOWN") {
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
    } else {
      await tx.snippet.update({
        where: {
          id: input.snippetId,
        },
        data: {
          rating: {
            decrement: 1,
          },
        },
      });
    }
  });

  revalidatePath("/result");
});
