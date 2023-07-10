"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { LoginButton } from "./ui/buttons";
import Spinner from "./ui/spinner";

const AccountMenu = () => {
  const session = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 py-4 flex gap-4 items-center">
          <Image
            className="rounded-full"
            src={session?.data?.user.image ?? ""}
            alt="user avatar"
            height={30}
            width={30}
          />
          <p className="text-gray-700 font-bold">{session?.data?.user?.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex gap-1 items-center">
            <Icons.settings className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex gap-1 items-center">
            <Icons.settings className="mr-2 h-4 w-4" />
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

const Header = () => {
  const [state, setState] = useState(false);

  const navigation = [
    { title: "Race", path: "/race" },
    { title: "Leaderboard", path: "/leaderboard" },
    // { title: "About", path: "/" },
  ];

  const session = useSession();

  return (
    <div>
      <nav className="w-full border-b md:border-0 md:static">
        <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <Link href="/" className="flex gap-2 items-center">
              <Image
                unoptimized
                src="/static/logo.png"
                width={30}
                height={30}
                alt="Code Racer Logo"
              />
              CodeRacer
            </Link>
            <div className="md:hidden">
              <Button onClick={() => setState(!state)}>
                {state ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              state ? "block" : "hidden"
            }`}
          >
            <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {navigation.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    className="text-gray-600 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Link href={item.path}>{item.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <div className="flex w-36 justify-center">
              {session.status === "loading" && <Spinner />}
              {session.status === "unauthenticated" && <LoginButton />}
              {session.status === "authenticated" && <AccountMenu />}
            </div>
            <ModeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default function WrappedHeader() {
  return (
    <SessionProvider>
      <Header />
    </SessionProvider>
  );
}
