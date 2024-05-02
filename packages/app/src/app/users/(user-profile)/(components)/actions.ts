"use server";

import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { validatedCallback } from "@/lib/validatedCallback";

//import { Octokit } from "@octokit/core";


export const deleteUserAction = validatedCallback({
  inputValidation: z.object({}), // Input validation schema (empty object in this case)
  callback: async (_) => { // Main callback function
    // Retrieve the current user
    const user = await getCurrentUser();

    // If user doesn't exist, throw an UnauthorizedError
    if (!user) throw new UnauthorizedError();

  /*THIS IS THE CODE I ATTEMPED TO ADD TO DELETE THE USER'S GITHUB TOKEN USING GITHUB API
    // Initialize Octokit with user's token
    const octokit = new Octokit({
      auth: user.token,
    });

    // Make a request to delete an application grant using Octokit
    await octokit.request("DELETE /applications/${user.token}/grant", {
      client_id: "Iv1.8a61f9b3a7aba766",
      access_token: "e72e16c7e42f292c6912e7710c838347ae178b4a",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    */


    // Update user data with an empty object
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {},
    });

    // Delete the user from the database
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  },
});




export const updateUserProfile = validatedCallback({
  inputValidation: z.object({
    displayName: z.string(),
    biography: z.string().optional(),
  }),
  callback: async (input) => {
    const user = await getCurrentUser();

    if (!user) throw new UnauthorizedError();

    const displayNameSchema =
      input.displayName.length > 39
        ? z
            .string()
            .max(39)
            .refine((username) => username.trim())
        : z.string();
    const parsedDisplayName = await displayNameSchema.parseAsync(
      input.displayName
    );

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
          name: parsedDisplayName,
          bio: parsedBio,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: parsedDisplayName,
        },
      });
    }

    revalidatePath(`/users/${user.id}`);
  },
});

export const updateUserAction = validatedCallback({
  inputValidation: z.object({ name: z.string() }),
  callback: async (input) => {
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
});

export const deleteUserResults = validatedCallback({
  inputValidation: z.object({}),
  callback: async () => {
    const user = await getCurrentUser();
    console.log(user?.id);

    if (!user) throw new UnauthorizedError();

    await prisma.result.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.achievement.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        topLanguages: [],
        languagesMap: undefined,
        averageCpm: 0,
        averageAccuracy: 0,
      },
    });
  },
});
