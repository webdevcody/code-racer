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
  return await prisma.user.findMany({
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
