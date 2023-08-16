import { prisma } from "@/lib/prisma";

export async function getUsersWithResultCounts({
  take,
  skip,
  order,
}: {
  take: number;
  skip: number;
  order: "asc" | "desc" | undefined;
}) {
  return await prisma.user.findMany({
    take,
    skip,
    orderBy: {
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
}

export async function getAllUsersWithResults() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      averageAccuracy: true,
      averageCpm: true,
      image: true,
      name: true,
      topLanguages: true,
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
  return users;
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
    select: {
      id: true,
      image: true,
      averageAccuracy: true,
      averageCpm: true,
      name: true,
      topLanguages: true,
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

  return users;
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
