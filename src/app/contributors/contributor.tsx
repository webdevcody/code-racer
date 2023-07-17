import Avatar from "@/components/ui/avatar";

export interface GitHubUser {
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



interface ContributorProps {
    contributor: GitHubUser;
}

export default function Contributor({ contributor } : ContributorProps) {
    return (
        <li
            key={contributor.id}
            className="flex gap-4 bg-black p-1 rounded-full"
          >
            <Avatar img={contributor.avatar_url} nameAbbreviation={contributor.login.slice(0, 2)} size={"md"} />
            <a href={contributor.html_url} className=" self-center">
              {contributor.login}
            </a>
            <span className="self-center font-thin">-</span>
            <span className="self-center font-thin text-xl">
              {contributor.contributions} contributions
            </span>
          </li>
    )
}