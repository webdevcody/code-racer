import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sortFilters } from "./sort-filters";
import { convertDecimalsToNumbers } from "@/lib/convertDecimalsToNumbers";
import { validatedCallback } from "@/lib/validatedCallback";

export const getUsersWithResultCounts = validatedCallback({
  outputValidation: z
    .object({
      id: z.string(),
      name: z.string(),
      image: z.string().nullable(),
      averageAccuracy: z.number(),
      averageCpm: z.number(),
      topLanguages: z.array(z.string()),
      results: z.number(),
    })
    .array(),
  callback: async ({
    take,
    skip,
    order,
    sortBy = "averageCpm",
  }: {
    take: number;
    skip: number;
    sortBy: string;
    order: "asc" | "desc" | undefined;
  }) => {
    const users = await prisma.user.findMany({
      take,
      skip,
      orderBy:
        sortBy !== sortFilters.RacePlayed
          ? {
              [sortBy]: order,
            }
          : {
              results: {
                _count: order,
              },
            },
      select: {
        id: true,
        image: true,
        averageAccuracy: true,
        averageCpm: true,
        name: true,
        topLanguages: true,
        results: true, // TODO: we shouldn't need to fetch back all results to compute the total number of races
      },
      where: {
        achievements: {
          some: {
            achievementType: "FIFTH_RACE",
          },
        },
      },
    });

    return convertDecimalsToNumbers(
      users.map((user) => ({
        ...user,
        results: user.results.length,
      }))
    );
  },
});

// TODO: this function feels dirty, we should remove it and refactor the code to support
// ranks without needing to fetch all users
export async function getAllUsersWithResults() {
  return getUsersWithResultCounts({
    take: 5000,
    skip: 0,
    sortBy: "averageCpm",
    order: "desc",
  });
}

export async function getTotalUsers() {
  return prisma.user.count({
    where: {
      achievements: {
        some: {
          achievementType: "FIFTH_RACE",
        },
      },
    },
  });
}

export function isFieldInUser(field: string) {
  return field in prisma.user.fields;
}
