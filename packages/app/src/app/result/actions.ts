"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validatedCallback } from "@/lib/validatedCallback";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const snippetVoteSchema = z.object({
  snippetId: z.string(),
});

const SNIPPET_RATING_THRESHOLD = -1;

export const upvoteSnippetAction = validatedCallback({
  inputValidation: snippetVoteSchema,
  callback: async ({ snippetId }) => {
    const user = await getCurrentUser();

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

    if (previousVote?.type === "UP") {
      throw new Error("You already upvoted this snippet.");
    }

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
});

export const downVoteSnippetAction = validatedCallback({
  inputValidation: snippetVoteSchema,
  callback: async ({ snippetId }) => {
    const user = await getCurrentUser();

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

    if (previousVote?.type === "DOWN") {
      throw new Error("You already downvoted this snippet.");
    }

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
});

export const deleteVoteAction = validatedCallback({
  inputValidation: snippetVoteSchema,
  callback: async ({ snippetId }) => {
    const user = await getCurrentUser();

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

      if (previousVote.type === "DOWN") {
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
});

export const getTopTen = validatedCallback({
  outputValidation: z
    .object({
      id: z.string(),
      accuracy: z.number(),
      cpm: z.number(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        averageAccuracy: z.number(),
        averageCpm: z.number(),
        image: z.string(),
      }),
    })
    .array(),
  inputValidation: z.string().optional(),
  callback: async (snippet) => {
    const results = await prisma.result.findMany({
      where: {
        snippetId: snippet,
      },
      distinct: ["userId"],
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            averageAccuracy: true,
            averageCpm: true,
            image: true,
          },
        },
      },
    });
    console.log(results[0]);
    return results;
  },
});
