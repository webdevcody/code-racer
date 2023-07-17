import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function getRecentGames() {
  const user = await getCurrentUser();

  return await prisma.result.findMany({
    take: 10,
    skip: 0,
    where: {
      userId: user.id,
    },
    orderBy: {
      ["createdAt"]: "desc",
    },
  });
}
