"use server";

import { revalidatePath } from "next/cache";
import { safeAction } from "./actions";
import { prisma, type Notification } from "./prisma";
import { z } from "zod";

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

export const userHasReadNotificationAction = safeAction(
  z.object({
    notificationId: z.string().nullish(),
  }),
)(async ({ notificationId }) => {
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
});

export const userDeleteNotificationAction = safeAction(
  z.object({
    notificationId: z.string(),
  }),
)(async ({ notificationId }) => {
  await prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });
  revalidatePath("/");
});

export const pushNotification = safeAction(
  z.object({
    userId: z.string(),
    notification: z.object({
      title: z.string(),
      description: z.string(),
      ctaUrl: z.string().optional(),
    }),
  }),
)(async ({ userId, notification: { title, description, ctaUrl } }) => {
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
});

export const userClearNotificationAction = safeAction(
  z.object({
    userId: z.string(),
  }),
)(async ({ userId }) => {
  await prisma.notification.deleteMany({
    where: {
      user: {
        id: userId,
      },
    },
  });
  console.log("userClearNotification");
  revalidatePath("/");
});

export const getUserNotificationCount = safeAction(
  z.object({
    userId: z.string(),
  }),
)(async ({ userId }) => {
  return await prisma.notification.count({
    where: {
      user: {
        id: userId,
      },
    },
  });
});
