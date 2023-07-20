import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";
import Contributor from "./contributor";
import { GitHubUser, GitHubUserCommitActivity } from "./contributor";
import AdditionsDeletions from "./_components/additions-deletions";
import ProportionBarChart from "./_components/proportion-bar-chart";
import Time from "@/components/ui/time";

type GitHubRepoCommitActivity = number[];

async function getContributorsActivity(
  contributors: GitHubUser[],
): Promise<GitHubUserCommitActivity[]> {
  const url = siteConfig.api.github.githubContributorActivity;
  const commitActivity: GitHubUserCommitActivity[] = [];
  try {
    const response = await fetch(url, {
      next: {
        revalidate: siteConfig.api.github.cacheRevalidationInterval,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();
    contributors
      .map((contributor) => contributor.login)
      .forEach((username) => {
        const activity = data.find((e) => e.author.login === username);
        if (activity) {
          const activityAllTime = activity.weeks.reduce(
            (
              accumulator: GitHubUserCommitActivity,
              currentValue: { a: number; d: number; w: number; c: number },
            ) => ({
              ...accumulator,
              additions: currentValue.a + accumulator.additions,
              deletions: currentValue.d + accumulator.deletions,
            }),
            { additions: 0, deletions: 0, login: username },
          );
          commitActivity.push(activityAllTime);
        }
      });
    // console.debug(commitActivity);
    return commitActivity;
  } catch (error) {
    console.error("An error occurred", error);
    return [];
  }
}

async function getContributors(): Promise<GitHubUser[] | []> {
  const url = siteConfig.api.github.githubContributors;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: siteConfig.api.github.cacheRevalidationInterval,
      },
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

async function getRepoWeeklyCommitActivity(): Promise<
  GitHubRepoCommitActivity[] | []
> {
  const url = siteConfig.api.github.githubWeeklyActivity;
  try {
    const response = await fetch(url, {
      next: {
        revalidate: siteConfig.api.github.cacheRevalidationInterval,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GitHubRepoCommitActivity[] = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred", error);
    return [];
  }
}

export default async function ContributorsPage() {
  const contributors = await getContributors();
  const contributorCommitActivities = await getContributorsActivity(
    contributors,
  );
  const repoCommitActivity = await getRepoWeeklyCommitActivity();
  const [since, additions, deletions] =
    repoCommitActivity.length > 0
      ? repoCommitActivity[repoCommitActivity.length - 1]
      : [0, 0, 0];
  const sinceDate = new Date(since * 1000); // `since` is in Unix time (second)
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Contributors"
        description="All the project contributors"
      />
      <br />
      <div className="flex flex-col items-center justify-start gap-3">
        <div className="w-[80vw] md:w-[70vw] lg:w-[50vw] xl:w-[600px] flex flex-col gap-2 justify-start items-center">
          <p className="text-2xl font-bold text-center text-secondary-foreground">
            Since <Time date={sinceDate} />
          </p>
          <AdditionsDeletions
            verbose
            additions={additions}
            deletions={deletions}
            className="w-full"
          />
          <ProportionBarChart
            a={additions}
            b={deletions}
            className="w-full h-4"
          />
        </div>
      </div>
      <ul className="grid gap-8 mt-8 list-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contributors.map((contributor) => (
          <Contributor
            key={contributor.id}
            contributor={contributor}
            contributorsActivity={
              contributorCommitActivities.find(
                (e) => e.login === contributor.login,
              ) ?? { additions: 0, deletions: 0, login: contributor.login }
            }
          />
        ))}
      </ul>
    </div>
  );
}
