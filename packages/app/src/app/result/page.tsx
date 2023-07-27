import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart, { ParentCurrentChart } from "./chart";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { Voting } from "./voting";
import { Badge } from "@/components/ui/badge";
import {
  getUserResultsForSnippet,
  getCurrentRaceResult,
  ParsedRacesResult,
  getSnippetVote,
} from "./loaders";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import { User } from "next-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReplayCode } from "./replay-timestamps";
import { getSnippetById } from "../race/(play)/loaders";
import { TopTable } from "./topten";
import { notFound } from "next/navigation";
import { RaceAchievementBadges } from "./race-achievement-badges";

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

  if (!currentRaceResult) notFound();

  const usersVote = await getSnippetVote(currentRaceResult.snippetId);
  const currentSnippet = await getSnippetById(currentRaceResult.snippetId);

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
    <div className="w-auto mb-32 lg:mb-40">
      <div className="flex flex-col justify-center gap-4 mt-5">
        <RaceAchievementBadges />
        <Heading
          centered
          title="Your Race Results"
          description="You did great! View your race results below"
        />
        <div className="grid grid-cols-2 gap-3 mx-auto md:grid-cols-4 md:gap-6">
          {cardObjects.map((c, idx) => {
            return (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-center text-warning">
                    {c.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">{c.value}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col px-8 rounded-xl">
        <Tabs defaultValue="Current" className="w-full m-5">
          <TabsList className="m-5">
            <TabsTrigger value="Current">Current</TabsTrigger>
            <TabsTrigger value="Replay">Replay</TabsTrigger>
            <TabsTrigger value="TopTen">Top 10</TabsTrigger>
            <TabsTrigger value="History">History</TabsTrigger>
          </TabsList>
          <TabsContent value="Current">
            <span className="text-2xl mx-auto text-primary flex-wrap sm:hidden">
              View in Larger Screen to Unlock Exciting Features!
            </span>
            <ParentCurrentChart code={currentSnippet?.code} />
          </TabsContent>
          <TabsContent value="History">
            <Chart raceResult={raceResults} />
          </TabsContent>
          <TabsContent value="Replay">
            <ReplayCode code={currentSnippet?.code} />
          </TabsContent>
          <TabsContent value="TopTen">
            <TopTable snippetId={currentSnippet?.id} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 p-2">
        <Link
          title="Retry"
          className={cn(buttonVariants(), "gap-2 text-accent")}
          href={`/race/practice?snippetId=${currentRaceResult.snippetId}`}
          data-cy="race-button"
        >
          <Icons.refresh className="w-5 h-5" aria-hidden="true" /> Retry
        </Link>
        <Link
          title="New Race"
          className={cn(buttonVariants(), "text-accent")}
          href="/race"
        >
          <Icons.chevronRight className="w-5 h-5" aria-hidden="true" /> New Race
        </Link>
      </div>

      <div className="flex items-center justify-center m-2">
        <Badge
          variant="outline"
          className="flex items-center justify-center text-base border-2"
        >
          <Badge variant="secondary" className="text-warning">
            Tab
          </Badge>
          <span className="m-1">+</span>
          <Badge variant="secondary" className="text-warning">
            Enter
          </Badge>
          <span className="m-1">Restart Game</span>
        </Badge>
      </div>

      <div className="m-2">
        {currentRaceResult && (
          <Voting
            snippetId={currentRaceResult.snippetId}
            userId={user?.id ?? undefined}
            usersVote={usersVote ?? undefined}
          />
        )}
      </div>
    </div>
  );
}

async function UnauthenticatedPage({ snippetId }: { snippetId: string }) {
  const currentSnippet = await getSnippetById(snippetId);

  return (
    <div className="w-auto mb-32 lg:mb-40">
      <div className="flex flex-col justify-center gap-4 mt-5">
        <Heading
          centered
          title="Your Race Results"
          description="You did great! View your race results below"
        />
      </div>
      <div className="flex flex-col px-8 rounded-xl">
        <Tabs defaultValue="Current" className="w-full m-5">
          <TabsList className="m-5">
            <TabsTrigger value="Current">Current</TabsTrigger>
            <TabsTrigger value="Replay">Replay</TabsTrigger>
            <TabsTrigger value="TopTen">Top 10</TabsTrigger>
          </TabsList>
          <TabsContent value="Current">
            <span className="text-2xl mx-auto text-primary flex-wrap sm:hidden">
              View in Larger Screen to Unlock Exciting Features!
            </span>
            <ParentCurrentChart code={currentSnippet?.code} />
          </TabsContent>
          <TabsContent value="Replay">
            <ReplayCode code={currentSnippet?.code} />
          </TabsContent>
          <TabsContent value="TopTen">
            <TopTable snippetId={currentSnippet?.id} />
            <h1 className="text-lg mx-auto text-muted-foreground">
              Login to be able to get to the top 10!
            </h1>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 p-2">
        <Link
          title="Retry"
          className={cn(buttonVariants(), "gap-2 text-accent")}
          href={`/race/practice?snippetId=${snippetId}`}
        >
          <Icons.refresh className="w-5 h-5" aria-hidden="true" /> Retry
        </Link>
        <Link
          title="New Race"
          className={cn(buttonVariants(), "text-accent")}
          href="/race"
        >
          <Icons.chevronRight className="w-5 h-5" aria-hidden="true" /> New Race
        </Link>
      </div>

      <div className="flex items-center justify-center m-2">
        <Badge
          variant="outline"
          className="flex items-center justify-center text-base border-2"
        >
          <Badge variant="secondary" className="text-warning">
            Tab
          </Badge>
          <span className="m-1">+</span>
          <Badge variant="secondary" className="text-warning">
            Enter
          </Badge>
          <span className="m-1">Restart Game</span>
        </Badge>
      </div>
    </div>
  );
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { resultId: string; snippetId: string };
}) {
  const user = await getCurrentUser();

  return user ? (
    <AuthenticatedPage user={user} resultId={searchParams.resultId} />
  ) : (
    <UnauthenticatedPage snippetId={searchParams.snippetId} />
  );
}
