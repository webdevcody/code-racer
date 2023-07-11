"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { User } from "next-auth";
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

export async function deleteUserAction(input: { id: User["id"] }) {
  const user = await getCurrentUser();

  if (user?.id !== input.id) {
    throw new Error("No permission.");
  }

  await prisma.user.delete({
    where: {
      id: input.id,
    },
  });
}
