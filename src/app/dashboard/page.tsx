import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CpmChart from "./cpm-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Result } from "@prisma/client";
import AccuracyChart from "./accuracy-chart";
import { RecentRacesTable } from "./recent-races-table";
import PerformanceComparison from "./performance-comparison";
import { Heading } from "@/components/ui/heading";

interface DashboardPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/");

  const { page, per_page, sort } = searchParams;

  // Number of records to show per page
  const take = typeof per_page === "string" ? parseInt(per_page) : 5;

  // Number of records to skip
  const skip = typeof page === "string" ? (parseInt(page) - 1) * take : 0;

  // Column and order to sort by
  const [column, order] =
    typeof sort === "string" ? (sort.split(".") as [keyof Result | undefined, "asc" | "desc" | undefined]) : [];

  // List of recent games.
  const { recentGames, totalRecentGames, maxCpm, maxAccuracy, avarageCpm, avarageAccuracy } = await prisma.$transaction(
    async () => {
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
    }
  );

  const pageCount = totalRecentGames === 0 ? 1 : Math.ceil(totalRecentGames / take);

  return (
    <div className="text-center py-12">
      <Heading title="Dashboard" description="Find your stats" />
      <div className="w-full mt-5">
        <Tabs defaultValue="cpm" className="w-full">
          <TabsList>
            <TabsTrigger value="cpm">Cpm</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          </TabsList>
          <TabsContent value="cpm">
            <PerformanceComparison obj="cpm" usersData={recentGames} />
          </TabsContent>
          <TabsContent value="accuracy">
            <PerformanceComparison obj="accuracy" usersData={recentGames} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="grid grid-cols-1 pb-5 mt-5 md:grid-cols-2">
        <Card className="p-3 md:mr-4">
          <CardHeader>
            <CardTitle className="m-2 text-center">Recent Races</CardTitle>
          </CardHeader>
          {/* recent-races-table w-full max-[600px]:text-sm border-b-2 */}
          <RecentRacesTable data={recentGames} pageCount={pageCount} />
        </Card>

        <Card className="p-3 mt-5 md:mt-0 md:ml-4">
          <CardHeader>
            <CardTitle className="m-2 text-center">Statistics</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <Card className="mb-1 w-fill">
              <CardHeader>
                <CardTitle className="text-xl">Highest Cpm</CardTitle>
              </CardHeader>
              <CardContent>{maxCpm} Cpm</CardContent>
            </Card>
            <Card className="mb-1 w-fill md:ml-2">
              <CardHeader>
                <CardTitle className="text-xl">Highest accuracy</CardTitle>
              </CardHeader>
              <CardContent>{Number(maxAccuracy)}</CardContent>
            </Card>

            <Card className="w-fill max-sm:mb-1">
              <CardHeader>
                <CardTitle className="text-xl">Average Cpm</CardTitle>
              </CardHeader>
              <CardContent>{avarageCpm?.toFixed(2)} Cpm</CardContent>
            </Card>
            <Card className="w-fill max-sm:mb-1 md:ml-2">
              <CardHeader>
                <CardTitle className="text-xl">Average accuracy</CardTitle>
              </CardHeader>
              <CardContent>{Number(avarageAccuracy?.toFixed(2))}%</CardContent>
            </Card>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AccuracyChart recentGames={recentGames} />
        <CpmChart recentGames={recentGames} />
      </div>
    </div>
  );
}
