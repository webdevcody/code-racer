import { action } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const achievementTypeParameter = z.object({
    achievementType: z.enum(["FIRST_RACE", "FIRST_SNIPPET"])
});

const achievementTypeWithUserIdParameter = z.object({
    achievementType: z.enum(["FIRST_RACE", "FIRST_SNIPPET"]),
    userId: z.string()
});

export const findAchievement = action(
    achievementTypeParameter,
    async ({ achievementType }) => {
        const achievement = await prisma.achievement.findUnique({
            where: { type: achievementType }
        });

        return achievement;
    }
);

export const findFirstUserAchievement = action(
    achievementTypeParameter,
    async ({ achievementType }) => {
        const achievement = await prisma.userAchievement.findFirst({
            where: { achievementType }
        });

        return achievement;
    }
);

export const createAchievement = action(
    achievementTypeWithUserIdParameter,
    async ({ achievementType, userId }) => {
        await prisma.userAchievement.create({
            data: {
                achievementType,
                userId
            }
        });
    }
);