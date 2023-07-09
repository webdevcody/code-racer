"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function updateUserAction({ newName }: { newName: string }) {
  const user = await getCurrentUser();

  if (!user) {
    return new Response("user-not-defined", { status: 401 });
  }

  if (!newName) {
    return new Response("name-is-empty", { status: 400 });
  }

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      name: newName,
    },
  });
}
