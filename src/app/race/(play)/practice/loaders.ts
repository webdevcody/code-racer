import { prisma } from "@/lib/prisma";

export async function getSnippetById(snippetId: string) {
  return await prisma.snippet.findUnique({
    where: {
      id: snippetId,
    },
  });
}
