"use server";

import { z } from "zod";
import { safeAction } from "@/lib/actions";
import { Prisma } from "@prisma/client";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const saveUserResultAction = safeAction(
    z.object({
        timeTaken: z.union([z.string(), z.number()]),
        errors: z.number().nullable(),
        cpm: z.number(),
        accuracy: z.number().min(0).max(100),
        snippetId: z.string(),
    }),
)(async (input) => {
    const user = await getCurrentUser();

    if (!user) throw new UnauthorizedError();

    return await prisma.$transaction(async (tx) => {
        const result = await tx.result.create({
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

        return result;
    });
});

export const endRaceAction = safeAction(
    z.object({
        raceId: z.string(),
    }),
)(async (input) => {
    await prisma.race.update({
        where: {
            id: input.raceId,
        },
        data: {
            endedAt: new Date(),
        },
    });
});

/**
 * This should create a private room for the user
 * Not implemented. Need to decide on the multiplayer architecture
 **/
export const createPrivateRaceRoom = safeAction(z.object({}))(async (input) => {
    throw new Error("Not implemented");
});
