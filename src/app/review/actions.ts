"use server";

import { safeAction } from "@/lib/actions";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const acquitSnippetAction = safeAction(
  z.object({
    id: z.string(),
  }),
)(async ({ id }) => {
  const user = await getCurrentUser();

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
});

export const deleteSnippetAction = safeAction(
  z.object({
    id: z.string(),
    path: z.string(),
  }),
)(async ({ id, path }) => {
  const user = await getCurrentUser();

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
});
