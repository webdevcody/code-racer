"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Icons } from "@/components/icons";

const LogoutBtn = () => {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
      variant="destructive"
    >
      <Icons.logout className="w-4 h-4 mr-2" />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutBtn;
