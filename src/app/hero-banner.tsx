import Link from "next/link";
import TitleBackdropSvg from "./title-backdrop-svg";
import { bruno_ace_sc } from "./layout";
import { cn } from "@/lib/utils";

export default function HeroBanner() {
  return (
    <div className="relative mb-4 md:mb-0 md:w-3/5 before:content[''] before:w-full before:h-full before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:bg-gradient-to-r before:from-background/70 before:via-transparent before:to-background">
      <TitleBackdropSvg />
      <div className="absolute top-[50%] max-sm:left-[50%] max-sm:translate-x-[-50%] max-sm:mx-auto translate-y-[-50%] text-center md:text-left">
        <h1
          className={cn(
            bruno_ace_sc.className,
            "text-5xl leading-normal md:text-8xl md:leading-none color-primary clamp",
          )}
        >
          Code Racer
        </h1>
        <p className="text-lg md:text-2xl color-primary my-2">
          Test your typing speed and compare against other coders
        </p>
        <div className="my-9">
          <Link
            href={"/race"}
            title="View Profile Picture"
            prefetch
            className="px-4 py-2 text-sm italic font-medium transition-colors bg-warning rounded-md md:text-2xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:bg-accent hover:bg-accent hover:text-accent-foreground"
          >
            Start Racing
          </Link>
        </div>
      </div>
    </div>
  );
}
