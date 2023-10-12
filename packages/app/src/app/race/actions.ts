"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validatedCallback } from "@/lib/validatedCallback";

export const saveUserResultAction = validatedCallback({
  inputValidation: z.object({
    raceParticipantId: z.string().optional(),
    timeTaken: z.union([z.string(), z.number()]),
    errors: z.number().nullable(),
    cpm: z.number(),
    accuracy: z.number().min(0).max(100),
    snippetId: z.string(),
  }),
  callback: async (input) => {
    const user = await getCurrentUser();

    if (!user) throw new UnauthorizedError();

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { results: true },
    });

    if (userData == null) throw new Error("User not found");

    let languagesMap: { [key: string]: number };

    if (userData.languagesMap == null) {
      languagesMap = {};
      const results = userData.results;
      results.forEach(async (result) => {
        const raceSnippet = await prisma.snippet.findUnique({
          select: { language: true },
          where: { id: result.snippetId },
        });

        if (Object.keys(languagesMap).includes(raceSnippet!.language)) {
          languagesMap[raceSnippet!.language] += 1;
        } else {
          languagesMap[raceSnippet!.language] = 1;
        }
      });
    } else {
      languagesMap = JSON.parse(userData.languagesMap as string);
    }

    const snippetData = await prisma.snippet.findUnique({
      select: { language: true },
      where: { id: input.snippetId },
    });

    if (Object.keys(languagesMap).includes(snippetData!.language!)) {
      languagesMap[snippetData!.language!] += 1;
    } else {
      languagesMap[snippetData!.language!] = 1;
    }

    const topLanguages = Object.keys(languagesMap)
      .sort((a, b) => languagesMap[b] - languagesMap[a])
      .splice(0, 3);

    return await prisma.$transaction(async (tx) => {
      const result = await tx.result.create({
        data: {
          userId: user.id,
          takenTime: input.timeTaken.toString(),
          errorCount: input.errors,
          cpm: input.cpm,
          accuracy: new Prisma.Decimal(input.accuracy),
          snippetId: input.snippetId,
          RaceParticipant: input.raceParticipantId
            ? {
                connect: {
                  id: input.raceParticipantId,
                },
              }
            : undefined,
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
          languagesMap: JSON.stringify(languagesMap),
          topLanguages: topLanguages,
        },
      });

      return result;
    });
  },
});

/** PLEASE DO SERVER ACTION CALLS ON THE WEBSOCKET SERVER
 *  INSTEAD SINCE IT IS TECHNICALLY A SERVER
 *  AND WE ARE MAKING PRISMA CALLS IN IT AS WELL,
 *  SO WE SHOULD DO IT ON THE SERVER.
 */
