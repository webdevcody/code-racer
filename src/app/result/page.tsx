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

const card = [
  { title: "WPM", value: "81 %" },
  { title: "Accuracy", value: "90 %" },
  { title: "Rank", value: "20" },
  { title: "Miss", value: "21" },
  { title: "Times", value: "30s" },
];

export default async function ResultsChart() {
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
        console.error("bedge, where badge?")
        return null;
      };

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
  
  return (
    <div className="w-auto">
      <div className="flex flex-col items-center w-full justify-center gap-4 mt-5">
        <FirstRaceBadge image={firstRaceBadge} />
        <div className="grid grid-cols-5 gap-6">
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
      <div className="p-8 flex flex-col rounded-xl">
        <div className="flex flex-wrap justify-center gap-4">
          <Chart />
        </div>
      </div>
      <div
        className="flex flex-wrap items-center justify-center gap-4 p-2"
        tabIndex={-1}
      >
        <Link className={buttonVariants()} href="/race">
          <Icons.chevronRight className="h-5 w-5" aria-hidden="true" />
        </Link>
        <Link className={buttonVariants()} href="/race">
          <Icons.refresh className="h-5 w-5" aria-hidden="true" />
        </Link>
        <Button>
          <Icons.picture className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <span className={buttonVariants()}>tab</span> <span>+</span>
        <span className={buttonVariants()}>enter</span> <span>-</span>
        <span>restart game</span>
      </div>
    </div>
  );
}
