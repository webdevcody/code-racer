import { type Notification } from ".prisma/client";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  return (
    <div className="flex flex-row justify-start gap-3 items-center p-2">
      <span
        className={cn(
          "flex justify-center items-center w-8",
          notification.read && "text-muted-foreground",
        )}
      >
        {notification?.read && (
          <Icons.readNotification size={20} strokeWidth={1.5} />
        )}
        {!notification?.read && (
          <Icons.unreadNotification size={20} strokeWidth={1.5} />
        )}
      </span>
      <div className="flex flex-col gap-1 min-w-48 w-full">
        <span
          className={cn(
            "text-md font-semibold",
            notification.read && "text-muted-foreground",
          )}
        >
          {notification.title}
        </span>
        <span
          className={cn(
            "text-sm",
            notification.read && "text-muted-foreground",
          )}
        >
          {notification.description}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
