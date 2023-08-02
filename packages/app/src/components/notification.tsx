/* eslint-disable */
"use client";

import { type Notification, type User } from "@prisma/client";
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
  getUserNotification,
  getUserNotificationCount,
  userClearNotificationAction,
  userDeleteNotificationAction,
  userHasReadNotificationAction,
} from "@/lib/notification";
import { useRouter } from "next/navigation";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useState, useTransition } from "react";

interface NotificationProps {
  userId: User["id"];
}

const NOTIFICATIONS_DISPLAY_LIMIT = 25; // Maximun of notification entries taht can be displayed at once
const INCREMENT = 10; // Amount of entries to add after use click `Show More` button

export default function Notification({ userId }: NotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState<number>(INCREMENT);
  const displayShowMoreButton =
    notificationCount > 0 && skip + take < notificationCount;
  const hasUnreadNotification = notifications?.find((n) => !n.read) ?? false;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getUserNotification({
      userId,
      take,
      skip,
    })
      .then((result) => setNotifications(result))
      .catch((error) =>
        console.error("getUserNotification next action error:", error),
      );
    getUserNotificationCount({
      userId,
    })
      .then((result) => setNotificationCount(result))
      .catch((error) =>
        console.error("getUserNotificationCount next action error:", error),
      );
  }, [userId, skip, take]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} data-cy="notification-toggle">
          {!hasUnreadNotification && (
            <Icons.normalBellNotification
              className="w-[1.2rem] h-[1.2rem]"
              strokeWidth={1.5}
              size={10}
              data-cy="notification-normal-bell-icon"
            />
          )}
          {hasUnreadNotification && (
            <Icons.unreadBellNotification
              className="w-[1.2rem] h-[1.2rem]"
              strokeWidth={1.5}
              size={10}
              data-cy="notification-unread-bell-icon"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="notification-dropdown">
        <div className="flex flex-row items-center justify-center">
          <p className="text-center text-md font-bold text-secondary-foreground p-3 flex-1">
            Notifications
          </p>
          {notificationCount > 0 && (
            <Button
              data-cy="notification-clear-button"
              disabled={isPending}
              variant={"outline"}
              size={"sm"}
              className="text-xs flex[0.1]"
              onClick={async (e) => {
                e.preventDefault();
                if (userId) {
                  startTransition(async () => {
                    await userClearNotificationAction({
                      userId,
                    });
                    setNotifications([]);
                    setNotificationCount(0);
                  });
                }
              }}
            >
              Clear
            </Button>
          )}
        </div>

        <ScrollArea className="min-h-[50px] h-[250px] max-w-[430px] min-w-[300px]">
          {notifications?.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-row gap-1 justify-between items-center"
              data-cy="notification-dropdown-menu-item"
            >
              <span
                onClick={(e) => {
                  startTransition(() => {
                    userHasReadNotificationAction({
                      notificationId: notification.id,
                    });
                    setNotifications((currentNotifications) => {
                      return currentNotifications.map((n) => {
                        if (n.id === notification.id) {
                          n.read = true;
                        }
                        return n;
                      });
                    });
                    if (notification?.ctaUrl) {
                      router.push(notification.ctaUrl);
                    } else {
                      e.preventDefault();
                    }
                  });
                }}
              >
                <NotificationItem notification={notification} />
              </span>
              <Button
                data-cy="notification-delete-button"
                disabled={isPending}
                variant={"outline"}
                size={"icon"}
                onClick={(e) => {
                  e.preventDefault();
                  startTransition(() => {
                    userDeleteNotificationAction({
                      notificationId: notification.id,
                    });
                    setNotifications((currentNotifications) => {
                      return currentNotifications.filter(
                        (n) => n.id !== notification.id,
                      );
                    });
                    setNotificationCount((current) => current - 1);
                  });
                }}
              >
                <Icons.xSquare size={19} strokeWidth={1.5} />
              </Button>
            </DropdownMenuItem>
          ))}
          {displayShowMoreButton && (
            <span className="flex flex-col justify-start items-center my-4">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  startTransition(() => {
                    if (take + INCREMENT <= NOTIFICATIONS_DISPLAY_LIMIT) {
                      setTake(take + INCREMENT);
                    } else {
                      setSkip((skip) => skip + take);
                      setTake(INCREMENT);
                    }
                  });
                }}
                data-cy="notification-show-more-button"
              >
                Show More
              </Button>
            </span>
          )}
          {!displayShowMoreButton && notificationCount > 0 && (
            <p
              className="text-muted-foreground text-xs text-center p-6"
              data-cy="notification-no-more-left"
            >
              No more notification to show
            </p>
          )}
          {notificationCount < 1 && (
            <p
              className="text-muted-foreground text-xs p-3 text-center"
              data-cy="notification-empty"
            >
              You have no notifications
            </p>
          )}
          <ScrollBar orientation={"vertical"} />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
