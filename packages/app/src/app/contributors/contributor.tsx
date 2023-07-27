import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AdditionsDeletions from "./_components/additions-deletions";
import ProportionBarChart from "./_components/proportion-bar-chart";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import GitHubCommitDisplay from "./_components/github-commit-display";
import { Suspense } from "react";
export interface GitHubUserCommitActivity {
  login: string; // username
  additions: number;
  deletions: number;
}

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
  contributorsActivity: GitHubUserCommitActivity;
}

export default function Contributor({
  contributor,
  contributorsActivity,
}: ContributorProps) {
  const abbreviatedName = contributor?.login.toUpperCase().slice(0, 2) ?? "Co";
  const { additions, deletions } = contributorsActivity ?? {
    additions: 0,
    deletions: 0,
  };
  return (
    <li key={contributor.id} className="flex gap-4 p-1 rounded-full">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="w-full transition-colors duration-100 hover:bg-secondary border-primary">
            <a href={contributor.html_url} target="_blank">
              <CardContent className="inline-flex py-4 items-center top-[20%] w-full">
                <div className="">
                  <Avatar className="w-11 h-11">
                    <AvatarImage
                      src={contributor.avatar_url}
                      alt={contributor.login}
                    />
                    <AvatarFallback className="font-bold text-primary bg-secondary">
                      {abbreviatedName}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col w-full ml-4">
                  <p className="text-base font-medium leading-none">
                    {contributor.login}
                  </p>
                  <p className="mt-1 text-base text-muted-foreground">
                    {contributor.contributions} contributions
                  </p>
                  <AdditionsDeletions
                    additions={additions}
                    deletions={deletions}
                  />
                  <ProportionBarChart
                    a={additions}
                    b={deletions}
                    className="w-full h-3 mt-1"
                  />
                </div>
              </CardContent>
            </a>
          </Card>
        </HoverCardTrigger>
        <HoverCardContent className="p-2 w-80">
          <Suspense fallback="Loading...">
            <GitHubCommitDisplay contributor={contributor} />
          </Suspense>
        </HoverCardContent>
      </HoverCard>
    </li>
  );
}
