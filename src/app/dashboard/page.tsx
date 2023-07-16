import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CpmChart from "./cpmChart";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Result } from "@prisma/client";
import AccuracyChart from "./accuracyChart";
import { RecentRacesTable } from "./recentRaces";
import PerformanceComparison from "./performanceComparison";
import { Heading } from "@/components/ui/heading";

interface DashboardPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/");

  const { page, per_page, sort } = searchParams;

  // Number of records to show per page
  const take = typeof per_page === "string" ? parseInt(per_page) : 5;

  // Number of records to skip
  const skip = typeof page === "string" ? (parseInt(page) - 1) * take : 0;

  // Column and order to sort by
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Result | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  // List of recent games, total number of recent games, max cpm, max accuracy, avarage cpm, avarage accuracy
  const {
    recentGames,
    totalRecentGames,
    maxCpm,
    maxAccuracy,
    avarageCpm,
    avarageAccuracy,
  } = await prisma.$transaction(async () => {
    const recentGames = await prisma.result.findMany({
      take,
      skip,
      where: {
        userId: user.id,
      },
      orderBy: {
        [column ?? "createdAt"]: order,
      },
    });

    const totalRecentGames = await prisma.result.count({
      where: {
        userId: user.id,
      },
    });

    const maxCpm = (
      await prisma.result.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          cpm: "desc",
        },
      })
    )?.cpm;

    const maxAccuracy = (
      await prisma.result.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          accuracy: "desc",
        },
      })
    )?.accuracy;

    const aggregations = await prisma.result.aggregate({
      _avg: {
        accuracy: true,
        cpm: true,
      },
      where: {
        userId: user.id,
      },
    });

    return {
      recentGames,
      totalRecentGames,
      maxCpm,
      maxAccuracy,
      avarageCpm: aggregations._avg.cpm,
      avarageAccuracy: aggregations._avg.accuracy,
    };
  });

  const pageCount = (totalRecentGames === 0) ? 1 : Math.ceil(totalRecentGames / take);

  return (
    <>

    </>
  );
}


{/* <div className="text-center ">
  <Heading title="Dashboard" description="Find your stats" />

  <div className="w-full mt-5">
    <PerformanceComparison recentGames={recentGames} />
  </div>
  <div className="grid grid-cols-1 pb-5 mt-5 md:grid-cols-2">
    <Card className="px-3 md:mr-4">
      <RecentRacesTable data={recentGames} pageCount={pageCount} />
    </Card>
  </div>
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
    <AccuracyChart recentGames={recentGames} />
    <CpmChart recentGames={recentGames} />
  </div>
</div> */}