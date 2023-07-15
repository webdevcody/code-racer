import Link from "next/link";
import TitleBackdropSvg from "./title-backdrop-svg";

export default function HeroBanner() {
  return (
    <div className="relative mb-4 md:mb-0">
      <TitleBackdropSvg />
      <div className="absolute top-[50%] max-sm:left-[50%] max-sm:translate-x-[-50%] translate-y-[-50%] text-center md:text-left">
        <h1 className="text-5xl leading-normal md:text-7xl md:leading-relaxed color-primary">
          Code Racer
        </h1>
        <h2 className="text-lg italic md:text-2xl color-primary">
          The Ultimate Coding Challenge
        </h2>
        <div className="my-7">
          <Link
            href={"/race"}
            title="View Profile Picture"
            prefetch
            className="px-4 py-2 text-sm italic font-medium transition-colors bg-warning rounded-md md:text-2xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:bg-accent hover:bg-accent hover:text-accent-foreground"
          >
            {"Start Racing"}
          </Link>
        </div>
      </div>
    </div>
  );
}
