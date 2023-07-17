import {
  CheckIcon,
  Cross2Icon,
  GitHubLogoIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
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
  ThumbsUp,
  ThumbsDown,
  type Icon as LucideIcon,
  Loader2,
  SquareDashedBottomCode,
  Car,
  Eye,
  PlusCircle,
  Trash,
  MoreVertical,
  LucideProps,
  Keyboard,
  Crown,
} from "lucide-react";

import Image from "next/image";

export type Icon = LucideIcon;

export const Icons = {
  // TODO: replace me with an svg of the logo
  logo: ({
    width,
    height,
  }: {
    width: number | `${number}`;
    height: number | `${number}`;
  }) => (
    <Image
      unoptimized
      src="/static/logo.png"
      width={width}
      height={height}
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
  review: FileCheck2,
  thumbsUp: ThumbsUp,
  thumbsDown: ThumbsDown,
  spinner: Loader2,
  cross: Cross2Icon,
  check: CheckIcon,
  snippet: SquareDashedBottomCode,
  race: Car,
  eye: Eye,
  addCircle: PlusCircle,
  trash: Trash,
  ellipsis: MoreVertical,
  raceCar: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M408.29 262.879a35.125 35.125 0 1 0 35.125 35.125a35.17 35.17 0 0 0-35.125-35.125zm0 62.873a27.736 27.736 0 1 1 27.736-27.737a27.736 27.736 0 0 1-27.736 27.748zm8.876-27.737a8.876 8.876 0 1 1-8.876-8.875a8.876 8.876 0 0 1 8.876 8.875zm-265.538 0a35.125 35.125 0 1 0-35.126 35.126a35.17 35.17 0 0 0 35.126-35.126zm-35.126 27.737a27.736 27.736 0 1 1 27.737-27.737a27.736 27.736 0 0 1-27.737 27.748zm345.452-21.823a53.997 53.997 0 1 0-107.617-5.925a53.665 53.665 0 0 0 5.447 23.61H165.008a53.986 53.986 0 1 0-101.849-15.211C37.542 295.64 21 278.033 21 250.186c0-28.846 86.87-69.418 142.122-71.327v34.094a24.83 24.83 0 0 0 24.83 24.83h47.517a24.774 24.774 0 0 0 24.409-20.758s-1.62-21.668-6.813-25.518l3.407-2.54l24.474 28.08h94.104c63.994-.022 115.95 23.42 115.95 52.266c0 13.314-10.973 25.396-29.046 34.616zm-336.576-5.925a8.876 8.876 0 1 1-8.876-8.876a8.876 8.876 0 0 1 8.876 8.887z"
      />
    </svg>
  ),
  darts: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M134.745 22.098c-4.538-.146-9.08 1.43-14.893 7.243c-5.586 5.586-11.841 21.725-15.248 35.992c-.234.979-.444 1.907-.654 2.836l114.254 105.338c-7.18-28.538-17.555-59.985-29.848-86.75c-11.673-25.418-25.249-46.657-37.514-57.024c-6.132-5.183-11.56-7.488-16.097-7.635zM92.528 82.122L82.124 92.526L243.58 267.651l24.072-24.072L92.528 82.122zm-24.357 21.826c-.929.21-1.857.42-2.836.654c-14.267 3.407-30.406 9.662-35.993 15.248c-5.813 5.813-7.39 10.355-7.244 14.893c.147 4.538 2.452 9.965 7.635 16.098c10.367 12.265 31.608 25.842 57.025 37.515c26.766 12.293 58.211 22.669 86.749 29.848L68.17 103.948zM280.899 255.79l-25.107 25.107l73.265 79.469l31.31-31.31L280.9 255.79zm92.715 85.476l-32.346 32.344l2.07 2.246c.061.058 4.419 4.224 10.585 6.28c6.208 2.069 12.71 2.88 21.902-6.313c9.192-9.192 8.38-15.694 6.31-21.902c-2.057-6.174-6.235-10.54-6.283-10.59l-2.238-2.065zm20.172 41.059a46.23 46.23 0 0 1-5.233 6.226a46.241 46.241 0 0 1-6.226 5.235L489.91 489.91l-96.125-107.586z"
      />
    </svg>
  ),
  keyboard: Keyboard,
  crown: Crown,
};
