"use server";

import { z } from "zod";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { validatedCallback } from "@/lib/validatedCallback";

/** If no userId is provided, this will get the current
 *  logged in user's achievements.
 */
export const findUserAchievements = validatedCallback({
  inputValidation: z.object({ userId: z.string().optional() }),
  outputValidation: z
    .object({
      userId: z.string(),
      achievementType: z.string(),
      unlockedAt: z.date(),
    })
    .array(),
  callback: async (input) => {
    const user = await getCurrentUser();

    if (!user && !input.userId) throw new UnauthorizedError();

    const achievements = await prisma.achievement.findMany({
      where: {
        userId: input.userId ? input.userId : user?.id,
      },
    });

    return achievements;
  },
});

export const findUser = validatedCallback({
  inputValidation: z.object({ userId: z.string().optional() }),
  callback: async (params) => {
    const user = await getCurrentUser();

    const foundUser = await prisma.user.findUnique({
      where: {
        id: params.userId ? params.userId : user?.id,
      },
      select: {
        image: true,
        bio: true,
        name: true,
        id: true,
        email: true, // this is needed to look up contributions
      },
    });

    return foundUser;
  },
});
