"use client";
import * as React from "react";
import Link from "next/link";
import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { isActiveRoute, cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

export function MainNav({ items }: { items?: NavItem[] }) {
  const currentPathName = usePathname();
  //   console.log(items);
  return (
    <div className="flex items-center h-full gap-6 lg:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo width={30} height={30} />
        <span className="inline-block font-bold font-special">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length && (
        <nav className="items-center flex-1 hidden h-full md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "md:text-xs lg:text-sm flex h-full items-center p-4 border-b-2 border-b-yellow-500 border-opacity-0 hover:text-yellow-500 border-t-2 border-t-transparent hover:bg-white hover:bg-opacity-5",
                    {
                      "cursor-not-allowed opacity-80": item.disabled,
                      "border-b-2 border-b-yellow-500 border-opacity-100 text-yellow-500 decoration-2 decoration-primary":
                        isActiveRoute(currentPathName as string, item.href),
                    },
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      )}
    </div>
  );
}
