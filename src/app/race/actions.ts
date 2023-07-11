"use server";

import { User, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function saveUserResult(input: {
  userId: User["id"];
  timeTaken: string | number;
  errors: number;
  wpm: number;
  accuracy: number;
}) {

  await prisma.result.create({
    data: {
      userId: input.userId,
      takenTime: input.timeTaken.toString(),
      errorCount: input.errors,
      wpm: input.wpm,
      accuracy: new Prisma.Decimal(input.accuracy),
    },
  });
}
