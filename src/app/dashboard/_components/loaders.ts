import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Result } from "@prisma/client";

export async function getRecentGames({
  take,
  skip,
  column,
  order,
}: {
  take: number;
  skip: number;
  column: keyof Result | undefined;
  order: "asc" | "desc" | undefined;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return await prisma.result.findMany({
    take,
    skip,
    where: {
      userId: user.id,
    },
    orderBy: {
      [column ?? "createdAt"]: order,
    },
  });
}

export async function getSnippets() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return await prisma.snippet.findMany({
    where: {
      userId: user.id,
    },
  });
}
