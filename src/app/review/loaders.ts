import { prisma } from "@/lib/prisma";

export async function getSnippetsInReview() {
  return await prisma.snippet.findMany({
    where: {
      onReview: true,
    },
  });
}
