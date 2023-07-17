"use server";

import { action } from "@/lib/actions";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { snippetSchema } from "@/lib/validations/snippet";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export const addSnippetAction = action(
  snippetSchema,
  async (input, { prisma, user }) => {
    if (!user) {
      throw new UnauthorizedError();
    }

    await prisma.snippet.create({
      data: {
        userId: user?.id,
        ...input,
      },
    });

    const firstSnippetAchievement = await prisma.achievement.findFirst({
      where: {
        achievementType: "FIRST_SNIPPET",
        userId: user.id,
      },
    });

    if (!firstSnippetAchievement) {
      await prisma.achievement.create({
        data: {
          userId: user.id,
          achievementType: "FIRST_SNIPPET",
        },
      });
      return {
        message: "snippet-created-and-achievement-unlocked",
        status: 200,
      };
    }
    return { message: "snippet-created", status: 200 };
  },
);

export const acquitSnippetAction = action(
  z.object({
    id: z.string(),
  }),
  async ({ id }, { prisma, user }) => {
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError();
    }

    // TODO : Update the snippet
    // Would be good if users
    // will no longer be able
    // to down/upvote it

    await prisma.snippet.update({
      data: {
        rating: 0,
        onReview: false,
      },
      where: {
        id,
      },
    });

    revalidatePath("/review");
  },
);

export const deleteSnippetAction = action(
  z.object({
    id: z.string(),
    path: z.string(),
  }),
  async ({ id, path }, { prisma, user }) => {
    const snippet = await prisma.snippet.findUnique({
      where: {
        id,
      },
    });

    if (user?.role !== "ADMIN" && snippet?.userId !== user?.id) {
      throw new UnauthorizedError();
    }

    await prisma.snippet.delete({
      where: {
        id,
      },
    });

    // TODO:
    // create a counter for user's bad
    // snippets (that was deleted)

    revalidatePath(path);
  },
);
