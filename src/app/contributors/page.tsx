import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";
import Image from "next/image";

interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  contributions: number;
}

async function getContributors(): Promise<GitHubUser[] | []> {
  const url = siteConfig.api.githubContributors;

  try {
    const response = await fetch(url);

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

getContributors();

export default async function ContributorsPage() {
  const contributors = await getContributors();
  return (
    <div className="pt-12">
      <Heading title="Contributors" description="All the project contributors" />
      <br />
      <ul className="mt-3 list-none grid gap-4">
        {contributors.map((contributor) => (
          <li key={contributor.id} className="flex gap-4 bg-black p-1 rounded-full">
            <Image className="rounded-full" src={contributor.avatar_url} alt={contributor.login} width={45} height={45} />
            <a href={contributor.html_url} className=" self-center">{contributor.login}</a>
            <span className="self-center font-thin">-</span>
            <span className="self-center font-thin text-xl">{contributor.contributions} contributions</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
