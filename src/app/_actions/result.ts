"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { action } from "@/lib/actions";

// when snippets rating hits this number
// it will no longer be on the race
// and will be reviewed by admin on the review page

const snippetVoteSchema = z.object({
  snippetId: z.string(),
});

const SNIPPET_RATING_THRESHOLD = -10;

export const upvoteSnippetAction = action(
  snippetVoteSchema,
  async ({ snippetId }, { prisma, user }) => {
    if (!user) throw new Error("You must be logged in to vote.");

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
      },
    });

    if (!snippet) throw new Error("Snippet not found.");

    if (snippet.onReview) throw new Error("Snippet is already on review.");

    const previousVote = await prisma.snippetVote.findUnique({
      where: {
        userId_snippetId: {
          userId: user.id,
          snippetId,
        },
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.snippetVote.upsert({
        where: {
          userId_snippetId: {
            userId: user.id,
            snippetId,
          },
        },
        update: {
          type: "UP",
        },
        create: {
          userId: user.id,
          snippetId,
          type: "UP",
        },
      });

      await tx.snippet.update({
        where: {
          id: snippetId,
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
  },
);

export const downVoteSnippetAction = action(
  snippetVoteSchema,
  async ({ snippetId }, { prisma, user }) => {
    if (!user) throw new Error("You must be logged in to vote.");

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
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
          userId: user.id,
          snippetId,
        },
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.snippetVote.upsert({
        where: {
          userId_snippetId: {
            userId: user.id,
            snippetId,
          },
        },
        update: {
          type: "DOWN",
        },
        create: {
          userId: user.id,
          snippetId,
          type: "DOWN",
        },
      });

      const updatedSnippet = await tx.snippet.update({
        where: {
          id: snippetId,
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
            id: snippetId,
          },
          data: {
            onReview: true,
          },
        });
      }
    });

    revalidatePath("/result");
  },
);

export const deleteVoteAction = action(
  snippetVoteSchema,
  async ({ snippetId }, { prisma, user }) => {
    if (!user) throw new Error("You must be logged in to vote.");

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
      },
    });

    if (!snippet) {
      throw new Error("Snippet doesnt exist.");
    }

    const previousVote = await prisma.snippetVote.findUnique({
      where: {
        userId_snippetId: {
          userId: user.id,
          snippetId,
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
            userId: user.id,
            snippetId,
          },
        },
      });

      if (previousVote!.type === "DOWN") {
        await tx.snippet.update({
          where: {
            id: snippetId,
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
            id: snippetId,
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
  },
);
