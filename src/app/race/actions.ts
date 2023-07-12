"use server";

import { Result } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type NewResult = Omit<Result, "id" | "createdAt">;

export async function saveUserResultAction(input: NewResult) {
  await prisma.result.create({
    data: {
      userId: input.userId,
      takenTime: input.takenTime,
      errorCount: input.errorCount,
      cpm: input.cpm,
      accuracy: input.accuracy,
      snippetId: input.snippetId,
    },
  });
}
