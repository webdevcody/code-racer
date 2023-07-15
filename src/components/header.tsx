import { ModeToggle } from "./mode-toggle";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./mobile-nav";
import { MainNav } from "./main-nav";
import { UserDropdown } from "./user-dropdown";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 flex w-full border-b-2 border-warning bg-background/10 backdrop-blur-sm">
      <div className="container flex items-center w-full h-20 space-x-4 sm:space-x-0">
        <div className="flex-1">
          <MainNav items={siteConfig.getHeaderLinks(!!user)} />
        </div>
        <MobileNav />
        <nav className="items-center hidden space-x-4 md:flex">
          <UserDropdown user={user} />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;
