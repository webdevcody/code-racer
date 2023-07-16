import HeroBanner from "./hero-banner";
import BannerSvg from "./banner-svg";

export default async function Home() {
  return (
    <main className="w-full">
      <div className="flex flex-col items-center justify-between md:flex-row w-full">
        <HeroBanner />
        <BannerSvg
          gearRightClass={"origin-[50%_50%] animate-gear-rotate-left"}
          gearLeftClass={"origin-[50%_50%] animate-gear-rotate-right"}
        />
      </div>
    </main>
  );
}
