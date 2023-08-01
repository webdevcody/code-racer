import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function getUserSnippetCount() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return await prisma.snippet.count({
    where: {
      userId: user.id,
    },
  });
}

export async function getUserResultsCount() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return await prisma.result.count({
    where: {
      userId: user.id,
    },
  });
}

export async function getUserRank() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  const usersSortedByAccuracy = await prisma.user.findMany({
    select: {
      id: true,
      averageAccuracy: true,
    },
    orderBy: {
      averageAccuracy: "desc",
    },
  });

  const userRank = usersSortedByAccuracy.findIndex((u) => u.id === user.id) + 1;

  return userRank;
}