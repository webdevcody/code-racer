/* eslint-disable */
"use client";

import { Notification } from "@prisma/client";
import { Icons } from "./icons";
import NotificationItem from "./notification-item";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  userDeleteNotificationAction,
  userHasReadNotificationAction,
} from "@/lib/notification";
import { usePathname, useRouter } from "next/navigation";

interface NotificationProps {
  notifications: Notification[] | null;
}

export default function Notification({ notifications }: NotificationProps) {
  const hasUnreadNotification = notifications?.find((n) => !n.read) ?? false;
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          {!hasUnreadNotification && (
            <Icons.normalBellNotification
              className="w-[1.2rem] h-[1.2rem]"
              strokeWidth={1.5}
              size={10}
            />
          )}
          {hasUnreadNotification && (
            <Icons.unreadBellNotification
              className="w-[1.2rem] h-[1.2rem]"
              strokeWidth={1.5}
              size={10}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <p className="text-center text-md font-bold text-secondary-foreground p-3 max-w-[430px] min-w-[300px]">
          Notifications
        </p>
        {notifications?.map((notification, index) => (
          <DropdownMenuItem
            key={index}
            className="flex flex-row gap-1 justify-between items-center"
          >
            <span
              onClick={() => {
                userHasReadNotificationAction({
                  notificationId: notification.id,
                });
                if (notification?.ctaUrl) {
                  router.push(notification.ctaUrl);
                }
              }}
            >
              <NotificationItem notification={notification} />
            </span>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                userDeleteNotificationAction({
                  notificationId: notification.id,
                });
              }}
            >
              <Icons.xSquare size={19} strokeWidth={1.5} />
            </Button>
          </DropdownMenuItem>
        ))}
        {(notifications?.length ?? 0) < 1 && (
          <p className="text-muted-foreground text-sm p-3 text-center">
            You have no notifications
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
