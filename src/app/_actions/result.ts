"use server";
import { zact } from "zact/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const saveUserResultAction = zact(
  z.object({
    userId: z.string(),
    timeTaken: z.union([z.string(), z.number()]),
    errors: z.number().nullable(),
    cpm: z
      .number()
      .min(0)
      .max(9999, {
        message: "Cpm is too high. Please, turn off the python bot.",
      }),
    accuracy: z.number().min(0).max(100),
    snippetId: z.string(),
  }),
)(async (input) => {
  prisma.$transaction(async (tx) => {
    await tx.result.create({
      data: {
        userId: input.userId,
        takenTime: input.timeTaken.toString(),
        errorCount: input.errors,
        cpm: input.cpm,
        accuracy: new Prisma.Decimal(input.accuracy),
        snippetId: input.snippetId,
      },
    });

    const avgValues = await tx.result.aggregate({
      where: {
        userId: input.userId,
      },
      _avg: {
        accuracy: true,
        cpm: true,
      },
    });

    await tx.user.update({
      where: {
        id: input.userId,
      },
      data: {
        avarageAccuracy: avgValues._avg.accuracy ?? 0,
        avarageCpm: avgValues._avg.cpm ?? 0,
      },
    });
  });
});
