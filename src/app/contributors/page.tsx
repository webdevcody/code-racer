import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";
import Contributor from "./contributor";
import { GitHubUser, GitHubUserCommitActivity } from "./contributor";
import AdditionsDeletions from "./_components/additions-deletions";
import ProportionBarChart from "./_components/proportion-bar-chart";
import Time from "@/components/ui/time";
import CountingAnimation from "./_components/counting-animation";
import PaginationBar from "./_components/pagination-bar";
import { redirect } from "next/navigation";

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

    // GitHub response JSON schema
    type GitHubContributorCommitActivity = {
      author: GitHubUser;
      total: number;
      weeks: {
        w: number;
        a: number;
        d: number;
        c: number;
      }[];
    };

    const data: GitHubContributorCommitActivity[] = await response.json();
    contributors
      .map((contributor) => contributor.login)
      .forEach((username) => {
        const activity: GitHubContributorCommitActivity | undefined = data.find(
          (e) => e.author.login === username,
        );
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
    return commitActivity;
  } catch (error) {
    console.error("An error occurred", error);
    return [];
  }
}

async function getContributors(): Promise<GitHubUser[] | []> {
  const searchParams = new URLSearchParams({
    per_page: "100", // per GitHub api docs max is 100
    page: "1",
  });
  const url =
    siteConfig.api.github.githubContributors + "?" + searchParams.toString();

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

export default async function ContributorsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    per_page: string;
  };
}) {
  const { page, per_page } = searchParams;
  if (!page || !per_page) {
    redirect("/contributors?page=1&per_page=30");
  }
  const parsed_page = page ? parseInt(page) : 1;
  const parsed_per_page = per_page
    ? parseInt(per_page) >= 30
      ? 30
      : parseInt(per_page)
    : 30; // Limit to only 30 per page to avoid hitting rate limit
  const sliceStartIndex = (parsed_page - 1) * parsed_per_page;
  const sliceEndIndex = sliceStartIndex + parsed_per_page;
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
        <div className="w-[80vw] md:w-[70vw] lg:w-[50vw] xl:w-[600px] flex flex-col gap-4 justify-start items-center">
          <div className="flex flex-col items-center justify- gap-3">
            <CountingAnimation
              targetNumber={contributors.length}
              className="text-7xl text-primary font-extrabold"
            />
            <p className="text-2xl font-bold text-secondary-foreground">
              Contributors and counting!
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-xl font-semibold text-center text-secondary-foreground">
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
          <PaginationBar
            className="mt-3"
            nextURL={`/contributors?page=${
              parsed_page + 1
            }&per_page=${parsed_per_page}`}
            prevURL={`/contributors?page=${
              parsed_page - 1 < 1 ? 1 : parsed_page - 1
            }&per_page=${parsed_per_page}`}
          />
        </div>
      </div>
      <ul className="grid gap-8 mt-8 list-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contributors
          .slice(sliceStartIndex, sliceEndIndex)
          .map((contributor) => (
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
