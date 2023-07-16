import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "./chart";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FirstRaceBadge } from "./first-race-badge";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Voting } from "./voting";
import { Badge } from "@/components/ui/badge";
import {
  getFirstRaceBadge,
  getUserResultsForSnippet,
  getCurrentRaceResult,
} from "./loaders";
import { Achievement, SnippetVote } from "@prisma/client";
import {
  ParsedRacesResult,
  ResultsChartProps,
  ResultCardProps,
} from "@/types/result";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

export default async function ResultsChart({
  searchParams,
}: ResultsChartProps) {
  const user = await getCurrentUser();
  const snippetId = searchParams.snippetId;

  if (!snippetId)
    return (
      <div className="flex flex-col items-center justify-center gap-10 mt-20">
        <Heading title="Oops, Something went wrong" />
        <Link
          className={cn(buttonVariants(), "whitespace-nowrap")}
          href="/race"
        >
          Go back
        </Link>
      </div>
    );

  let usersVote: SnippetVote | undefined | null;
  let firstRaceBadge: Achievement | undefined;
  let currentRaceResult: ResultCardProps[] = [{} as ResultCardProps];
  let raceResults: ParsedRacesResult[] = [{} as ParsedRacesResult];

  if (user) {
    firstRaceBadge = await getFirstRaceBadge();
    usersVote = await prisma.snippetVote.findUnique({
      where: {
        userId_snippetId: {
          userId: user.id,
          snippetId: searchParams.snippetId,
        },
      },
    });
    currentRaceResult = await getCurrentRaceResult(searchParams.snippetId);
    raceResults = await getUserResultsForSnippet(searchParams.snippetId);
  }

  return (
    <div className="w-auto">
      <div className="flex flex-col justify-center gap-4 mt-5">
        {firstRaceBadge && <FirstRaceBadge image={firstRaceBadge.image} />}
        <p className="text-primary text-center text-xl">
          Result for your current Race
        </p>
        <div className="grid grid-cols-2 gap-3 mx-auto md:grid-cols-4 md:gap-6">
          {currentRaceResult.map((c, idx) => {
            return (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-center">{c.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">{c.value}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col p-8 rounded-xl">
        <div className="flex flex-wrap justify-center gap-4">
          <p className="text-primary text-center text-xl">
            Your progress on this snippet
          </p>
          <Chart raceResult={raceResults} />
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
