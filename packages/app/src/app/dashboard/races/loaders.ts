import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Result } from "@prisma/client";

// typeconst sortBy = column && column in prisma.result.fields ? column : "cpm";

export function isFieldInResult(field: string) {
  return field in prisma.result.fields;
}

export async function getRaces({
  take,
  skip,
  sortBy,
  order,
}: {
  take: number;
  skip: number;
  sortBy: keyof Result;
  order: "asc" | "desc" | undefined;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return prisma.result.findMany({
    include: {
        snippet: true
    },
    take,
    skip,
    where: {
      userId: user.id,
    },
    orderBy: {
      [sortBy]: order,
    },
  });
}

export async function getTotalRaces() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return prisma.result.count({
    where: {
      userId: user.id,
    },
  });
}
