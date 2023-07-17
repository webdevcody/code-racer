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
  ParsedRacesResult,
} from "./loaders";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import { User } from "next-auth";

async function AuthenticatedPage({
  resultId,
  user,
}: {
  resultId: string;
  user: User;
}) {
  if (!resultId)
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
  const currentRaceResult = await getCurrentRaceResult(resultId);

  if (!currentRaceResult) {
    throw new Error("no result found with this id");
  }

  const usersVote = await prisma.snippetVote.findUnique({
    where: {
      userId_snippetId: {
        userId: user.id,
        snippetId: currentRaceResult.snippetId,
      },
    },
  });
  const firstRaceBadge = await getFirstRaceBadge();
  let raceResults: ParsedRacesResult[] = [];
  let cardObjects = [] as { title: string; value: string | undefined }[];

  if (!currentRaceResult) {
    throw new Error("race result not found");
  }

  raceResults = await getUserResultsForSnippet(currentRaceResult.snippetId);
  cardObjects = [
    {
      title: "CPM",
      value: currentRaceResult?.cpm.toString(),
    },
    {
      title: "Accuracy",
      value: currentRaceResult?.accuracy
        ? `${Number(currentRaceResult.accuracy)}%`
        : "0%",
    },
    {
      title: "Misses",
      value: currentRaceResult?.errorCount?.toString(),
    },
    {
      title: "Time Taken",
      value: `${currentRaceResult?.takenTime}s`,
    },
  ];

  return (
    <div className="w-auto">
      <div className="flex flex-col justify-center gap-4 mt-5">
        {firstRaceBadge && <FirstRaceBadge image={firstRaceBadge.image} />}
        <Heading
          centered
          title="Your Race Results"
          description="You did great! Checkout your race results below"
        />
        <div className="grid grid-cols-2 gap-3 mx-auto md:grid-cols-4 md:gap-6">
          {cardObjects.map((c, idx) => {
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
        {currentRaceResult && (
          <Voting
            snippetId={currentRaceResult.snippetId}
            userId={user?.id ?? undefined}
            usersVote={usersVote ?? undefined}
          />
        )}
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

function UnauthenticatedPage() {
  return <>TODO: Results are not implmemented for unauthenticated users yet</>;
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { resultId: string };
}) {
  const user = await getCurrentUser();

  return user ? (
    <AuthenticatedPage user={user} resultId={searchParams.resultId} />
  ) : (
    <UnauthenticatedPage />
  );
}
