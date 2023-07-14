import HeroBanner from "./hero-banner";
import BannerSvg from "./bannerSvg";

export default async function Home() {
  return (
    <main>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <HeroBanner />
        <BannerSvg
          gearRightClass={"origin-[50%_50%] animate-gear-rotate-left"}
          gearLeftClass={"origin-[50%_50%] animate-gear-rotate-right"}
        />
      </div>
    </main>
  );
}
