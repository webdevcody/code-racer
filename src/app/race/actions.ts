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
  if (
    (typeof input.timeTaken !== "string" &&
      typeof input.timeTaken !== "number") ||
    typeof input.errors !== "number" ||
    typeof input.wpm !== "number" ||
    typeof input.accuracy !== "number"
  ) {
    throw new Error("Invalid input.");
  }

  await prisma.result.create({
    data: {
      userId: input.userId,
      takenTime: input.timeTaken.toString(),
      errors: input.errors,
      wpm: input.wpm,
      accuracy: new Prisma.Decimal(input.accuracy),
    },
  });
}
