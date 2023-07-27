import {
  type GitHubUser,
  type ContributorCodeChanges,
  type GitHubRepoCommitCodeChanges,
  type GitHubContributor,
  type GitHubCommit,
  type GitHubContributorCommitActivity,
} from "./types";
import { siteConfig, getGitHubAuthorizationToken } from "@/config/site";

export function displayNumber(number: number): string {
  const fixedDecimal = 2;
  const thousand = 1000;
  const million = 1000000;
  if (number >= thousand) {
    return `${(number / thousand).toFixed(fixedDecimal)}K`;
  } else if (number >= million) {
    return `${(number / million).toFixed(fixedDecimal)}M`;
  }

  return number.toString();
}

async function getContributorCodeChanges(
  contributors: GitHubUser[],
): Promise<ContributorCodeChanges[]> {
  const url = siteConfig.api.github.githubContributorActivity;
  const commitActivity: ContributorCodeChanges[] = [];
  try {
    const response = await fetch(url, {
      next: {
        revalidate: siteConfig.api.github.cacheRevalidationInterval,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GitHubContributorCommitActivity[] = await response.json();
    contributors
      .map((contributor) => contributor.login)
      .forEach((username) => {
        const activity: GitHubContributorCommitActivity | undefined | null =
          data.find((e) => e.author.login === username);
        if (activity) {
          const activityAllTime = activity.weeks.reduce(
            (
              accumulator: ContributorCodeChanges,
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

async function getContributors(): Promise<GitHubContributor[]> {
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

    const data: GitHubContributor[] = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred", error);
    return [];
  }
}

async function getRepoWeeklyCodeChanges(): Promise<
  GitHubRepoCommitCodeChanges[]
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

    const data: GitHubRepoCommitCodeChanges[] = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred", error);
    return [];
  }
}

async function getContributorCommitList(
  contributor: GitHubUser,
  take = 5,
): Promise<GitHubCommit[]> {
  const searchParams = new URLSearchParams({
    author: contributor.login,
    per_page: take.toString(),
  });
  const headers = {
    Authorization: getGitHubAuthorizationToken(), // Get access token if have any
  } as HeadersInit;
  const url =
    siteConfig.api.github.githubListCommit + "?" + searchParams.toString();
  try {
    const response = await fetch(url, {
      next: {
        revalidate: siteConfig.api.github.cacheRevalidationInterval,
      },
      headers,
    });
    if (!response.ok) {
      throw new Error("Fetch failed" + url);
    }
    const data: GitHubCommit[] = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred", error);
    return [];
  }
}

export {
  getContributors,
  getContributorCodeChanges,
  getRepoWeeklyCodeChanges,
  getContributorCommitList,
};
