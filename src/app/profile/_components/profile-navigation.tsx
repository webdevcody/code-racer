"use client";
import { Button } from "@/components/ui/button";
import { User2, History } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const profileNavigationLinks = [
  {
    text: "User Profile",
    id: "user-profile-navigation",
    title: "Navigate to User Profile",
    href: "/profile",
    icon: User2,
  },
  {
    text: "Race History",
    id: "user-race-history-navigation",
    title: "View Race History",
    href: "/profile/race-history",
    icon: History,
  },
];

const styles = {
  ul: "flex md:flex-col gap-x-2 gap-y-4",
  listText: "hidden xl:inline-block flex-[0.8]",
};

export default function ProfileNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ul className={styles.ul}>
      {profileNavigationLinks.map((link) => {
        const isLinkActive = pathname === link.href;
        return (
          <li key={link.id}>
            <Button
              type="button"
              title={link.title}
              id={link.id}
              name="profile-navigation-buttons"
              variant={"ghost"}
              className={`w-full gap-2${isLinkActive ? " bg-accent" : ""}`}
              aria-current={isLinkActive ? "page" : undefined}
              onMouseEnter={() => router.prefetch(link.href)}
              onClick={() => router.replace(link.href)}
            >
              <span>
                <link.icon width={28} height={28} />
              </span>
              <span className={styles.listText}>{link.text}</span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
