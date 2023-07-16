import HeroBanner from "./hero-banner";
import BannerSvg from "./banner-svg";

export default async function Home() {
  return (
    <main className="w-full grow h-fit flex flex-col justify-center min-h-[85vh]">
      <div className="flex flex-col items-center justify-between md:flex-row w-full mt-auto">
        <HeroBanner />
        <BannerSvg
          gearRightClass={"origin-[50%_50%] animate-gear-rotate-left"}
          gearLeftClass={"origin-[50%_50%] animate-gear-rotate-right"}
        />
      </div>
      <p className="text-center mt-auto mb-5 justify-self-end">
        Proudly Open Source. MIT License.
      </p>
    </main>
  );
}
