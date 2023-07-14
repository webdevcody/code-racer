import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "./chart";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FirstRaceBadge } from "./first-race-badge";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Voting } from "./voting";
import { Badge } from "@/components/ui/badge";

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
  if (!user || !user.id) notFound();
  const firstRaceBadge = await prisma.$transaction(
    async (tx) => {
      const firstRaceAchievement = await tx.achievement.findFirst({
        where: {
          name: "First Race",
        },
      });
      if (!firstRaceAchievement) {
        return null;
      }

      const userFirstRaceAchievement = await tx.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId: user.id,
            achievementId: firstRaceAchievement.id,
          },
        },
      });
      if (!userFirstRaceAchievement) {
        await tx.userAchievement.create({
          data: {
            achievementId: firstRaceAchievement.id,
            userId: user.id,
          },
        });

        return firstRaceAchievement.image;
      }
      return null;
    },
    {
      timeout: 10_000,
    },
  );

  const usersVote = await prisma.snippetVote.findUnique({
    where: {
      userId_snippetId: {
        userId: user.id,
        snippetId: searchParams.snippetId,
      },
    },
  });

  return (
    <div className="w-auto">
      <div className="flex flex-col justify-center gap-4 mt-5">
        <FirstRaceBadge image={firstRaceBadge} />
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
          userId={user.id}
          usersVote={usersVote ?? undefined}
        />
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Badge variant="outline">
          <Badge variant="secondary" className="mr-2">tab</Badge>
          <span>+</span>
          <Badge variant="secondary" className="mx-2">enter</Badge>
          <span>restart game</span>
        </Badge>

        {/* <span className={buttonVariants()}>tab</span> <span>+</span>
        <span className={buttonVariants()}>enter</span> <span>-</span> */}
      </div>
    </div>
  );
}
