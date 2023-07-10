import {
  Laptop,
  Moon,
  SunMedium,
  type Icon as LucideIcon,
  LogOut,
  Settings,
  BarChart,
  ChevronDownSquareIcon,
  ChevronLeftSquareIcon,
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
  mobileNavOpen: ChevronDownSquareIcon,
  mobileNavClosed: ChevronLeftSquareIcon,
};
