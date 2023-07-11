"use client";

import { signOut, useSession } from "next-auth/react";
import Spinner from "./ui/spinner";
import { LoginButton } from "./ui/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { Icons } from "./icons";
import Image from "next/image";

export function UserDropdown() {
  const session = useSession();

  return (
    <div className="flex gap-4 items-center">
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
        <DropdownMenuItem>
          <Link href="/dashboard" className="flex gap-1 items-center">
            <Icons.lineChart className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/profile" className="flex gap-1 items-center">
            <Icons.profile className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
        >
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
