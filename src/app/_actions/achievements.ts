"use server";

import { z } from "zod";
import { action } from "@/lib/actions";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";

/** If no userId is provided, this will get the current
 *  logged in user's achievements.
 */
export const findUserAchievements = action(
  z.object({ userId: z.string().optional() }),
  async (params, { prisma, user }) => {
    if (!user && !params.userId) throw new UnauthorizedError();

    const achievements = await prisma.achievement.findMany({
      where: {
        userId: params.userId ? params.userId : user?.id,
      },
    });
    return achievements;
  },
);
