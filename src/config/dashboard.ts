import type { NavItem } from "@/types/nav";

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "Races",
      href: "/dashboard/races",
      icon: "raceCar",
    },
    {
      title: "Snippets",
      href: "/dashboard/snippets",
      icon: "snippet",
    },
    {
      title: "Cpm",
      href: "/dashboard/cpm",
      icon: "keyboard",
    },
    {
      title: "Accuracy",
      href: "/dashboard/accuracy",
      icon: "darts",
    },
    {
      title: "Awards",
      href: "/dashboard/awards",
      icon: "crown",
    },
  ] satisfies NavItem[],
};
