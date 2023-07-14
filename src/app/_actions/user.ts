"use server";

import { User, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  UnauthorizedError,
  ValidationError,
} from "@/lib/exceptions/custom-hooks";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";
import { zact } from "zact/server";

export const saveUserResultAction = zact(
  z.object({
    userId: z.string(),
    timeTaken: z.union([z.string(), z.number()]),
    errors: z.number().nullable(),
    cpm: z.number(),
    accuracy: z.number().min(0).max(1),
    snippetId: z.string(),
  }),
)(async (input) => {
  await prisma.result.create({
    data: {
      userId: input.userId,
      takenTime: input.timeTaken.toString(),
      errorCount: input.errors,
      cpm: input.cpm,
      accuracy: new Prisma.Decimal(input.accuracy),
      snippetId: input.snippetId,
    },
  });
});

export const updateUserAction = zact(z.object({ name: z.string() }))(async (
  input,
) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      name: input.name,
    },
  });
});

export async function deleteUserAction() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
}
