"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import ConfettiProvider from "@/context/confetti";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <ConfettiProvider>{children}</ConfettiProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
