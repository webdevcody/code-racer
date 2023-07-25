"use client";

import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { isActiveRoute, cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { UserDropdown } from "./user-dropdown";
import { Icons } from "./icons";
import Link, { LinkProps } from "next/link";
import { ModeToggle } from "./mode-toggle";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { User } from "next-auth";
import { UserRole } from "@prisma/client";

export function MobileNav({
  user,
}: {
  user?: User & {
    role: UserRole;
  };
}) {
  const [open, setOpen] = useState(false);
  const isLoggedIn = !!useSession().data;
  const currentPathName = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="w-10 h-10 p-0" onClick={() => setOpen(!open)}>
            {open ? (
              <Icons.mobileNavOpen className="text-background h-[2rem] w-[2rem]" />
            ) : (
              <Icons.mobileNavClosed className="text-background h-[2rem] w-[2rem]" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[540px]">
          <ScrollArea className="my-4 h-[calc(100vh-9rem)] pb-10">
            <div className="flex flex-col items-center justify-center gap-10 py-2">
              <UserDropdown user={user} />
              <nav className="flex flex-col items-center justify-center flex-1 space-y-4">
                {siteConfig.getHeaderLinks(isLoggedIn).map((item) => (
                  <MobileLink
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "text-xl w-full",
                      {
                        "bg-background border-2 border-primary text-primary":
                          isActiveRoute(currentPathName as string, item.href),
                      },
                    )}
                    href={item.href}
                    key={item.href}
                    onOpenChange={setOpen}
                  >
                    {item.title}
                  </MobileLink>
                ))}
              </nav>
              <div className="absolute bottom-0 right-0">
                <ModeToggle />
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface MobileLinkProps extends LinkProps {
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
