import {
  Laptop,
  Moon,
  SunMedium,
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
  RefreshCcwIcon,
  ImageIcon
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

  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  logout: LogOut,
  settings: Settings,
  chart: BarChart,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronsLeft: ChevronsLeft,
  chevronsRight: ChevronsRight,
  user: User2,
  lineChart: LineChart,
  mobileNavOpen: ChevronDownSquareIcon,
  mobileNavClosed: ChevronLeftSquareIcon,
  refresh: RefreshCcwIcon,
  picture: ImageIcon
};
