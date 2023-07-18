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

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo width={30} height={30} />
        <span className="inline-block font-special font-bold">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="items-center justify-center flex-1 hidden gap-2 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "md:text-xs lg:text-sm",
                    buttonVariants({ variant: "ghost" }),
                    {
                      "cursor-not-allowed opacity-80": item.disabled,
                      "underline underline-offset-8 decoration-2 decoration-primary":
                        isActiveRoute(currentPathName, item.href),
                    },
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  );
}
