import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  Laptop,
  type Icon as LucideIcon,
  LogOut,
  Settings,
  BarChart,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  ChevronLeft,
  ChevronDownSquareIcon,
  ChevronLeftSquareIcon,
  User2,
  LineChart,
} from "lucide-react";

import Image from "next/image";

export type Icon = LucideIcon;

export const Icons = {
  // FIX: until we have an svg
  logo: () => (
    <Image
      unoptimized
      src="/static/logo.png"
      width={30}
      height={30}
      alt="Code Racer Logo"
    />
  ),

  sun: SunIcon,
  moon: MoonIcon,
  laptop: Laptop,
  logout: LogOut,
  settings: Settings,
  chart: BarChart,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronsLeft: ChevronsLeft,
  chevronsRight: ChevronsRight,
  profile: User2,
  lineChart: LineChart,
  mobileNavOpen: ChevronDownSquareIcon,
  mobileNavClosed: ChevronLeftSquareIcon,
};
