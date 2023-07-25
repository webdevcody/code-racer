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
