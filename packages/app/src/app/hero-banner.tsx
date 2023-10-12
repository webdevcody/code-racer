import Link from "next/link";
import TitleBackdropSvg from "./title-backdrop-svg";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative min-h-[300px] md:min-h-[70vh] w-full md:w-3/5 mb-4 md:mb-0 before:content[''] before:w-full before:h-full before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:bg-gradient-to-r before:from-background before:via-transparent before:to-background">
      <TitleBackdropSvg />
      <div className="absolute top-[50%] max-md:left-[50%] max-md:translate-x-[-50%] max-md:mx-auto translate-y-[-50%] text-center md:text-left">
        <h1 className="text-5xl leading-normal font-special lg:text-7xl xl:text-8xl md:leading-none color-primary">
          CodeRacer
        </h1>
        <p className="my-2 text-lg md:text-2xl color-primary">
          Test your typing speed and race against other coders
        </p>
        <div className="my-10  max-md:flex max-md:items-center max-md:justify-center">
          <Link
            href={"/race"}
            title="Start Racing"
            prefetch
            className="flex items-center gap-2 px-4 py-2 font-black tracking-wider text-black transition-colors rounded-md w-fit bg-warning md:text-2xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:bg-accent hover:bg-accent hover:text-accent-foreground"
            data-cy="start-racing-button"
          >
            Start Racing <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
