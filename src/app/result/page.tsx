import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "./chart";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FirstRaceBadge } from "./first-race-badge";
import { getCurrentUser } from "@/lib/session";
import { Voting } from "./voting";
import { Badge } from "@/components/ui/badge";
import { getFirstRaceBadge } from "./loaders";
import { Achievement, SnippetVote } from "@prisma/client";
import { findUsersVotes } from "../_actions/result";

const card = [
  { title: "WPM", value: "81 %" },
  { title: "Accuracy", value: "90 %" },
  { title: "Rank", value: "20" },
  { title: "Miss", value: "21" },
  { title: "Times", value: "30s" },
];

interface ResultsChartProps {
  searchParams: { snippetId: string };
}

export default async function ResultsChart({
  searchParams,
}: ResultsChartProps) {
  const user = await getCurrentUser();

  let usersVote: SnippetVote | undefined | null;
  let firstRaceBadge: Achievement | undefined | null;

  if (user) {
    const badge = await getFirstRaceBadge();
    firstRaceBadge = badge?.data;

    const votes = await findUsersVotes({
      snippetId: searchParams.snippetId,
      userId: user.id
    });
    usersVote = votes.data;
  }

  return (
    <div className="w-auto">
      <div className="flex flex-col justify-center gap-4 mt-5">
        {firstRaceBadge && <FirstRaceBadge image={firstRaceBadge.image} />}
        <div className="grid grid-cols-2 gap-3 mx-auto md:grid-cols-5 md:gap-6">
          {card.map((c, idx) => {
            return (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>{c.value}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col p-8 rounded-xl">
        <div className="flex flex-wrap justify-center gap-4">
          <Chart />
        </div>
      </div>
      <div
        className="flex flex-wrap items-center justify-center gap-4 p-2"
        tabIndex={-1}
      >
        <Link className={buttonVariants()} href="/race">
          <Icons.chevronRight className="w-5 h-5" aria-hidden="true" />
        </Link>
        <Link className={buttonVariants()} href="/race">
          <Icons.refresh className="w-5 h-5" aria-hidden="true" />
        </Link>
        <Button>
          <Icons.picture className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>
      <div className="my-4">
        <Voting
          snippetId={searchParams.snippetId}
          userId={user?.id ?? undefined}
          usersVote={usersVote ?? undefined}
        />
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Badge variant="outline">
          <Badge variant="secondary" className="mr-2">
            tab
          </Badge>
          <span>+</span>
          <Badge variant="secondary" className="mx-2">
            enter
          </Badge>
          <span>restart game</span>
        </Badge>

        {/* <span className={buttonVariants()}>tab</span> <span>+</span>
        <span className={buttonVariants()}>enter</span> <span>-</span> */}
      </div>
    </div>
  );
}
