import { GitHubUser } from "../contributor";
import { getGitHubAuthorizationToken, siteConfig } from "@/config/site";

export interface GitHubCommit {
  commit: {
    message: string;
  };
  html_url: string;
  author: GitHubUser;
}

interface GitHubCommitProps {
  contributor: GitHubUser;
  displayLast?: number;
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

const MAX_MESSAGE_SIZE = 30;

export default async function GitHubCommitDisplay({
  contributor,
  displayLast = 5,
}: GitHubCommitProps) {
  const commitList = await getContributorCommitList(contributor, displayLast);
  return (
    <>
      <p className="p-2 font-bold texxt-center">Last {displayLast} commits</p>
      <ol className="flex-col items-stretch justify-start w-full gap-2">
        {commitList.map((c, index) => (
          <a key={index} href={c.html_url} target="_blank">
            <li className="p-2 rounded-lg cursor-pointer hover:bg-secondary">
              <p className="text-md">
                {c.commit.message.slice(0, MAX_MESSAGE_SIZE)}...
              </p>
            </li>
          </a>
        ))}
      </ol>
    </>
  );
}
