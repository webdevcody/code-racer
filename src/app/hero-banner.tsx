import Link from "next/link";
import TitleBackdropSvg from "./titleBackdropSvg";

export default function HeroBanner() {
  return (
    <div className="relative mb-4 md:mb-0">
      <TitleBackdropSvg />
      <div className="absolute top-[50%] translate-y-[-50%] text-center md:text-left">
        <h1 className="text-5xl md:text-7xl leading-relaxed color-primary">
          Code Racer
        </h1>
        <h2 className="text-sm md:text-2xl color-primary italic">
          The Ultimate Coding Challenge
        </h2>
        <div className="py-5">
          <Link
            href={"/race"}
            title="View Profile Picture"
            prefetch
            className="bg-yellow-500 rounded-md md:text-sm text-2xl font-medium italic ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  hover:bg-accent hover:text-accent-foreground px-4 py-2"
          >
            {"Start Racing"}
          </Link>
        </div>
      </div>
    </div>
  );
}
