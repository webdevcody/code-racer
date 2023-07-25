import HeroBanner from "./hero-banner";
import BannerSvg from "./banner-svg";
import { siteConfig } from "@/config/site";

async function getGitHubStars(): Promise<string | null> {
  try {
    const response = await fetch(siteConfig.api.github.githubStars, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${siteConfig.api.github.accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response?.ok) {
      return null;
    }

    const json = await response.json();

    return parseInt(json["stargazers_count"]).toLocaleString();
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const stars = await getGitHubStars();
  return (
    <main className="w-full grow h-fit flex flex-col justify-center min-h-[85vh]">
      <div className="flex flex-col items-center justify-between md:flex-row w-full mt-auto">
        <HeroBanner />
        <BannerSvg
          gearRightClass={"origin-[50%_50%] animate-gear-rotate-left"}
          gearLeftClass={"origin-[50%_50%] animate-gear-rotate-right"}
        />
      </div>
      <div className="mt-auto mb-5 justify-self-end mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        {stars && (
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex"
          >
            <div className="flex items-center justify-center w-10 h-10 space-x-2 border rounded-md border-slate-500 dark:border-neutral-300 hover:bg-slate-900 hover:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 "
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-l-0 border-r-8 border-solid border-y-8 border-y-transparent"></div>
              <div className="flex items-center h-10 px-4 font-medium border rounded-md border-slate-500 hover:bg-slate-900 hover:text-neutral-200 dark:border-neutral-300 dark:hover:bg-neutral-200 dark:hover:text-black">
                {stars} stars on GitHub
              </div>
            </div>
          </a>
        )}
        <p>Proudly Open Source. MIT License.</p>
      </div>
    </main>
  );
}
