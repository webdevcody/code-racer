import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  BarChart,
  ChevronDownSquareIcon,
  ChevronLeft,
  ChevronLeftSquareIcon,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  Info,
  Laptop,
  LineChart,
  LogOut,
  RefreshCcwIcon,
  Settings,
  Trophy,
  User2,
  FileCheck2,
  type Icon as LucideIcon,
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
  github: GitHubLogoIcon,
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
  trophy: Trophy,
  refresh: RefreshCcwIcon,
  picture: ImageIcon,
  info: Info,
  review: FileCheck2
};
