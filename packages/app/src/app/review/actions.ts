"use server";

import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { pushNotification } from "@/lib/notification";
import { validatedCallback } from "@/lib/validatedCallback";

export const deleteSnippetResultAction = validatedCallback({
  inputValidation: z.object({
    snippetId: z.string(),
  }),
  callback: async ({ snippetId: id }) => {
    const user = await getCurrentUser();

    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError();
    }

    await prisma.result.deleteMany({
      where: {
        snippetId: id,
      },
    });
  },
});

export const updateSnippetCodeAction = validatedCallback({
  inputValidation: z.object({
    id: z.string(),
    snippet: z.object({
      code: z.string(),
    }),
  }),
  callback: async ({ id, snippet: { code } }) => {
    const user = await getCurrentUser();

    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError();
    }

    await prisma.snippet.update({
      data: {
        rating: 0,
        onReview: false,
        code: code,
      },
      where: {
        id,
      },
    });

    revalidatePath("/review");
  },
});

export const acquitSnippetAction = validatedCallback({
  inputValidation: z.object({
    id: z.string(),
  }),
  callback: async ({ id }) => {
    const user = await getCurrentUser();

    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError();
    }

    // TODO : Update the snippet
    // Would be good if users
    // will no longer be able
    // to down/upvote it

    await prisma.snippet.update({
      data: {
        rating: 0,
        onReview: false,
      },
      where: {
        id,
      },
    });

    revalidatePath("/review");
  },
});

export const deleteSnippetAction = validatedCallback({
  inputValidation: z.object({
    id: z.string(),
    path: z.string(),
  }),
  callback: async ({ id, path }) => {
    const user = await getCurrentUser();

    const snippet = await prisma.snippet.findUnique({
      where: {
        id,
      },
    });

    if (user?.role !== "ADMIN" && snippet?.userId !== user?.id) {
      throw new UnauthorizedError();
    }

    await prisma.snippet.delete({
      where: {
        id,
      },
    });

    // TODO:
    // create a counter for user's bad
    // snippets (that was deleted)

    revalidatePath(path);
  },
});

export const notifyReportUser = validatedCallback({
  inputValidation: z.object({
    snippetId: z.string(),
    notification: z.object({
      title: z.string(),
      description: z.string(),
      ctaUrl: z.string().optional(),
    }),
  }),
  callback: async ({ snippetId, notification }) => {
    const users = await prisma.snippetVote.findMany({
      select: {
        userId: true,
      },
      where: {
        snippetId: snippetId,
      },
    });

    users.forEach(async (user) => {
      await pushNotification({
        userId: user.userId,
        notification,
      });
    });
  },
});
