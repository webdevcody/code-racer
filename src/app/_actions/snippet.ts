"use server";

import { action } from "@/lib/actions";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { snippetSchema } from "@/lib/validations/snippet";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
  }),
  async ({ id }, { prisma, user }) => {
    if (user?.role !== "ADMIN") {
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

    revalidatePath("/review");
  },
);
