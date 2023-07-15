"use server";

import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { zact } from "zact/server";
import { snippetSchema } from "@/lib/validations/snippet";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// when snippets rating hits this number
// it will no longer be on the race
// and will be reviewed by admin on the review page

const SNIPPET_RATING_THRESHOLD = -10;

const snippetVoteSchema = z.object({
  snippetId: z.string(),
  userId: z.string(),
});

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

export const addSnippetAction = zact(snippetSchema)(async (input) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  await prisma.snippet.create({
    data: {
      userId: user?.id,
      ...input,
    },
  });

  const firstSnippetAchievement = await prisma.userAchievement.findFirst({
    where: {
      achievementType: "FIRST_SNIPPET",
      userId: user.id,
    },
  });

  if (!firstSnippetAchievement) {
    await prisma.userAchievement.create({
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
});
