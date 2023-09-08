"use client";

import type { SendNotificationPayload } from "@code-racer/wss/src/events/server-to-client";

import React from "react";

import { toast } from "@/components/ui/use-toast";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";

export const NotificationCatcher: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  React.useEffect(() => {
    const showToast = ({
      title,
      description,
      variant,
    }: SendNotificationPayload) => {
      toast({
        title,
        description,
        variant,
        duration: 2000,
      });

      if (title === "Error") {
        if (socket.connected) {
          socket.disconnect();
        }

        router.replace("/race/rooms");
      }

      if (title === "Room Not Found") {
        if (socket.connected) {
          socket.disconnect();
        }
        router.replace("/race/rooms");
      }

      if (title === "Room Full!") {
        if (socket.connected) {
          socket.disconnect();
        }
        router.replace("/race/rooms");
      }

      if (title === "Race Has Started!") {
        if (socket.connected) {
          socket.disconnect();
        }
        router.replace("/race/rooms");
      }
    };

    const handleError = (error: Error) => {
      showToast({
        title: error.name,
        description: error.message,
        variant: "destructive",
      });
    };

    socket.on("connect_error", handleError);
    socket.on("SendError", handleError);
    socket.on("SendNotification", showToast);
    return () => {
      socket.off("connect_error", handleError);
      socket.off("SendError", handleError);
      socket.off("SendNotification", showToast);
    };
  }, [children, router]);

  return children;
};
