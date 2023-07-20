"use server";

import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { z } from "zod";
import { action } from "@/lib/actions";
import { revalidatePath } from "next/cache";

export const deleteUserAction = action(
  z.object({}),
  async (_, { user, prisma }) => {
    if (!user) throw new UnauthorizedError();

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  },
);

export const updateUserProfile = action(
  z.object({
    displayName: z.string(),
    biography: z.string().optional(),
  }),
  async (input, { user, prisma }) => {
    if (!user) throw new UnauthorizedError();

    if (input.biography) {
      const bioSchema = z
        .string()
        .max(128)
        .refine((bio) => bio.trim());
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
  },
);

export const updateUserAction = action(
  z.object({ name: z.string() }),
  async (input, { user, prisma }) => {
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
