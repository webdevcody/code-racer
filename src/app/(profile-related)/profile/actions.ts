"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { throwError } from "@/lib/utils";

export async function updateUserAction({ newName }: { newName: string }) {
  const user = await getCurrentUser();

  if (!user) {
    throwError(new Error("user-not-defined"))
  }

  if (!newName) {
    throwError(new Error("name-is-empty"))
  }

  if (newName === user?.name) {
    throwError(new Error("name-is-the-same"))
  }

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      name: newName,
    },
  })
}

export async function deleteUserAction() {
export async function deleteUserAction() {
  const user = await getCurrentUser();
  const uid = user?.id as string;

  if (!user) {
    throw new Error("No permission.");
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
}
