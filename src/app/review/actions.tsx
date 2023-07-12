import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { Snippet } from "@prisma/client";

export async function acquitSnippetAction(id: Snippet['id']) {
  const user = await getCurrentUser();

  if (user?.role !== 'ADMIN') {
    throw new Error("No permission.")
  }

  // TODO : Update the snippet
  // Would be good if users
  // will no longer be able
  // to down/upvote it

  // await prisma.snippet.update({
  //   data: {
  //     rating: 0
  //   },
  //   where: {
  //     id,
  //   }
  // })

  revalidatePath('/review');
}

export async function deleteSnippetAction(id: Snippet['id']) {
  const user = await getCurrentUser();

  if (user?.role !== 'ADMIN') {
    throw new Error("No permission.")
  }

  await prisma.snippet.delete({
    where: {
      id
    }
  })

  revalidatePath('/review');
}