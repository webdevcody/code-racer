"use server";

import { action } from "@/lib/actions";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
