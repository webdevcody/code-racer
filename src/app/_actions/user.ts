"use server";

import { prisma } from "@/lib/prisma";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";
import { zact } from "zact/server";

export const updateUserAction = zact(z.object({ name: z.string() }))(async (
  input,
) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      name: input.name,
    },
  });
});

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
