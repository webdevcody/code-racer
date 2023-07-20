"use server";

import { z } from "zod";
import { action } from "@/lib/actions";
import { Prisma } from "@prisma/client";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";

export const saveUserResultAction = action(
  z.object({
    timeTaken: z.union([z.string(), z.number()]),
    errors: z.number().nullable(),
    cpm: z.number(),
    accuracy: z.number().min(0).max(100),
    snippetId: z.string(),
  }),

  async (input, { prisma, user }) => {
    if (!user) throw new UnauthorizedError();

    return await prisma.$transaction(async (tx) => {
      const result = await tx.result.create({
        data: {
          userId: user.id,
          takenTime: input.timeTaken.toString(),
          errorCount: input.errors,
          cpm: input.cpm,
          accuracy: new Prisma.Decimal(input.accuracy),
          snippetId: input.snippetId,
        },
      });

      const avgValues = await tx.result.aggregate({
        where: {
          userId: user.id,
        },
        _avg: {
          accuracy: true,
          cpm: true,
        },
      });

      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          averageAccuracy: avgValues._avg.accuracy ?? 0,
          averageCpm: avgValues._avg.cpm ?? 0,
        },
      });

      return result;
    });
  },
);

/**
 * This should create a private room for the user
 * Not implemented. Need to decide on the multiplayer architecture
 **/
export const createPrivateRaceRoom = action(z.object({}), async () => {
  throw new Error("Not implemented");
});
