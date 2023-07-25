import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Snippet } from "@prisma/client";

export async function getTotalSnippets() {
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

export async function getSnippets({
  take,
  skip,
  sortBy,
  order,
}: {
  take: number;
  skip: number;
  sortBy: keyof Snippet;
  order: "asc" | "desc" | undefined;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return prisma.snippet.findMany({
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

export function isFieldInSnippet(field: string) {
  return field in prisma.snippet.fields;
}
