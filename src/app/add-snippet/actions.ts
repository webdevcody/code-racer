"use server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type {Snippet} from "@prisma/client"


export async function addSnippetAction({ code, language }: Pick<Snippet, "code" | 'language'>) {
  const user = await getCurrentUser();

  if (!user) {
    return new Response("user-not-defined", { status: 401 });
  }

  // why am i getting errors here with where?
  await prisma.snippet.create({
    data: {
      userId: user?.id,
      code,
      language,
    },
  });
}
