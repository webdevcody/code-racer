import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AdditionsDeletions from "./additions-deletions";
import ProportionBarChart from "./proportion-bar-chart";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import GitHubCommitDisplay from "./github-commit-display";
import { displayNumber } from "../_helpers/utils";

import {
  type ContributorCodeChanges,
  type GitHubContributor,
} from "../_helpers/types";

interface ContributorProps {
  contributor: GitHubContributor;
  contributorsCodeChanges: ContributorCodeChanges;
}

export default function Contributor({
  contributor,
  contributorsCodeChanges,
}: ContributorProps) {
  const abbreviatedName = contributor?.login.toUpperCase().slice(0, 2) ?? "Co";
  const { additions, deletions } = contributorsCodeChanges ?? {
    additions: 0,
    deletions: 0,
  };
  return (
    <li key={contributor.id} className="flex gap-4 p-1 rounded-full">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="w-full transition-colors duration-100 hover:bg-secondary border-primary">
            <a
              href={contributor.html_url}
              target="_blank"
              data-cy="contributor-card"
            >
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
                  <p
                    className="text-base font-medium leading-none"
                    data-cy="contributor-name"
                  >
                    {contributor.login}
                  </p>
                  <p className="mt-1 text-base text-muted-foreground">
                    {displayNumber(contributor.contributions)} contributions
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
          <GitHubCommitDisplay contributor={contributor} />
        </HoverCardContent>
      </HoverCard>
    </li>
  );
}
