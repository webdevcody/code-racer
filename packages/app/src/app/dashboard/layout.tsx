import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dashboardConfig } from "@/config/dashboard";
import { SidebarNav } from "@/components/sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] p-0 md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <ScrollArea className="py-6 pr-6 lg:py-8">
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </ScrollArea>
      </aside>
      <main className="flex w-full flex-col overflow-hidden">{children}</main>
      <div className="md:hidden">
        <ScrollArea className="py-6 pr-6 lg:py-8">
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </ScrollArea>
      </div>
    </div>
  );
}
