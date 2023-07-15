"use client";

import { ModeToggle } from "./mode-toggle";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./mobile-nav";
import { MainNav } from "./main-nav";
import { UserDropdown } from "./user-dropdown";
import { useSession } from "next-auth/react";

export function Header() {
  const isLoggedIn = !!useSession().data;

  return (
    <header className="sticky top-0 z-40 flex w-full border-b-2 border-yellow-500 bg-background/10 backdrop-blur-sm">
      <div className="container flex items-center w-full h-20 space-x-4 sm:space-x-0">
        <div className="flex-1">
          <MainNav items={siteConfig.getHeaderLinks(isLoggedIn)} />
        </div>
        <MobileNav />
        <nav className="items-center hidden space-x-4 md:flex">
          <UserDropdown />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;
