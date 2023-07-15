"use server";

import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { zact } from "zact/server";
import { snippetSchema } from "@/lib/validations/snippet";

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
