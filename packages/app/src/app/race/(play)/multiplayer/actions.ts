import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { User } from "next-auth";

export async function createRaceParticipant(
  raceToJoin: Prisma.RaceGetPayload<Record<string, never>>,
  user?: User | null,
) {
  return await prisma.raceParticipant.create({
    data: {
      user: user
        ? {
            connect: {
              id: user.id,
            },
          }
        : undefined,
      Race: {
        connect: {
          id: raceToJoin?.id,
        },
      },
    },
  });
}
