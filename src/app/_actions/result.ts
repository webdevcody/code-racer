"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { action } from "@/lib/actions";
import { Prisma } from "@prisma/client";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";

// when snippets rating hits this number
// it will no longer be on the race
// and will be reviewed by admin on the review page

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

    prisma.$transaction(async (tx) => {
      await tx.result.create({
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
    });
  },
);

export const findUsersVotes = action(
  z.object({
    snippetId: z.string(),
    userId: z.string(),
  }),
  async ({ snippetId, userId }) => {
    const votes = await prisma.snippetVote.findUnique({
      where: {
        userId_snippetId: {
          userId,
          snippetId,
        },
      },
    });
    return votes;
  },
);

export const findUsersVotes = action(
  z.object({
    snippetId: z.string(),
    userId: z.string(),
  }),
  async ({ snippetId, userId }) => {
    const votes = await prisma.snippetVote.findUnique({
      where: {
        userId_snippetId: {
          userId,
          snippetId,
        },
      },
    });
    return votes;
  },
);
