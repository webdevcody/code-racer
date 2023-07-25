"use server";

import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { z } from "zod";
import { safeAction } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const deleteUserAction = safeAction(z.object({}))(async (_) => {
  const user = await getCurrentUser();

  if (!user) throw new UnauthorizedError();

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
});

export const updateUserProfile = safeAction(
  z.object({
    displayName: z.string(),
    biography: z.string().optional(),
  }),
)(async (input) => {
  const user = await getCurrentUser();

  if (!user) throw new UnauthorizedError();

  if (input.biography || input.biography === "") {
    const bioSchema =
      input.biography.length > 128
        ? z
            .string()
            .max(128)
            .refine((bio) => bio.trim())
        : z.string();
    const parsedBio = await bioSchema.parseAsync(input.biography);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: input.displayName,
        bio: parsedBio,
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: input.displayName,
      },
    });
  }

  revalidatePath(`/users/${user.id}`);
});

export const updateUserAction = safeAction(z.object({ name: z.string() }))(
  async (input) => {
    const user = await getCurrentUser();

    if (!user) throw new UnauthorizedError();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: input.name,
      },
    });
  },
);
