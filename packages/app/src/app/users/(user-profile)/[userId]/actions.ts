"use server";

import { z } from "zod";
import { safeAction } from "@/lib/actions";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/** If no userId is provided, this will get the current
 *  logged in user's achievements.
 */
export const findUserAchievements = safeAction(
  z.object({ userId: z.string().optional() }),
)(async (input) => {
  const user = await getCurrentUser();

  if (!user && !input.userId) throw new UnauthorizedError();

  const achievements = await prisma.achievement.findMany({
    where: {
      userId: input.userId ? input.userId : user?.id,
    },
  });
  return achievements;
});

export const findUser = safeAction(z.object({ userId: z.string().optional() }))(
  async (params) => {
    const user = await getCurrentUser();

    const foundUser = await prisma.user.findUnique({
      where: {
        id: params.userId ? params.userId : user?.id,
      },
    });

    return foundUser;
  },
);
