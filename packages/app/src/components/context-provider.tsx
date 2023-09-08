"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { socket } from "@/lib/socket";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    /** first item is an  empty string */
    const splitPath = pathname.split("/");
    const SECOND_PATH = splitPath[2];
    const THIRD_PATH = splitPath[3];
    if (SECOND_PATH !== "rooms" && socket.connected) {
      socket.disconnect();
    } else {
      if (!THIRD_PATH && socket.connected) {
        socket.disconnect();
      }
    }
  }, [pathname]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
