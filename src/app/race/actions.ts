"use server";

import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function saveUserResult(input: {
  userId: User["id"];
  timeTaken: string | number;
}) {
  if (
    typeof input.timeTaken !== "string" &&
    typeof input.timeTaken !== "number"
  ) {
    throw new Error("Invalid input.");
  }

  await prisma.result.create({
    data: {
      userId: input.userId,
      takenTime: input.timeTaken.toString(),
    },
  });
}
