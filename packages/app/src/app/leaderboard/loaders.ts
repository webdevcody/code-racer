import { User, prisma } from "@/lib/prisma";
import { map } from "lodash";
import { omit } from "lodash/fp";

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

  return stripSensitiveUserInfo(users);
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
  return stripSensitiveUserInfo(users);
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

  return stripSensitiveUserInfo(users);
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

export function stripSensitiveUserInfo(users: User[] | User | null) {
  const removeSensitiveFields = omit([
    "email",
    "emailVerified",
    "role",
    "createdAt",
  ]);
  if (!users) return null;
  return Array.isArray(users)
    ? map(users, removeSensitiveFields)
    : removeSensitiveFields(users);
}
