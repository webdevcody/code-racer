"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { LoginButton } from "./ui/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { User } from "next-auth";
import { UserRole } from "@prisma/client";

export function UserDropdown({
  user,
}: {
  user?: User & {
    role: UserRole;
  };
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex justify-center">
        {user ? <AccountMenu user={user} /> : <LoginButton />}
      </div>
    </div>
  );
}

const AccountMenu = ({
  user,
}: {
  user: User & {
    role: UserRole;
  };
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-full gap-2 px-2 bg-white bg-opacity-0 lg:px-4 hover:bg-white hover:bg-opacity-5"
        >
          <Image
            className="rounded-full"
            src={user.image ?? ""}
            alt="user avatar"
            height={26}
            width={26}
          />
          <p className="whitespace-nowrap">{user.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/dashboard/races" className="flex items-center gap-1">
            <Icons.lineChart className="w-4 h-4 mr-2" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.id}`} className="flex items-center gap-1">
            <Icons.profile className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/review" className="flex items-center gap-1">
              <Icons.review className="w-4 h-4 mr-2" />
              <span>Review</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 hover:text-white focus:bg-destructive hover:cursor-pointer"
          onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
        >
          <Icons.logout className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
