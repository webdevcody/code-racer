"use client";

import { signOut, useSession } from "next-auth/react";
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
import Spinner from "./ui/spinner";

export function UserDropdown() {
  const session = useSession();

  return (
    <div className="flex items-center gap-4">
      <div className="flex justify-center">
        {session.status === "loading" && <Spinner />}
        {session.status === "unauthenticated" && <LoginButton />}
        {session.status === "authenticated" && <AccountMenu />}
      </div>
    </div>
  );
}

const AccountMenu = () => {
  const session = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex gap-2 px-4">
          <Image
            className="rounded-full"
            src={session?.data?.user.image ?? ""}
            alt="user avatar"
            height={30}
            width={30}
          />
          <p className="whitespace-nowrap">{session?.data?.user?.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-1">
            <Icons.lineChart className="w-4 h-4 mr-2" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-1">
            <Icons.profile className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {
          session.data?.user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/review" className="flex items-center gap-1">
              <Icons.review className="w-4 h-4 mr-2" />
              <span>Review</span>
            </Link>
          </DropdownMenuItem>
          )
        }
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
