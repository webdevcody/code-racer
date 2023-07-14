"use server";

import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { Snippet } from "@prisma/client";
import { z } from "zod";
import { zact } from "zact/server";
import { snippetSchema } from "@/lib/validations/snippet";

export const hasUserCreatedSnippet = zact(z.object({ userId: z.string() }))(
  async (input) => {
    const existingSnippets = await prisma.snippet.findMany({
      where: {
        userId: input.userId,
      },
    });

    return existingSnippets.length > 1;
  },
);

export const upsertAchievement = zact(z.object({ achievementId: z.string() }))(
  async (input) => {
    await prisma.achievement.upsert({
      where: { id: input.achievementId },
      create: {
        id: input.achievementId,
        name: "Uploaded First Snippet",
        image: "/placeholder-image.jpg",
      },
      update: {},
    });
  },
);

export const createUserAchievement = zact(
  z.object({
    userId: z.string(),
    achievementId: z.string(),
  }),
)(async (input) => {
  await prisma.userAchievement.create({
    data: {
      ...input,
    },
  });
});

export const userFirstSnipperAchievement = zact(
  z.object({
    userId: z.string(),
    achievementId: z.string(),
  }),
)(async (input) => {
  const hasAchievement = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        ...input,
      },
    },
  });
  return !!hasAchievement?.userId;
});

export const addSnippetAction = zact(snippetSchema)(async (input) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  // why am i getting errors here with where?
  await prisma.snippet
    .create({
      data: {
        userId: user?.id,
        ...input,
      },
    })
    .catch((e) => {
      console.log(e);
      return new Error("Error creating snippet");
    });

  const achievementId = "first-snippet-created";
  const hasMultipleSnippet = await hasUserCreatedSnippet({ userId: user.id });

  const hasFirstSnippetAchievement = await userFirstSnipperAchievement({
    userId: user.id,
    achievementId,
  });

  if (!hasMultipleSnippet && !hasFirstSnippetAchievement) {
    await upsertAchievement({ achievementId });
    await createUserAchievement({ userId: user.id, achievementId });
    return {
      message: "snippet-created-and-achievement-unlocked",
      status: 200,
    };
  }
  return { message: "snippet-created", status: 200 };
});
