import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";
import Contributor from "./contributor";
import { GitHubUser } from "./contributor";

async function getContributors(): Promise<GitHubUser[] | []> {
  const url = siteConfig.api.github.githubContributors;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + siteConfig.api.github.accessToken,
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

export default async function ContributorsPage() {
  const contributors = await getContributors();
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Contributors"
        description="All the project contributors"
      />
      <br />
      <ul className="grid gap-8 mt-3 list-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contributors.map((contributor) => (
          <Contributor key={contributor.id} contributor={contributor} />
        ))}
      </ul>
    </div>
  );
}
