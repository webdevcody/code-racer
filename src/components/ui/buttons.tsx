"use client";
import { signIn, signOut } from "next-auth/react";
import { Icons } from "../icons";
import { Button } from "./button";

export const LoginButton = () => {
  return (
    <Button
      variant="outline"
      className="flex gap-2 px-4"
      onClick={() => signIn("github")}
    >
      <Icons.github className="h-[1.2rem] w-[1.2rem]" />
      <p className="whitespace-nowrap">Sign in</p>
    </Button>
  );
};

export const LogoutButton = () => {
  return <Button onClick={() => signOut()}>Sign Out</Button>;
};
