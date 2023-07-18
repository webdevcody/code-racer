import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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

export default function Contributor({ contributor }: ContributorProps) {
  const abbreviatedName = contributor?.login.toUpperCase().slice(0, 2) ?? "Co";
  return (
    <li key={contributor.id} className="flex gap-4 p-1 rounded-full">
      <Card className="w-full">
        <CardContent className="inline-flex py-4 items-center top-[20%]">
          <div className="">
            <Avatar className="w-11 h-11">
              <AvatarImage
                src={contributor.avatar_url}
                alt={contributor.login}
              />
              <AvatarFallback className="text-primary bg-secondary font-bold">
                {abbreviatedName}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col ml-4">
            <p className="text-base font-medium leading-none">
              {contributor.login}
            </p>
            <p className="mt-1 text-base text-muted-foreground">
              {contributor.contributions} contributions
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
