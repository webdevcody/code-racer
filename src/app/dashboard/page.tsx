import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Result, Snippet } from "@prisma/client";
import { RecentRacesTable } from "./components/recentRaces";
import ProgressBar from "./components/progressBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RecentSnippetsTable } from "./components/recentSnippets";

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
    totalUsers,
    totalGames,
    totalSnippets,
    totalUserGames,
    totalUserSnippets,
    recentGames,
    recentSnippets,
    userRank,
  } = await prisma.$transaction(async () => {
    const totalUsers = await prisma.user.count();
    const totalGames = await prisma.result.count();
    const totalSnippets = await prisma.snippet.count();

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

    const recentSnippets = await prisma.snippet.findMany({
      take,
      skip,
      where: {
        userId: user.id,
      }
    });

    const totalUserGames = await prisma.result.count({
      where: {
        userId: user.id,
      },
    });

    const totalUserSnippets = await prisma.snippet.count({
      where: {
        userId: user.id,
      },
    });

    const userRank = 1;

    return {
      totalUsers,
      totalGames,
      totalSnippets,
      totalUserGames,
      totalUserSnippets,
      recentGames,
      recentSnippets,
      userRank,
    };
  });

  const userPageCount = (totalUserGames === 0) ? 1 : Math.ceil(totalUserGames / take);

  const snippetPageCount = (totalUserSnippets === 0) ? 1 : Math.ceil(totalUserSnippets / take);

  return (
    <Card className="flex sm:flex-col md:flex-row">
      <CardContent className="flex justify-center">
        <div className="flex sm:flex-row md:flex-col gap-5 bg-accent my-2 justify-evenly items-center rounded-full">
          <ProgressBar
            title="Rank"
            size={140}
            value={userRank}
            totalValue={totalUsers}
          />
          <ProgressBar
            title="Races"
            size={100}
            value={totalUserGames}
            totalValue={totalGames}
          />
          <ProgressBar
            title="Snippets"
            size={100}
            value={totalUserSnippets}
            totalValue={totalSnippets}
          />
          <ProgressBar
            title="Coming Soon!"
            size={100}
          />
        </div>
      </CardContent>
      <CardContent className="flex flex-col justify-start mt-3 w-full">
        <Tabs defaultValue="races" className="w-full">
          <TabsList className="grid w-[300px] grid-cols-2">
            <TabsTrigger value="races">Races</TabsTrigger>
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
          </TabsList>
          <TabsContent value="races">
            <RecentRacesTable data={recentGames} pageCount={userPageCount} />
          </TabsContent>
          <TabsContent value="snippets">
            <RecentSnippetsTable data={recentSnippets} pageCount={snippetPageCount} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}


// const maxCpm = (
    //   await prisma.result.findFirst({
    //     where: {
    //       userId: user.id,
    //     },
    //     orderBy: {
    //       cpm: "desc",
    //     },
    //   })
    // )?.cpm;

    // const maxAccuracy = (
    //   await prisma.result.findFirst({
    //     where: {
    //       userId: user.id,
    //     },
    //     orderBy: {
    //       accuracy: "desc",
    //     },
    //   })
    // )?.accuracy;

    // const aggregations = await prisma.result.aggregate({
    //   _avg: {
    //     accuracy: true,
    //     cpm: true,
    //   },
    //   where: {
    //     userId: user.id,
    //   },
    // });


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