"use server";

import { revalidatePath } from "next/cache";
import { prisma, type Notification } from "./prisma";
import { z } from "zod";
import { validatedCallback } from "./validatedCallback";

export async function getUserNotification({
  userId,
  take,
  skip,
}: {
  userId: string;
  take: number;
  skip: number;
}): Promise<Notification[]> {
  const notifications = await prisma.notification.findMany({
    take,
    skip,
    where: {
      user: {
        id: userId,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return notifications;
}

export const userHasReadNotificationAction = validatedCallback({
  inputValidation: z.object({
    notificationId: z.string().nullish(),
  }),
  callback: async ({ notificationId }) => {
    if (!notificationId) {
      return;
    }
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });
    revalidatePath("/");
  },
});

export const userDeleteNotificationAction = validatedCallback({
  inputValidation: z.object({
    notificationId: z.string(),
  }),
  callback: async ({ notificationId }) => {
    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });
    revalidatePath("/");
  },
});

export const pushNotification = validatedCallback({
  inputValidation: z.object({
    userId: z.string(),
    notification: z.object({
      title: z.string(),
      description: z.string(),
      ctaUrl: z.string().optional(),
    }),
  }),
  callback: async ({
    userId,
    notification: { title, description, ctaUrl },
  }) => {
    await prisma.notification.create({
      data: {
        title,
        description,
        ctaUrl,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  },
});

export const userClearNotificationAction = validatedCallback({
  inputValidation: z.object({
    userId: z.string(),
  }),
  callback: async ({ userId }) => {
    await prisma.notification.deleteMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
    revalidatePath("/");
  },
});

export const getUserNotificationCount = validatedCallback({
  inputValidation: z.object({
    userId: z.string(),
  }),
  callback: async ({ userId }) => {
    return await prisma.notification.count({
      where: {
        user: {
          id: userId,
        },
      },
    });
  },
});
