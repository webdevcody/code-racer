"use server";

import {
  UnauthorizedError,
  ValidationError,
} from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function updateUserAction({ name }: { name: string }) {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  if (!name) {
    throw new ValidationError({
      name: "is required",
    });
  }

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      name,
    },
  });
}

export async function deleteUserAction() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
}
