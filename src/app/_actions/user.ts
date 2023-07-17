"use server";

import { Prisma } from "@prisma/client";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { z } from "zod";
import { action } from "@/lib/actions";

export const saveUserResultAction = action(
  z.object({
    timeTaken: z.union([z.string(), z.number()]),
    errors: z.number().nullable(),
    cpm: z.number(),
    accuracy: z.number().min(0).max(1),
    snippetId: z.string(),
  }),

  async (input, { prisma, user }) => {
    if (!user) throw new UnauthorizedError();

    await prisma.result.create({
      data: {
        userId: user.id,
        takenTime: input.timeTaken.toString(),
        errorCount: input.errors,
        cpm: input.cpm,
        accuracy: new Prisma.Decimal(input.accuracy),
        snippetId: input.snippetId,
      },
    });
  },
);

export const updateUserAction = action(
  z.object({ name: z.string() }),
  async (input, { user, prisma }) => {
    if (!user) throw new UnauthorizedError();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: input.name,
      },
    });
  },
);

export const deleteUserAction = action(
  z.object({}),
  async (_, { user, prisma }) => {
    if (!user) throw new UnauthorizedError();

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  },
);
