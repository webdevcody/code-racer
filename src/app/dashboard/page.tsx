import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CpmChart from "./cpm-chart";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Result } from "@prisma/client";
import AccuracyChart from "./accuracy-chart";
import { RecentRacesTable } from "./recent-races-table";

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

  // List of recent games.
  const {
    recentGames,
    totalRecentGames,
    maxCpm,
    maxAccuracy,
    avarageCpm,
    avarageAccuracy,
  } = await prisma.$transaction(async (tx) => {
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

  const pageCount =
    totalRecentGames === 0 ? 1 : Math.ceil(totalRecentGames / take);

  return (
    <div className="flex flex-col gap-8 container mx-auto mb-8">
      <h1 className="text-4xl m-6 font-bold text-center mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-center m-2">Recent Races</CardTitle>
          </CardHeader>
          {/* recent-races-table w-full max-[600px]:text-sm border-b-2 */}
          <RecentRacesTable data={recentGames} pageCount={pageCount} />
        </Card>

        <Card className="w-[42vw] max-[850px]:w-screen min-[850px]:h-[50vh] mr-4 border-none">
          <CardHeader>
            <CardTitle className="text-center m-2">Statistics</CardTitle>
          </CardHeader>
          <div className="flex flex-col justify-center gap-4 mt-4">
            <div className="flex flex-row justify-center gap-6">
              <Card className="w-[40%]">
                <CardHeader>
                  <CardTitle className="">Highest Cpm</CardTitle>
                </CardHeader>
                <CardContent>{maxCpm} Cpm</CardContent>
              </Card>
              <Card className="w-[40%]">
                <CardHeader>
                  <CardTitle className="">Highest accuracy</CardTitle>
                </CardHeader>
                <CardContent>{Number(maxAccuracy) * 100}%</CardContent>
              </Card>
            </div>
            <div className="flex flex-row justify-center gap-6 max-[850px]:mb-10">
              <Card className="w-[40%]">
                <CardHeader>
                  <CardTitle className="">Average Cpm</CardTitle>
                </CardHeader>
                <CardContent>{avarageCpm?.toFixed(2)} Cpm</CardContent>
              </Card>
              <Card className="w-[40%]">
                <CardHeader>
                  <CardTitle className="">Average accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  {Number(avarageAccuracy?.toFixed(2)) * 100}%
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AccuracyChart recentGames={recentGames} />
        <CpmChart recentGames={recentGames} />
      </div>
    </div>
  );
}
