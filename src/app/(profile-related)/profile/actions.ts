"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { catchError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateBio(fd: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const bio = fd.get("bio") as string;
  const bioSchema = z
    .string()
    .max(128)
    .refine((bio) => bio.trim());
  try {
    if (bio === "") {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          bio,
        },
      });
    } else {
      const parsedBio = bioSchema.parse(bio);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          bio: parsedBio,
        },
      });
    }
  } catch (err) {
    // if (err instanceof ZodError) toast({description: "Bio cannot be longer tha 128 characters"})
    catchError(err);
  }
  revalidatePath("/profile");
}
