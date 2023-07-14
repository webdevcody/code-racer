"use server";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { Snippet } from "@prisma/client";

async function hasUserCreatedSnippet(userId: string): Promise<boolean> {
  const existingSnippets = await prisma.snippet.findMany({
    where: {
      userId,
    },
  });

  return existingSnippets.length > 1;
}

async function upsertAchievement(achievementId: string): Promise<void> {
  await prisma.achievement.upsert({
    where: { id: achievementId },
    create: {
      id: achievementId,
      name: "Uploaded First Snippet",
      image:"/placeholder-image.jpg"
    },
    update: {},
  });
}

async function createUserAchievement(userId: string, achievementId: string): Promise<void> {
  await prisma.userAchievement.create({
    data: {
      userId,
      achievementId,
    },
  });
}

async function userFirstSnipperAchievement(userId: string, achievementId: string): Promise<boolean> {
  const hasAchievement = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId: userId,
        achievementId: achievementId
      },
    },
  });
  return !!hasAchievement?.userId;
}

export async function addSnippetAction({
  code,
  language,
}: Pick<Snippet, "code" | "language">) {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  // Create a new snippet
  // why am i getting errors here with where?
  await prisma.snippet.create({
    data: {
      userId: user.id,
      code,
      language,
    },
  });

  const achievementId = "first-snippet-created";
  const hasMultipleSnippet = await hasUserCreatedSnippet(user.id);

  const hasFirstSnippetAchievement = await userFirstSnipperAchievement(user.id, achievementId);

  if(!hasMultipleSnippet && !hasFirstSnippetAchievement) {
    await upsertAchievement(achievementId);
    await createUserAchievement(user.id, achievementId);
    return {message: "snippet-created-and-achievement-unlocked",  status: 200 }
  }
  return {message: "snippet-created",  status: 200 }

}