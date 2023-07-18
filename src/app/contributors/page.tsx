import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";
import Contributor from "./contributor";
import { GitHubUser } from "./contributor";

type GitHubCommitActivity = number[];

async function getContributors(): Promise<GitHubUser[] | []> {
  const url = siteConfig.api.github.githubContributors;

  try {
    const response = await fetch(url, {
      // headers: {
      //   Authorization: "Bearer " + siteConfig.api.github.accessToken,
      // },
      next: {
        revalidate: siteConfig.api.github.cacheRevalidationInterval
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GitHubUser[] = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred", error);
    return [];
  }
}

async function getWeeklyCommitActivity() : Promise<GitHubCommitActivity[] | []>{
  const url = siteConfig.api.github.githubWeeklyActivity;
  try {
    const response = await fetch(url, {
      // headers: {
      //   Authorization: "Bearer " + siteConfig.api.github.accessToken,
      // },
      next: {
        revalidate: siteConfig.api.github.cacheRevalidationInterval
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GitHubCommitActivity[] = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred", error);
    return [];
  }
}

export default async function ContributorsPage() {
  const contributors = await getContributors();
  const commitActivity = await getWeeklyCommitActivity();
  const [_, additions, deletions] = commitActivity.length > 0 ? commitActivity[0] : [0,0,0];
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Contributors"
        description="All the project contributors"
      />
      <br />
      <div className="flex flex-col justify-start items-center gap-3">
        <p className="font-md text-muted-foreground">This weeks: <span className="text-green-500">+{additions} additions</span> <span className="text-red-500">-{Math.abs(deletions)} deletions</span></p>
        <div className="flex justify-start w-72 h-2 bg-red-500 rounded-full overflow-clip box-border">
          <span className="h-full bg-green-500 box-border" style={{width: `${(additions / (additions + Math.abs(deletions))) * 100}%`}}></span>
        </div>
      </div>
      <ul className="grid gap-8 mt-8 list-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contributors.map((contributor) => (
          <Contributor key={contributor.id} contributor={contributor} />
        ))}
      </ul>
    </div>
  );
}
