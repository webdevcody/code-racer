import Link from "next/link";
import TitleBackdropSvg from "./titleBackdropSvg";

export default function HeroBanner() {
  return (
    <div className="relative mb-4 md:mb-0">
      <TitleBackdropSvg />
      <div className="absolute top-[50%] max-sm:left-[50%] max-sm:translate-x-[-50%] translate-y-[-50%] text-center md:text-left">
        <h1 className="text-5xl leading-normal md:text-7xl md:leading-relaxed color-primary">
          Code Racer
        </h1>
        <h2 className="text-lg md:text-2xl color-primary italic">
          The Ultimate Coding Challenge
        </h2>
        <div className="my-7">
          <Link
            href={"/race"}
            title="View Profile Picture"
            prefetch
            className="bg-yellow-500 rounded-md text-sm md:text-2xl font-medium italic ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  focus:bg-accent hover:bg-accent hover:text-accent-foreground px-4 py-2"
          >
            {"Start Racing"}
          </Link>
        </div>
      </div>
    </div>
  );
}
