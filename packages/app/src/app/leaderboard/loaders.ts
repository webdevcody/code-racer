import { prisma } from "@/lib/prisma";
import { omit } from "lodash";
import {
  SensitiveUserFields,
  UserWithResults,
  sensitiveUserFields,
} from "./types";

export async function getUsersWithResultCounts({
  take,
  skip,
  order,
}: {
  take: number;
  skip: number;
  order: "asc" | "desc" | undefined;
}) {
  const users = await prisma.user.findMany({
    take,
    skip,
    orderBy: {
      results: {
        _count: order,
      },
    },
    include: {
      results: true,
    },
    where: {
      achievements: {
        some: {
          achievementType: "FIFTH_RACE",
        },
      },
    },
  });

  return users.map(omitSensitiveUserFields);
}

export async function getAllUsersWithResults() {
  const users = await prisma.user.findMany({
    include: {
      results: true,
    },
    where: {
      achievements: {
        some: {
          achievementType: "FIFTH_RACE",
        },
      },
    },
  });
  return users.map(omitSensitiveUserFields) as UserWithResults[];
}

export async function getUsersWithResults({
  take,
  skip,
  sortBy,
  order,
}: {
  take: number;
  skip: number;
  sortBy: string;
  order: "asc" | "desc" | undefined;
}) {
  const users = await prisma.user.findMany({
    take,
    skip,
    orderBy: {
      [sortBy]: order,
    },
    include: {
      results: true,
    },
    where: {
      achievements: {
        some: {
          achievementType: "FIFTH_RACE",
        },
      },
    },
  });

  return users.map(omitSensitiveUserFields);
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

export const omitSensitiveUserFields = <T>(user: T) => {
  return omit(user as any, sensitiveUserFields) as Omit<T, SensitiveUserFields>;
};
