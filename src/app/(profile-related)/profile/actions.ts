"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/profile");
}

export async function deleteUserAction({ userId }: { userId: string }) {
  const user = await getCurrentUser();

  if (!user) {
    return new Response("user-not-defined", { status: 401 });
  }

  if (userId !== user.id) {
    return new Response("action-not-authorized", { status: 401 });
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
